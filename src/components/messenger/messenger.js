import {} from "./contacts/contacts.js";
import {} from "./chat/chat.js";

import css from "./messenger.css";
css.install();


import {Tpl_messenger} from "./messenger.html";
import account from "../../services/account.js";

const Messenger = class extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		const $messenger = new Tpl_messenger({
			search: ''
		}, this);
		this.appendChild($messenger);
	}

	logout() {
		account.model.data.isAuth = false;
	}
};

customElements.define('x-messenger', Messenger);