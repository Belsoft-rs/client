import {Tpl_contacts, Tpl_contact_item, Tpl_newContact} from "./contacts.html";
import css from "./contacts.css";
css.install();

import Popup from "../../ui/popup/popup.js";

import account from "../../../services/account.js";
import chatManager from "../../../services/chatManager.js";

const contacts = class extends HTMLElement {
	#$container;
	#$newContact;
	#$popupNewContact;
	#contacts = {};		// {address: $node}
	#$contacts;			// $rpNode

	constructor() {
		super();
	}

	connectedCallback() {
		this.#$contacts = new Tpl_contacts({
			search: '',
			contacts: chatManager.model.data.contactList
		}, this);
		this.appendChild(this.#$contacts);

		this.#$contacts.model.addEventListener('change', 'search', () => {
			this.reflow();
		});

		this.#$container = this.#$contacts.querySelector("div[name='contactList']");
		chatManager.model.addEventListener('change', /contactList\.*/, (cfg) => {
			this.add(cfg.newValue);
		});

		chatManager.model.addEventListener('change', 'contact', cfg => {
			this.#contacts[cfg.newValue.address].querySelector('.contact').classList.add('selected');
			if (cfg.oldValue && cfg.oldValue.address !== cfg.newValue.address) {
				this.#contacts[cfg.oldValue.address].querySelector('.contact').classList.remove('selected');
			}
		});

		account.getContactList().then(contacts => {
			contacts.forEach(contact => this.add(contact, true));
		});
	}


	create() {
		this.#$newContact = new Tpl_newContact({
			name: '',
			username: ''
		}, this);
		this.#$popupNewContact = new Popup(this.#$newContact);
		console.log('popup:', this.#$popupNewContact);
	}

	saveContact() {
		const name = this.#$newContact.model.data.name;
		const username = this.#$newContact.model.data.username;
		account.addContact(username, name).then(() => {
			account.getAddress(username).then(addr => {
				chatManager.contactItemAdd({name: name, username: username, address: addr});
			});
			this.#$popupNewContact.close();
		}).catch(e => {
			alert(e);
		});
	}

	add(contact, noReflow) {
		if (!this.#contacts[contact.address]) {
			const $contact = new Tpl_contact_item(contact, this);
			this.#$container.appendChild($contact);
			this.#contacts[contact.address] = $contact;
			this.#$contacts.model.data.contacts.push(contact);
			if (!noReflow) {
				this.reflow();
			}
		}
	}

	reflow() {
		this.#$contacts.model.data.contacts.forEach(contact => {
			let $contact = this.#contacts[contact.address];
			const search = this.#$contacts.model.data.search.toLowerCase();
			if (
				!this.#$contacts.model.data.search ||
				contact.name.toLowerCase().indexOf(search) !== -1 ||
				(contact.username && contact.username.toLowerCase().indexOf(search) !== -1) ||
				contact.address.toLowerCase().indexOf(search) !== -1
			) {
				$contact.style.display = "block";
			} else {
				$contact.style.display = "none";
			}
		});
	}

	remove() {

	}

	select(contact) {
		chatManager.currentSet(contact);
		console.log(contact);
	}
};

customElements.define('x-contacts', contacts);