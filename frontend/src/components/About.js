//import react
import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";


// @dev Displays the details from a file uploaded to pinata
function About(props)  {
  const { id, URI } = useParams();

  useLayoutEffect(() => {
    // get details from IPFS using the url stored in listings
    //fetchIPFS(props.URI);
 }, []);



return (
    <div  className="main">
      Coming Soon......About
    </div>
);
}

export default About
