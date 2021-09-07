
import React, { useState, useLayoutEffect } from "react";

import Link from "@material-ui/core/Link";
import { BrowserRouter as Router, Route, Link as RouterLink, Switch } from "react-router-dom";
import "./App.css";

import MOCSelection from "./components/MOCSelection";
//import AddMOC from "./components/AddMOC";
import MOCProfile from "./components/MOCProfile";
import About from "./components/About";
import Home from "./components/Home";
import ConnectButton from "./components/ConnectButton";


const App = () => {


  return (
      <div>
      <ConnectButton />
      <Router>
        <div className="nav"  align="center">
          <div className="navigationItem">
            <Link component={RouterLink} to="/"> Home
            </Link>
          </div>
          <div className="navigationItem">
            <Link component={RouterLink} to="/About">About </Link>
          </div>
          <div className="navigationItem">
            <Link component={RouterLink} to="/MOCSelection">
                Find Your MOC
            </Link>
          </div>
        </div>
        <br/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/About" component={About}/>
        <Route path="/MOCSelection/" component={MOCSelection}/>
        <Route path="/MOCProfile/:id/:state/:URI" component={MOCProfile}/>
      </Switch>
      </Router>

      </div>
  );
};
export default App;
