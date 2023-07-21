![Diffy chat pic narrow](https://github.com/Belsoft-rs/diffychat-client/assets/126072104/1f26a3c7-020d-4daa-ad3c-85dd5b6f144a)

# Intro

Diffy Chat aims to provide a solution to the aforementioned challenges by developing a decentralized messenger that eliminates the need for a centralized backend. Instead, it utilizes a decentralized network powered by blockchain technology, specifically leveraging the capabilities of the Polkadot ecosystem. This approach ensures that sensitive data is securely transferred between parties without being stored in a vulnerable central repository.

This project is held by BelSoft Dev under the W3F grants program hence Diffy Chat is developed as a Substrate pallet and potentially — as a parachain in the Polkador ecosystem.

One of the key features of Diffy Chat is its utilization of personal Polkadot wallet credentials for initiating chats and messaging. This adds an extra layer of security by leveraging the cryptographic capabilities with ed25519 algorithm implemented in the DOTRTC library. Users can authenticate themselves using their personal wallet credentials, ensuring that only authorized parties can initiate conversations and access the shared messages.

The Diffy Chat dapp caters to a broad audience that requires secure private channels for exchanging messages. Various industries (e.g. medical institutions providing remote telemedicine services; financial sector (DeFi as well as CeFi) providing personal support for internet users; corporate channelstransmitting sensitive information between remote divisions) can benefit from Diffy Chat’s secure messaging capabilities. The dapp ensures that personal and critical data remains protected from unauthorized access during interactions and communications between counterparties.

Benefits brought by Diffy Chat:

- Enhanced Security: Diffy Chat’s decentralized architecture eliminates the vulnerabilities associated with centralized databases.
- Data Privacy: users can have greater confidence in the privacy of their conversations.
- Data Control: Diffy Chat empowers users by allowing them to maintain control over their own data.
- Seamless Integration: the decentralized nature of Diffy Chat doesn’t require users to rely on any specific centralized service provider. This allows for easy integration with existing systems and workflows, providing a smooth user experience.

Diffy Chat represents a significant step forward in secure messaging solutions by utilizing the power of decentralized technologies. By eliminating centralized databases and utilizing personal Polkadot wallet credentials, Diffy Chat makes it a compelling choice for organizations and individuals seeking to protect their sensitive information during communication and interaction.


## Build

To install dependencies use:

    npm i

Rollup is used to build app (https://rollupjs.org/introduction/#installation)

Run this command to build the application:

    rollup -c ./rollup.config.js

The compiled application, including all the necessary dependencies, will be in the `/dist` directory.

If you want to change the parachain address that is used to establish p2p connections, then you need to change the `parachain` parameter in the config `./src/config.js`


## Demo

For ease of viewing and testing, this page has already been deployed on github pages and is available at:

    https://belsoft-rs.github.io/diffychat/

### Demo video

[![Preview](https://github-production-user-asset-6210df.s3.amazonaws.com/126072104/251771167-7fee3eb1-b81e-4ce2-ac20-1ffd6b04216a.png)](https://media.belsoft.rs/diffychat/diffychat.mp4)
