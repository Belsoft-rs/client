//import DOTRTC from "dotrtc";
import DOTRTC from "../../../../diffychat-dotrtc/src/DOTRTC.js";

import Pool from "pool-handlers";
import {cryptoWaitReady} from '@polkadot/util-crypto';
import {Keyring} from '@polkadot/api';
import ObjectLive from "object-live";

const account = new (class {
	#phrase;
	#accountSrKeyring;
	#p2p;
	#onConnectionRequestHandlers = new Pool();
	#onConnectHandlers = new Pool();

	model = new ObjectLive({
		username: undefined,
		isAuth: false
	});

	init(phrase) {
		return new Promise(resolve => {
			cryptoWaitReady().then(() => {
				this.#phrase = phrase;
				const srKeyring = new Keyring({type: 'sr25519'});
				this.#accountSrKeyring = srKeyring.addFromUri(phrase);
				console.log(`My address: <b>${this.#accountSrKeyring['address']}</b>`);

				this.#p2p = new DOTRTC({
					phrase: phrase,
					onConnectionRequest: connection => {
						this.#onConnectionRequestHandlers.run(connection);
					},
					onConnect: (channel) => {
						this.#onConnectHandlers.run(channel);
					}
				});
				this.#p2p.onReady().then(() => {
					this.#p2p.getUsername(this.#accountSrKeyring).then(
						username => {
							if (username) {
								this.model.data.username = username;
								this.model.data.isAuth = true;
							}
							resolve(username);
						}
					);
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

	onConnectionRequest(handler) {
		this.#onConnectionRequestHandlers.push(handler);
	}

	onConnect(handler) {
		this.#onConnectHandlers.push(handler);
	}

	connect(cfg) {
		return this.#p2p.connect(cfg);
	}

	getContactList() {
		const list = this.#p2p.getContactList();
		console.log('list:', list);
		return list;
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