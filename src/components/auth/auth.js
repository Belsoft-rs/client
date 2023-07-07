import {Tpl_auth, Tpl_register} from "./auth.html";
import css from "./auth.css";
css.install();

import account from "../../services/account.js";

const Auth = class extends HTMLElement {
	#$auth;
	#$register;

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
	}

	registerPage() {
		this.innerHTML = '';
		this.#$register = new Tpl_register({
			username: ''
		}, this);
		this.appendChild(this.#$register);
	}

	auth() {
		account.init(this.#$auth.model.data.phrase).then(username => {
			console.log('username:', username);
			if (!username) {
				this.registerPage();
			}
		});
	}

	register() {
		const username = this.#$register.model.data.username;
		account.register(username);
		console.log('username:', username);
	}
};

customElements.define('x-auth', Auth);
