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

# Usage:

This library allows you to establish p2p connections between polkadot accounts and instantly exchange data in both directions.
You can create a DOTRTC instance with the necessary settings and specify event handlers (connection request, successful connection, disconnection):

    const p2p = new DOTRTC({
        iceServer:      string,                 //Stun or turn server (https://datatracker.ietf.org/doc/html/rfc8445), example: `stun:stun.services.mozilla.com`
        endpoint:       string                  //Endpoint of parachain node, for example `wss://diffy.bsn.si`
        phrase:         string,                 //Secret phrase
        onConnectionRequest: function() {...}   //Handler that will be called when someone tries to connect to you
        onConnect: function() {...}             //Handler that will be called when a connection is successfully established with someone
        onDisconnect: function() {...}          //Handler will be called when the connection is broken (the remote user forcibly disconnected, or may be caused by problems with the Internet connection)
    });


When creating a DOTRTC instance, you must specify a successful connection handler:

    onConnect: function(channel) {
        console.log('connection established with:', channel.remoteAddress);
    }

You can assign a nickname to your wallet. Other users will connect to you using this username:

    p2p.register('<USERNAME>');

Create a p2p connection to the account by his DOT address:

    p2p.connect({
        to: '<USERNAME>'
    });

After that, the onConnectionRequest event will fire for the user they are trying to connect to, in which a connection request will come.
The user will have to accept it or ignore it.

    onConnectionRequest: function(connection) {
        console.log(connection.remoteAddress);      //`connection.remoteAddress` contains the address of the user who is trying to connect to us
        connection.accept();                        //allow this user to connect to us
    }


Upon successful connection, the `onConnect` handler will be called, in which the `channel` object of the connection will come in the arguments, through which messages can be sended
The `channel` object has the following methods:

    channel.sendMessage(payload);                   //send message to remote address. Payload must be type Uint8Array
    channel.onMessage(payload => {                  //payload is Uint8Array
        console.log(data);
    });

# Demo

The repository contains a demo page (in the `/demo` directory) that demonstrates the operation of the DotRTC library

This demo page uses a substrate deployed at `wss://diffy.bsn.si`.
Test users alice (private key `//Alice`) and bob (private key `//Bob`) are already registered in this parachain.
If you want to launch a page with your own parachain, then when initializing DotRTC (https://github.com/Belsoft-rs/diffychat-dotrtc/blob/main/demo/index.js#L28) you need to add the `endpoint` parameter with the address parachain nodes, for example:

    endpoint: 'wss://diffy.bsn.si/'

## Demo build

To install dependencies use

    npm i

Rollup is used to build the test page (конфиг: https://github.com/Belsoft-rs/diffychat-dotrtc/blob/main/demo/rollup.config.js)

    rollup -c ./rollup.config.js

Compiled js for test page including all dependencies will be in `/demo/build` directory.

To run use html file (https://github.com/Belsoft-rs/diffychat-dotrtc/blob/main/demo/index.html)

For ease of viewing and testing, this page has already been deployed on github pages and is available at:

    https://belsoft-rs.github.io/diffychat/
