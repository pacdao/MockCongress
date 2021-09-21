/*
  @dev : Script to mint all Mocs's
    1. Loads data from https://api.propublica.org/congress/v1/117/
    2. Mints all mocs to the deployer'ss Address
    3. Generates an IfpsHash and pins to Pinata
    4. Sets the baseURI of all Mocs Tokens to the hash
*/

// Load all countries and data
const countries =  require('./geoData');
// load the MockCongress contract ABI and network info
const MockCongress = require('./contracts/MockCongress.json');
// imports
const dotenv = require('dotenv');
// Load the .env file
dotenv.config();

const axios = require('axios');
const async = require("async");
const pinataSDK = require('@pinata/sdk');
var Web3 = require('web3');

// declare all global Variables

// Secret key of the of the wallet account
const walletSecretKey = process.env.Wallet_Secret_Key;
// wallet address used as from in all transactions
var walletAddress;
// MockCongress contract instance
var mocInstance;
// Network Id - setting it to kovan
const networkId = process.env.NETWORK_ID;
// Total count of the Mocs
var totalCount = 0;
// a running counter, to determine when we no longer need to listen for events
var counter = 0;
// list of all senate Mocs
const senateData = [];
// List of all house Mocs
const houseData = [];
// Congress #
let congressNum = "";
// All congress Data combined
const congressData = [];



// Ifphash of the base URI of the tokens
var ifpsHash;
let  nonce;

// @dev Intalize web3 and set the Moc smart contract instance
async function init() {

  console.log("\n.............Intalize web3 & network parameters \n");
  // load network details by networkId
  const deployedNetwork = MockCongress.networks[networkId];

  let ethNetwork = '';
  let ethSocketNetwork = '';
  // load the url/wss
  ethNetworkHttps =  (networkId ===  "5777") ?  deployedNetwork["https"] :  deployedNetwork["https"] + process.env.INFURA_KEY;
  ethNetworkWss = (networkId ===  "5777") ?  deployedNetwork["wss"] :  deployedNetwork["wss"] + process.env.INFURA_KEY;
  // intalize provider
  const provider = new Web3.providers.HttpProvider(ethNetworkHttps);
  // intalize web3
  web3 = new Web3(provider);
  // get account from private key
  let account = await web3.eth.accounts.privateKeyToAccount('0x' + walletSecretKey);
  // set wallet address
  walletAddress = account.address;
  console.log("WalletAddress : " + walletAddress);
  //inatlize the MockCongress contract
  mocInstance = new web3.eth.Contract(
    MockCongress.abi,
    deployedNetwork && deployedNetwork["address"],

  );
  mocInstance.options.handleRevert = true;
  mocInstance.options.chain = networkId;

  nonceAccount = await web3.eth.getTransactionCount(walletAddress);//, "pending")
  console.log(nonceAccount);
  // subsecribe to the NewMoc event
  subscribeToNewMoc(ethNetworkWss);
}

