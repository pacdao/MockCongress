import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MockCongress2 from "../contracts/MockCongress2.json";
//import getWeb3 from "../getWeb3";
import Web3 from 'web3';
import {
  connectWallet,
  getCurrentWalletConnected,
  getNetworkName
} from "./connection";


import MOCMoniker from "./MOCMoniker";

import "./styles.css";


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const MOCList = (props) => {
  const classes = useStyles();
  const [walletAddress, setWallet] = useState("");
  const [mocInstance, setMocInstance] = useState(null);
  const [ids, setIds] = useState([]);
  const [mocURIs, setMOCURIs] = useState([]);

  async function init()
  {
    // Get network provider and web3 instance.
    //const web3 = getWeb3();

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();
    let account =  accounts[0];
    console.log("accounts" + accounts[0]);

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();

    const deployedNetwork = MockCongress2.networks[networkId];

    if (typeof(deployedNetwork) === "undefined")
    {
      let sNetworkName = getNetworkName(networkId)
      alert(sNetworkName + " is not supported yet, please swicth to Kovan");
      //throw new Error(sNetworkName + " is not supported yet, please swicth to Kovan");
    }
    else {
      //console.log(deployedNetwork);
      const instance = new web3.eth.Contract(
        MockCongress2.abi,
        deployedNetwork["address"],
      );
      //console.log("instance" + instance);
      setWallet(accounts[0]);
      setMocInstance(instance);

    }
  }
  //function sleep (ms) {
  //  return new Promise(resolve => setTimeout(resolve, ms))
  //}
  async function loadMOCList()  {
    //alert(mocInstance);
    //alert(props.state);
    if ( props.state !== "" && mocInstance)
    {
      try {
        //const {instance, address} = init();
        // Get the value from the contract to prove it worked.
        //alert("count");
        const ids = await mocInstance.methods.mocListForState(props.state).call({from : walletAddress});
        var count = ids.length;
        //alert(count);
        let mocURIs = [];
        var i  = 0;
        for (i = 0; i < count; i++) {
            mocURIs[i] = await mocInstance.methods.tokenURI(ids[i]).call({from : walletAddress});
        }
        setIds(ids);
        setMOCURIs(mocURIs);

      } catch (error) {

          alert(error);
          // Catch any errors for any of the above operations.
          //alert(
          //  `Failed to load web3, accounts, or contract. Check console for details.`,
          console.error(error);
          //);
          throw(error);
      }

    }

  };
  useEffect(() => {
    init();
  },[props.state]);


  useEffect(() => {
    //alert("in moc instance changed");
    //alert(mocInstance);
    loadMOCList();
  },[mocInstance]);

  return (
    <div className="box">
            {mocURIs.map((uri, index) => (
                <div key={index}>
                  <MOCMoniker id={ids[index]} URI= {uri} state={props.state}/>
                </div>
            ))}
      </div>

  );
};

export default MOCList;
