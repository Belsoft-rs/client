import css from "./popup.css";
css.install();

import {Tpl_popup} from "./popup.html";

const Popup = class extends HTMLElement {
	#$popup;

	constructor($content) {
		super();

		this.#$popup = new Tpl_popup({}, this);
		this.appendChild(this.#$popup);

		this.#$popup.querySelector("[name=content]").appendChild($content);

		document.body.appendChild(this);
	}

	close() {
		document.body.removeChild(this);
	}
};

customElements.define('x-popup', Popup);


export default Popup;