// dev: Subescribe to NewMoc event
async function  subscribeToNewMoc(wss) {

  console.log("\n.............Subscribe to NewMoc \n");
  const deployedNetwork = MockCongress.networks[networkId];
  let provider = new Web3.providers.WebsocketProvider(wss);
  const w3 = new Web3(provider);

  // Just to see if the connection is getting dropped
  // for some reason
  // log error if error in connection
  provider.on('error', e => {
      console.error('.................WS  Error', e);
  });
  // log connection
  provider.on('connect', function () {
      console.log('.................WSS Connected');
  });
  // if connection ends/drops, reconnect again
  provider.on('end', e => {
      console.log('.................WSS closed');
      console.log('.................Attempting to reconnect...');
      provider = new Web3.providers.WebsocketProvider(wss);
      provider.on('connect', function () {
          console.log('.................WSS Reconnected');
      });
      w3.setProvider(provider);
  });

  // get instance using wss
  const instance = new w3.eth.Contract(
    MockCongress.abi,
    deployedNetwork && deployedNetwork["address"],

  );
  // Subscribe to new event
  // Not getting fired for some reason
  try {
    instance.events.NewMoc({
        fromBlock: 'latest', // Tried using blocknumber, earliest, latest, nothing works
        //toBlock: 'latest'
    }).on('connect', function(event) {
          console.log('connected!!');
    }).on('data', function(event) {
        // returns the event
        let retValues = event.returnValues;
        console.log('.................' + retValues.seat + " :  tokenId : " +  retValues.tokenId);
        // get the Id and update json
        let moc;
        // check if the seat is of a senator
        if (retValues.seat.includes('SEN'))
        {
          //console.log(senateData);
          moc = senateData.filter(x => x.seat === retValues.seat);
        }
        else {
          moc = houseData.filter(x => x.seat === retValues.seat);
        }
        if (moc[0])
        {
          //set id from event
          moc[0].id = retValues.tokenId;
          //set token ?? Needed?
          moc[0].token = retValues.token;
          console.log("................."  + moc[0]);
          //add to congress array
          congressData.push(moc[0]);
          // increment counter
          counter = counter + 1;
          // all minting done? if the counter is equal to the total mocs, then yes
          // pin the congress and generate hash
          if (counter === totalCount)
          {
            console.log("................. End of listing to events ");
            generateIFPS();
          }

        }

    }).on('error', console.error('error', "this is the error"));
  } catch (e) {
      console.log("(Error : )" + e);
  } finally {

  }

}

// Send transaction to blockhain
// input : count : integer to increment the nounce
//         method : method of smart contract to called
//         isDone: if this is the to set the base URI, then we can sucessfully exit the script
// gets the gaslimit, nounce
// sign transaction with private key
// Send
// wait for recipet
async function sendTransaction(count, method, isDone=false) {
    return new Promise(function (resolve, reject) {

      try {
        // check if web3 and mocinstance os intalized
        if (web3 && mocInstance)
        {
          console.log("\n.............Send Transaction.. \n");
          //console.log("count : " + count);
          //console.log("method : " + method);
          // get the details of the network
          const deployedNetwork = MockCongress.networks[networkId];
          // get network name
          const networkName = deployedNetwork["name"];
          // get the latest block to get the gaslimit
          web3.eth.getBlock("latest", false, (error, result) => {
              //console.log(result);
              var _gasLimit = result.gasLimit;
              
              // get the gas price
              web3.eth.getGasPrice(function (error, result) {
                          var _gasPrice = result;
                          //console.log(_gasPrice);
                          try {
                              // create the tx object
                              const Tx = require('ethereumjs-tx').Transaction;
                              const privateKey = walletSecretKey; //Buffer.from(MainAccountPrivateKey, 'hex')
                              // convert values to hex
                              var _hex_gasLimit = web3.utils.toHex((_gasLimit).toString());
                              var _hex_gasPrice = web3.utils.toHex(_gasPrice.toString());
                              var _hex_Gas = web3.utils.toHex('1000000');
                              //console.log(_gasLimit);
                              // get transaction count to get nonce
                              web3.eth.getTransactionCount(walletAddress, "pending").then(
                                  nonce => {
                                      // add the count to the nonce
                                      var _hex_nonce = web3.utils.toHex(nonceAccount + count);
                                      // create the raw transaction
                                      const rawTx =
                                      {
                                          nonce: _hex_nonce,
                                          from: walletAddress,
                                          to: deployedNetwork["address"],
                                          gasPrice: _hex_gasPrice,
                                          gasLimit: _hex_gasLimit,
                                          //gas: _hex_Gas,
                                          value: '0x0',
                                          data:  method //mocInstance.methods.mintMOC(moc.seat).encodeABI()
                                      };
                                      // create the transaction
                                      const tx = (networkId !== "5777") ? new Tx(rawTx, { 'chain': networkName }): new Tx(rawTx, { 'chainId': networkId });
                                      //console.log(tx);
                                      // sign the transaction
                                      tx.sign(Buffer.from(walletSecretKey, 'hex'));
                                      // seralize it to string in hex
                                      var serializedTx = '0x' + tx.serialize().toString('hex');
                                      //console.log(serializedTx);
                                      // send the signed transaction
                                      web3.eth.sendSignedTransaction(serializedTx.toString('hex'))
                                        .once('receipt', function(receipt){
                                            //web3.eth.getTransactionReceipt()
                                            console.error('("................. Sucessfully mined...' );
                                            console.error('("...................... transaction hash: ' + receipt.transactionHash );
                                            console.error('("...................... Block#: ' + receipt.blockNumber );
                                            console.error('("...................... gasUsed: ' + receipt.gasUsed );

                                            // this is the last transaction?
                                            if (isDone)
                                            {
                                              console.log("\n ################### Done ##################");
                                              //process.exit(0);
                                            }
                                          })
                                          .once("confirmation", (confirmationNumber, receipt) => {
                                            console.log("on confirmation", confirmationNumber);
                                          })
                                          .on('error', function(error){
                                              console.error('(0"................. Error : ' +  error);
                                            })
                                    });
                          } catch (error) {
                              console.error('(2"................. Error : ' +  error);
                              reject(error);
                          }
                      });

              });
          }

        } catch (error) {
            console.error('(3)\n3................. Error : ' +  error);
            //reject(error);
        }

    }).catch(e => { console.log("here is error: " + e) })
 
}
// mint the moc seat
async function mintMoc1(mocSeat, count) {
  if (web3 && mocInstance ) {
    //console.log("\n.............Mint Moc.. \n");
    console.error('.................... Mint Seat :' + mocSeat );
    await sendTransaction(count, mocInstance.methods.mintMOC(mocSeat).encodeABI());
  }

}

