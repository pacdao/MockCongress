import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import MOCList from "./MOCList";
import {countries} from "./Data";

import "./styles.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const MOCSelection = () => {
  const classes = useStyles();

  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  const handleChangeCountry = (event) => {
    setCountry(event.target.value);
  };

  const handleChangeRegion = (event) => {
    setRegion(event.target.value);
  };



  return (
    <div className="main">
      <div>
        Please select a country and region to find your Member of Congress Representative.
      </div>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-country-label">Country</InputLabel>
        <Select
          labelId="select-country-label"
          id="select-country"
          value={country}
          onChange={handleChangeCountry}
        >
          {countries.map((country) => (
            <MenuItem
              value={country.countryName}
              key={country.countryShortCode}
            >
              {country.countryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-region-label">Region</InputLabel>
        <Select
          labelId="select-region-label"
          id="select-region"
          value={region}
          onChange={handleChangeRegion}
          disabled={!country}
        >
          {country
            ? countries
                .find(({ countryName }) => countryName === country)
                .regions.map((region) => (
                  <MenuItem value={region.shortCode} key={region.shortCode}>
                    {region.name}
                  </MenuItem>
                ))
            : []}
        </Select>
      </FormControl>
      <br/>
      <FormControl className={classes.formControl}>
         <MOCList state={region} />
       </FormControl>
    </div>
  );
};

export default MOCSelection;
