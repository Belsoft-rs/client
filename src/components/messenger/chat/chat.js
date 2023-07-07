import css from "./chat.css";
css.install();

import account from "../../../services/account.js";

import {Tpl_chat} from "./chat.html";
import chatManager from "../../../services/chatManager.js";

const Chat = class extends HTMLElement {
	#$chat;
	#$history;

	constructor() {
		super();
	}

	connectedCallback() {
		this.#$chat = new Tpl_chat({
			contact: chatManager.model.data.contact,
			msg: '',
			enabled: false
		}, this);
		this.appendChild(this.#$chat);
		this.#$history = this.#$chat.querySelector('[name=history]');

		chatManager.model.addEventListener('change', 'contact', cfg => {
			this.#$chat.model.data.enabled = true;
			this.#$chat.model.data.contact = cfg.newValue;
		});
		chatManager.onMessage(cfg => {
			console.log('onMessage:', cfg);
			//if (chatManager.model.data.contact.address === cfg.address)
			const $msg = document.createElement('div');
			$msg.classList.add('historyMessage');
			$msg.classList.add(cfg.isMy ? 'isMy' : 'isNotMy');
			if (cfg.message instanceof HTMLElement) {
				$msg.appendChild(cfg.message);
			} else {
				$msg.innerHTML = cfg.message;
			}
			this.#$history.appendChild($msg);
		});
	}

	onKeydown(e) {
		if (e.code === "Enter") {
			this.send();
		}
	}

	chatInit() {

	}

	send() {
		if (!chatManager.currentChat.model.data.isConnected) {
			let msg = document.createElement("div");
			msg.classList.add('status');
			msg.innerHTML = '<div>> Connecting...</div>';
			chatManager.currentChat.historyAdd(msg, true);
			account.onConnect(() => {
				msg.innerHTML = '<div>> Connected</div>';
			});
		}

		chatManager.currentChat.messageSend(this.#$chat.model.data.msg);
		this.#$chat.model.data.msg = '';
	}
};

customElements.define('x-chat', Chat);