// mint the moc seat
async function mintBatch(count, mocSeats) {
  if (web3 && mocInstance ) {
    //console.log("\n.............Mint Moc.. \n");
    //console.log(`seatIds ${seatIds[0]}`);
    console.error(mocSeats );
    await sendTransaction(count, mocInstance.methods.mintBatch(mocSeats).encodeABI());
  }

}


// pin the json (body) to Pinata
const pinJSONToIPFS = async(congress, body) => {

    console.log("**************  Pin IFPS  ******************");
    // Get keys from the .env file
    const key =  process.env.PINATA_KEY;
    const secret = process.env.PINATA_SECRET_KEY;
    // create the pinata object
    const pinata = pinataSDK(key, secret);
    //console.log(body);
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
      // set the name of the   pin
      const name = "Congress : " + congress;
      const options = {
          pinataMetadata: {
              name: name ,
              keyvalues: {
                  customKey: 'customValue',
                  customKey2: 'customValue2'
              }
          },
          pinataOptions: {
              cidVersion: 0
          }
      };
      // pin and get hash
     pinata.pinJSONToIPFS(body, options).then((result) => {
        ifpsHash = result.IpfsHash;
        console.log(".................... IfpsHash: " + ifpsHash);
        // call setBaseURI with the hash
        setBaseURI(result.IpfsHash);



      })
      .catch(function (error) {
              console.log("Error in ifps : " + error)
          });

};
// call the pin
async function generateIFPS() {
   console.log(".............Generate Ifps.. \n");

   await pinJSONToIPFS(congress, congressData );

}
// set the base URI of the tokens
async function setBaseURI(uri) {
  if (mocInstance && uri) {
      console.log(".............Set Base URI of tokens..");

      console.log(".............Base URI.." + uri);

       const i = countries[0].regions.length;
       await sendTransaction(i, mocInstance.methods.setBaseURI(uri).encodeABI(), true);
 }
}
// Load moc data from propublica for the chamber (senate/house)
async function loadMoc (chamber)  {

    console.log("\n.............Load Current Mocs for " + chamber + " from  propublica.. \n");
    const url = "https://api.propublica.org/congress/v1/117/" + chamber + "/members.json";
    // get the enviroment varaibles from the .env file
    const key = process.env.propublica_key;
    //making axios POST request to propublica
    try {
      return axios
          .get(url,  {
              headers: {
                  "X-API-Key": key,
              }
          })
          .then(function (response) {
            // get the current congress number
            congress = response.data.results[0].congress;
            console.log(".................... Congress: " + congress);
            // get moc members
            const allMembers =  response.data.results[0].members;
            const members = allMembers.filter(x => x.in_office == true);
            console.log(".................... Member Count: " + members.length);
            return {members, congress};

          })
          .catch(function (error) {
            console.log(".................... Error: " + error);
              return []


      });
    } catch (err) {
      console.log(".................... Error: " + err);
    return []
  }
};

