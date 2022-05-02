App = {
  web3Provider: null,
  contracts: {},

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "https://ropsten.infura.io/v3/ef58f14dce3145a5bef330862d0d3cdd"
      );
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    // Get the necessary contract artifact file and instantiate it with @truffle/contract
    var UploadArtifact = data;
    App.contracts.Upload = TruffleContract(UploadArtifact);

    // Set the provider for our contract
    App.contracts.Upload.setProvider(App.web3Provider);
  },

  uploadInfo: function () {
    var cropInstance;

    const cropId = $("#cropId").val();
    const hash = $("#hash").val();
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.Upload.deployed()
        .then(function (instance) {
          cropInstance = instance;
          return cropInstance.uploadInfo(cropId, hash, { from: account });
        })
        .catch(function (err) {
          console.log(err.message);
          return err;
        });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.initWeb3();
  });
});
