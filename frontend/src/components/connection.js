import React from 'react';

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      var networkId = window.ethereum.networkVersion;
      var networkName = getNetworkName(networkId);
      var status = "";
      alert(networkId);
      if ((networkId !== "42") && (networkId !== "5777"))
      {
          status = "You are connected to the above network, this dApp is deployed on kovan testnet, please switch to kovan";
      }
      else {
          status = "";
      };
      const obj = {
        status: status,
        address: addressArray[0],
        networkId : networkId,
        networkName: networkName,
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status:  err.message,
        networkId : "",
        networkName: "",

      };
    }
  } else {
    return {
      address: "",
      networkId : "",
      networkName: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank"   rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (addressArray.length > 0) {

        var networkId = window.ethereum.networkVersion;
        var networkName = getNetworkName(networkId);
        var status = "";
        if ((networkId !== "42") && (networkId !== "5777"))
        {
            status = "You are connected to the above network, this dApp is deployed on kovan testnet, please switch to kovan";
        }
        else {
            status = "";
        };
        const obj = {
          status: status,
          address: addressArray[0],
          networkId : networkId,
          networkName: networkName,
        };

        return obj
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
          networkId : "",
          networkName: "",
        };
      }
    } catch (err) {
      return {
        address: "",
        status:  err.message,
        networkId : "",
        networkName: "",
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank"  rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
      networkId : "",
      networkName: "",
    };
  }
};

export const getNetworkName = (networkId) => {
  switch (Number(networkId)) {
    case 1:
      return 'Mainnet';
    case 42:
      return 'Kovan';
    case 3:
        return 'Ropsten';
    case 4:
        return 'Rinkeby';
    case 5:
      return 'Goerli';
    default:
      return 'Ganache';
  };

};
export const setNetwork = () => {

  if (window.ethereum) {
      var networkId = window.ethereum.networkVersion;
      if (networkId !== "") {
        var networkName = getNetworkName(networkId);
        connectWallet();
        if ((networkId !== "42") && (networkId !== "5777"))
        {
          return("👆🏽 This dApp is deployed on kovan testnet, please switch to kovan");
        };
      };
  };
};

export const ConnectContext = React.createContext({});
export const ConnectProvider = ConnectContext.Provider;
