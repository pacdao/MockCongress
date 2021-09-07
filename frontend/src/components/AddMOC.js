import React, { Component } from "react";
import MockCongress2 from "../contracts/MockCongress2.json";
import getWeb3 from "../getWeb3";



class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MockCongress2.networks[networkId];
      const instance = new web3.eth.Contract(
        MockCongress2.abi,
        "0xEEea3EcA320D45573F2Cb7aD1EC406Da1E0C4573",
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.mintMOC("WA", "Maria Cantwell", "WASEN2", "QmQAA3iwBbRGncNTnTQnzm9Lti2o4xj4DRrfmxZiUm9rz7").send({ from: accounts[0] });


    await contract.methods.mintMOC("WA", "Patty Murray", "WASEN1", "QmZxxBLGDcqo7LtTBgLYTPigVBWvwaYQHDSzzS1RP4sWtL").send({ from: accounts[0] });

  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
      </div>
    );
  }
}

export default App;
