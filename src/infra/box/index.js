const BoxSDK = require("box-node-sdk");

const sdk = new BoxSDK({
  clientID: process.env.REACT_APP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  appAuth: {
    keyID: process.env.REACT_APP_PUBLIC_KEY_ID,
    privateKey: process.env.REACT_APP_PRIVATE_KEY,
    passphrase: process.env.REACT_APP_PASSPHRASE,
  },
});

const enterpriseClient = sdk.getAppAuthClient("enterprise", "1043894477");

/**
 * Admin user: 26026687277
 * Normal user: 26033366785
 */

const adminClient = sdk.getAppAuthClient("user", "26026687277");

module.exports = {
  enterpriseClient,
  adminClient,
};
