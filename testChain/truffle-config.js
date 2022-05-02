var HDWalletProvider = require("truffle-hdwallet-provider"); // 导入模块
var mnemonic =
  "eight uncover seminar evoke coin iron guide road elevator brain silver check"; //MetaMask的助记词。

module.exports = {
  networks: {
    ropsten: {
      provider: function () {
        // mnemonic表示MetaMask的助记词。 "ropsten.infura.io/v3/33..."表示Infura上的项目id
        return new HDWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/v3/ef58f14dce3145a5bef330862d0d3cdd",
          1
        ); // 1表示第二个账户(从0开始)
      },
      network_id: "*", // match any network
      gas: 3012388,
      gasPrice: 30000000000,
    },
  },
};
