import {Tpl_auth, Tpl_register} from "./auth.html";
import css from "./auth.css";
css.install();

import account from "../../services/account.js";

const Auth = class extends HTMLElement {
	#$auth;
	#$register;
	#$mainButton;

	constructor() {
		super();
	}

	connectedCallback() {
		this.authPage();
	}

	authPage() {
		this.#$auth = new Tpl_auth({
			phrase: ''
		}, this);
		this.appendChild(this.#$auth);
		this.#$mainButton = this.#$auth.querySelector("button");
	}

	registerPage() {
		this.innerHTML = '';
		this.#$register = new Tpl_register({
			username: ''
		}, this);
		this.appendChild(this.#$register);
		this.#$mainButton = this.#$register.querySelector("button");
	}

	onKeydown(actionName, e) {
		if (e.code === "Enter") {
			this[actionName]();
		}
	}

	auth() {
		this.#$mainButton.setAttribute('disabled', '');
		account.init(this.#$auth.model.data.phrase).then(() => {
			console.log('username:', account.model.data.username);
			if (!account.model.data.username) {
				this.registerPage();
			}
		});
	}

	register() {
		this.#$mainButton.setAttribute('disabled', '');
		const username = this.#$register.model.data.username;
		account.register(username);
	}
};

customElements.define('x-auth', Auth);
