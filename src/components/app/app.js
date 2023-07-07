import {} from "../auth/auth.js";
import {} from "../messenger/messenger.js";
import {} from "../register/register.js";

import css from "./app.css";
css.install();

import account from "../../services/account.js";

const App = class {
	constructor() {
		this.#authPageInit();
		account.model.addEventListener('change', 'isAuth', cfg => {
			if (cfg.newValue) {
				this.#chatPageInit();
			} else {
				this.#authPageInit();
			}
		});
	}

	#authPageInit() {
		this.#pageClear();
		const $auth = document.createElement("x-auth");
		document.body.appendChild($auth);
	}

	#chatPageInit() {
		this.#pageClear();
		const $messenger = document.createElement("x-messenger");
		document.body.appendChild($messenger);
	}

	#pageClear() {
		document.body.innerHTML = '';
	}
};

new App();