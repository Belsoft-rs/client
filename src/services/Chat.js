import ObjectLive from "object-live";
import account from "./account.js";

const chats = {};

const Chat = class {
	model;

	constructor(contact) {
		this.model = new ObjectLive({
			connectionStatus: 'disconnected',	// disconnected, handshake, connectionRequest, connected
			connection: null,
			channel: null,
			contact: contact,
			history: []
		});
	}

	historyAdd(message, isMy, date) {
		this.model.data.history.push({message: message, isMy: isMy, date: date});
	}

	messageSend(message) {
		if (!message) {
			return;
		}
		this.historyAdd(message, true, new Date());

		if (this.model.data.connectionStatus === 'disconnected') {
			this.model.data.connectionStatus = 'connecting';
			account.connect({toAddress: this.model.data.contact.address, welcomeMsg: message});
		} else if (this.model.data.connectionStatus === 'connected') {
			let enc = new TextEncoder();
			const messageU8A = enc.encode(message);				//convert to Uint8Array
			this.model.data.channel.sendMessage(messageU8A);
		} else {
			console.log('not connected yet:', this);
		}
	}

	/**
	 * @param contact	{Object}
	 * @returns {*}
	 */
	static get(contact) {
		if (!chats[contact.address]) {
			chats[contact.address] = new Chat(contact);
		}
		return chats[contact.address];
	}

	static isExist(contact) {
		return !!chats[contact.address];
	}
};

export default Chat;