import React from "react";


export default class Header extends React.Component {
  render() {
    return (
      <div align="center">
          <img src={process.env.PUBLIC_URL +'/AdieuNFT.png'} alt="Adieu NFT" width="600" height="100"></img>

      </div>
    );
  }
}