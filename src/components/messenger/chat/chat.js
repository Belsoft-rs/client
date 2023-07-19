import css from "./chat.css";
css.install();

import {childNodesRemove} from "../../../utils/htmlElement.js";
import {Tpl_chat, Tpl_message} from "./chat.html";

import account from "../../../services/account.js";
import Chat from "../../../services/Chat.js";

import {dateGet} from "../../../utils/date.js";


const ChatWindow = class extends HTMLElement {
	#chatContents = {};			//address: $chat

	constructor() {
		super();
		account.model.addEventListener('change', 'selectedContact', (cfg) => {
			childNodesRemove(this);
			const $chatContent = this.#chatContentGet(cfg.newValue);		// contact = {username, name, address}
			this.appendChild($chatContent);
		});
	}

	#chatContentGet(contact) {
		if (!this.#chatContents[contact.address]) {
			this.#chatContents[contact.address] = new ChatContent(contact);
		}
		return this.#chatContents[contact.address];
	}
};
customElements.define('x-chatwindow', ChatWindow);



const ChatContent = class ChatContent extends HTMLElement {
	#$chat;
	#$history;
	#chatService;

	constructor(contact) {
		super();
		this.#chatService = Chat.get(contact);

		this.#$chat = new Tpl_chat({
			serviceData: null,		// This data will be synced with `this.chatService.model`
									//	{
									// 		isConnected: false,
									//		isHandshake: false,
									//		channel: null,
									//		contact: contact,
									//		history: []
									//	}
			msg: '',
			enabled: true			//write message locked
		}, this);
		this.appendChild(this.#$chat);
		this.#$history = this.#$chat.querySelector('[name=history]');

		this.#$chat.model.data.serviceData = this.#chatService.model.data;
		this.#chatService.model.bridgeChanges('', this.#$chat.model, 'serviceData');	//sync `chatService.model` with `this.#$chat.model.serviceData`

		this.historyInit();
	}

	onKeydown(e) {
		if (e.code === "Enter") {
			this.send();
		}
	}

	historyInit() {
		childNodesRemove(this.#$history);
		this.#chatService.model.data.history.forEach(log => {
			this.#historyMessageAdd({
				message: log.message,
				isMy: log.isMy,
				date: dateGet(log.date, 'hh:mm')
			});
		});

		this.#chatService.model.addEventListener('set', /history\..*/, cfg => {
			if (cfg.path !== 'history.length') {
				this.#historyMessageAdd({
					message: cfg.newValue.message,
					isMy: cfg.newValue.isMy,
					date: dateGet(cfg.newValue.date, 'hh:mm')
				});
			}
		});
	}

	#historyMessageAdd(cfg) {
		const $msg = new Tpl_message({
			message: cfg.message,
			isMy: cfg.isMy,
			date: cfg.date
		});
		this.#$history.appendChild($msg);
	}

	connectionAccept() {
		this.#chatService.model.data.connectionStatus = 'handshake';
		this.#chatService.model.data.connection.accept();
	}

	connectionDecline() {
		this.#chatService.model.data.connectionStatus = 'disconnected';
		this.#chatService.model.data.channel = null;
	}

	send() {
		this.#chatService.messageSend(this.#$chat.model.data.msg);
		this.#$chat.model.data.msg = '';
	}
};

customElements.define('x-chatcontent', ChatContent);