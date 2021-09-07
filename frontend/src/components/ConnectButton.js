//import react
import React, { useState, useLayoutEffect } from "react";
import {
  connectWallet,
  getCurrentWalletConnected  //import here
} from "./connection";
import Button from '@material-ui/core/Button';

// @dev Displays the details from a file uploaded to pinata
function ConnectButton(props)  {
  //State variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    //const [networkId, setNetworkId] = useState("");
    const [networkName, setNetworkName] = useState("");

    useLayoutEffect(() => {

      function addNetworkListner() {
        if (window.ethereum) {
           window.ethereum.on('chainChanged', function(networkId){

             if (networkId.length > 0) {
                connectWalletPressed();
                window.location.reload();
              };
            });
          }
      };
      // detect account  change and connect to new network
      function addWalletListener() {
        if (window.ethereum) {
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              connectWalletPressed();
              window.location.reload();
            };
          });
        };
      };
      async function connectToNetwork() {

         const {address, status, networkId, networkName } = await getCurrentWalletConnected();
         setWallet(address);
         setStatus(status);
         setWallet(address);
         setNetworkName(networkName);

       };
     connectToNetwork();
      addWalletListener();
      addNetworkListner();
    }, [] );


 // detect Network  change and connect to new network
 const connectWalletPressed = async () => {
   const walletResponse = await connectWallet();
   setStatus(walletResponse.status);
   setWallet(walletResponse.address);
   //setNetworkId(walletResponse.networkId);
   setNetworkName(walletResponse.networkName);
 };


return (
  <div align="center">
  <Button variant="outlined" onClick={connectWalletPressed} color="inherit">
        {(networkName.length >0 && walletAddress.length > 0) ? (
          " Connected: " +
          String(networkName) +
          " : " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}

      </Button>
      <div>
            {status}
      </div>
      <br/>
      <br/>
  </div>
  );
}

export default ConnectButton
