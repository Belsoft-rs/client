import DOTRTC from "dotrtc";
import {cryptoWaitReady} from '@polkadot/util-crypto';
import {Keyring} from '@polkadot/api';
import ObjectLive from "object-live";

import Chat from "./Chat.js";
import config from "../config.js";

const account = new (class {
	#phrase;
	#accountSrKeyring;
	#p2p;
	#chats = {};						// {address: Chat}
	model;

	constructor() {
		this.model = new ObjectLive({
			username: null,
			isAuth: false,
			selectedContact: null,		// contact = {username, name, address}
			contactList: [],			// [contact],
		});
	}

	init(phrase) {
		return new Promise(resolve => {
			cryptoWaitReady().then(() => {
				this.#phrase = phrase;
				const srKeyring = new Keyring({type: 'sr25519'});
				this.#accountSrKeyring = srKeyring.addFromUri(phrase);
				//console.log(`My address: <b>${this.#accountSrKeyring['address']}</b>`);

				this.#p2p = new DOTRTC({
					iceServer: config.iceServer,
					endpoint: config.parachain,
					phrase: phrase,
					onConnectionRequest: connection => {
						let contact;
						(new Promise(resolve => {
							//console.log('connection:', connection);
							if (Chat.isExist(connection.remoteAddressSr)) {			// if already exist in contactList
								resolve(this.#chats[connection.remoteAddressSr]);
							} else {
								//console.log('[chatManager] connection.remoteAddress:', connection);
								this.getUsername(connection.remoteAddressSr).then(username => {
									contact = {
										name: username,
										username: username,
										address: connection.remoteAddressSr
									};
									this.model.data.contactList.push({name: username, username: username, address: connection.remoteAddressSr, tmp: true});
									resolve(Chat.get(contact));
								});
							}
						})).then(chat => {
							chat.model.data.connectionStatus = 'connectionRequest';
							chat.model.data.connection = connection;
							chat.historyAdd(connection.welcomeMsg, false, new Date());
							this.model.data.selectedContact = contact;
						});
					},
					onConnect: (channel) => {
						const chat = Chat.get({address: channel.remoteAddress});
						chat.model.data.connectionStatus = 'connected';
						chat.model.data.channel = channel;
						channel.onMessage(msgBin => {
							const dec = new TextDecoder();
							const message = dec.decode(msgBin);
							chat.historyAdd(message, false, new Date());
						});
					},
					onDisconnect: (channel) => {
						const chat = Chat.get({address: channel.remoteAddress});
						chat.model.data.connectionStatus = 'disconnected';
						chat.model.data.channel = null;
					}
				});

				this.#p2p.onReady().then(() => {
					Promise.all([
						//load contactList
						new Promise(done => {
							this.#p2p.getContactList().then(list => {
								this.model.data.contactList = list;
								console.log('load contactlist:', list, 'this.model:', this.model);
								done();
							});
						}),
						//load own username
						new Promise(done => {
							this.#p2p.getUsername(this.#accountSrKeyring).then(username => {
								if (username) {
									this.model.data.username = username;
									this.model.data.isAuth = true;
								}
								console.log('load username:', this.model.data.username);
								done();
							});
						})
					]).then(resolve);
				});
			});
		});
	}

	register(username) {
		return new Promise(resolve => {
			this.#p2p.register(username).then(() => {
				this.model.data.username = username;
				this.model.data.isAuth = true;
				resolve();
			});
		});
	}

	selectContact(contact) {
		this.model.data.selectedContact = contact;
	}

	connect(cfg) {
		return this.#p2p.connect(cfg);
	}

	addContact(username, address) {
		return this.#p2p.addContact(username, address);
	}

	getUsername(address) {
		return this.#p2p.getUsername(address);
	}

	getAddress(username) {
		return this.#p2p.getAddress(username);
	}
})();

export default account;