// Load data from  propublica and mint the Mocs
async function loadData() {
  console.log("\n.............Load  & Process Mocs \n");
  //;//load senate moc data
  let objSenate =  await loadMoc("senate");
  //load house moc data
  let objHouse =  await loadMoc("house");
  // get all states, would like the mocs to be minted by state
  let states = countries[0].regions;//.filter(x => x.shortCode == "ME");

  // set the total moc count - used to determine when to stop listening for evnts and generate the ifps hash
  totalCount = objSenate.members.length + objHouse.members.length;
  //totalCount = objSenate.members.filter(x => x.state == "ME").length + objHouse.members.filter(x => x.state == "ME").length;
  console.log("Total Count : " + totalCount);

  // count for the increment of nounce
  var count = 0;

   // for each state
   states.map((region, j) => {
       //get state code
       let seatIds = [];

       let state = region.shortCode;
       // get members for that state
       let members = objSenate.members.filter(x => x.state === state);
        // for each senator for the state
        members.map( async(moc, i) => {
              let mocSen = {"id" : -1,  "name" : moc.first_name + " " + (moc.middle_name?moc.middle_name + " ": '')   + moc.last_name,
              "state": moc.state, district : '', "seat" : moc.state + "SEN" + (i+1) , "party": moc.party, "next_election" : moc.next_election,
              "office" : moc.office, "phone" : moc.phone,  url : moc.url, "title" : "Senator", token : '', dna : '0000000000' };
              //console.log(".................... : " + mocSen.name +  " - " + mocSen.seat);
              senateData.push(mocSen);
              seatIds.push(mocSen.seat);
              //mintMoc1(mocSen.seat, count);
              //console.log(".................... : " + seatIds[count] );
              count = count + 1;
              //console.log("index1 : "  + count);

        });
        // for each rep for the state
        members = objHouse.members.filter(x => x.state === state);

        members.map(async(moc, i) => {
              let mocHouse = {"id" : -1,  "name" : moc.first_name + " " + (moc.middle_name?moc.middle_name + " ": '')   + moc.last_name,
              "state": moc.state, district : moc.district, "seat" : moc.state  + moc.district , "party": moc.party, "next_election" : moc.next_election,
              "office" : moc.office, "phone" : moc.phone,  url : moc.url, "title" :  "House Representative", token : '',  dna : '0000000000' };
              //console.log(".................... : " + mocHouse.name +  " - " + mocHouse.seat);
              houseData.push(mocHouse);
              seatIds.push(mocHouse.seat);
              //console.log(".................... : " + seatIds[count] );

              //mintMoc1(mocHouse.seat, count);
              count = count + 1;
        });

        mintBatch(j, seatIds);
        seatIds = [];
        
  });
  //console.log(seatIds);

  //return seatIds;

}

console.log("######################### Mint All Mocs ######################### \n");
init();
console.log(`Network Id ${networkId}`);
console.log(`Your wallet address is ${walletAddress}`);
console.log("------------------------------------------------------------------- \n");
loadData();
setBaseURI("https://gateway.pinata.cloud/ipfs/QmUmH7hE49u2zF91erJC2UgfRxQpR4gNtqsFEuQKBbxDy9");
