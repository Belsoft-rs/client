import ObjectLive from "object-live";
import account from "./account.js";
import Pool from "pool-handlers";


const Chat = class {
	model;

	constructor(contact) {
		this.model = new ObjectLive({
			isConnected: false,
			isHandshake: false,
			channel: null,
			contact: contact,
			history: []
		});
	}

	historyAdd(message, isMy) {
		this.model.data.history.push({message: message, isMy: isMy});
	}

	messageSend(message) {
		console.log('[chatManager] message send:', message);
		this.historyAdd(message, true);

		if (!this.model.data.isConnected) {
			account.connect({toAddress: this.model.data.contact.address, welcomeMsg: message});
		} else {
			let enc = new TextEncoder();
			const messageU8A = enc.encode(message);		//convert to Uint8Array
			this.model.data.channel.sendMessage(messageU8A);
		}
	}
};

const chatManager = new (class {
	model;
	currentChat = null;
	#chats = {};						// {address: <chat>}
	#onMessageHandler = new Pool();
	#onConnectionHandler = new Pool();

	constructor() {
		this.model = new ObjectLive({
			contact: null,				//currentChat contact
			contactList: [],			//{name,username, address}
		});
		account.onConnectionRequest(connection => {
			(new Promise(resolve => {
				//console.log('connection:', connection);
				if (this.#chats[connection.remoteAddressSr]) {			// if already exist in contactList
					resolve(this.#chats[connection.remoteAddressSr]);
				} else {
					//console.log('[chatManager] connection.remoteAddress:', connection);
					account.getUsername(connection.remoteAddressSr).then(username => {
						const contact = {
							name: username,
							username: username,
							address: connection.remoteAddressSr
						};
						this.contactItemAdd(contact);
						this.currentSet(contact);
						resolve(this.#chatGet(contact));
					});
				}
			})).then(chat => {
				chat.model.data.isHandshake = true;
				chat.historyAdd(connection.welcomeMsg, false);

				let msg = document.createElement("div");
				msg.classList.add('status');
				msg.innerHTML = '<div>> The user `' + chat.model.data.contact.username + '` is trying to contact you.</div><div class="link" name="allowBtn">Allow</div>';
				msg.querySelector('[name=allowBtn]').onclick = () => {
					msg.innerHTML = '> Connecting to `' + chat.model.data.contact.username + '`...';
					account.onConnect(channel => {
						//make filter
						msg.innerHTML = "> Connected";
					});

					connection.accept();
				};
				chat.historyAdd(msg, false);

				this.#onConnectionHandler.run(connection);
			});
		});
		account.onConnect(channel => {
			this.#chats[channel.remoteAddress].model.data.isConnected = true;
			this.#chats[channel.remoteAddress].model.data.channel = channel;
			channel.onMessage(msgBin => {
				const address = channel.remoteAddress;
				const dec = new TextDecoder();
				const message = dec.decode(msgBin);
				this.#chats[address].historyAdd(message, false);
			});
		});
	}

	contactItemAdd(contact) {
		this.model.data.contactList.push(contact);
	}


	/**
	 * @description switch current chat
	 * @param contact			{Object}
	 * @param contact.address	{Object}
	 * @param contact.name		{Object}
	 */
	currentSet(contact) {
		this.model.data.contact = contact;
		this.currentChat = this.#chatGet(contact);
	}

	onMessage(handler) {
		this.#onMessageHandler.push(handler);
	}

	onConnectionRequest(handler) {
		this.#onConnectionHandler.push(handler);
	}

	#chatGet(contact) {
		if (!this.#chats[contact.address]) {
			const chat = this.#chats[contact.address] = new Chat(contact);
			chat.model.addEventListener('set', /history\..*/, cfg => {
				if (cfg.path !== 'history.length') {
					this.#onMessageHandler.run({
						address: contact.address,
						message: cfg.newValue.message,
						isMy: cfg.newValue.isMy
					});
				}
			});
		}
		return this.#chats[contact.address];
	}

})();


export default chatManager;