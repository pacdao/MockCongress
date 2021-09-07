//import react
import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar';

import { createTheme } from '@material-ui/core/styles';
import {Grid, Button} from "@material-ui/core";

import {
  Facebook,
  Flickr,
  Instagram,
  Telegram,
  Twitter,
  Viber,
  Youtube,
} from "@trejgun/material-ui-icons-social-networks";


const useStyles = makeStyles(

 theme => ({
   button: {
     margin: theme.spacing(0),
   },
   icon: {
     marginRight: theme.spacing(0),
   },
 }),
 {name: "social"},

);



const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
//    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
      backgroundColor: theme.palette.action.hover,
  },
}))(TableRow);


const theme = createTheme({
    overrides: {
      MuiTableContainer: {
        "root" : {
          width: "70%",
          "margin-left": "auto",
          "margin-right": "auto",

        }
      },
      MuiTable : {
        "root" : {
        width: "600px",
        "margin-left": "auto",
        "margin-right": "auto",
        }
      },
        MuiTableCell: {
            root: {  //This can be referred from Material UI API documentation.
                padding: '5px',

            },
        },
        MuiAvatar: {
          root: {
            width: '150px',
            height: '150px',
          }
        }
    },
});


// @dev Displays the details from a file uploaded to pinata
function MOCProfile(props)  {
  const classes = useStyles();
  const [details, setDetails] = useState([]);
  const { id, state, URI } = useParams();

  useLayoutEffect(() => {
    // get details from IPFS using the url stored in listings
    fetchIPFS(decodeURIComponent(URI));
 }, [props.URI]);

  // Fetch Data from  IPFS @ ifpsUrl
  async  function fetchIPFS(ifpsUrl) {
    try {
      // fetch
      let response = await fetch(ifpsUrl);
      // wait for the response, as ayunchornous
      let responseData  = await response.json();
      // set State
      setDetails(responseData);
      return (responseData);

     } catch(error) {
      console.error(error);
    }
  }



return (
  <div className="main">
  <ThemeProvider  theme={theme}>
      <TableContainer component={Paper}  >
        <Table align="center" width="300px">
          <TableBody>
             <StyledTableRow >
                <StyledTableCell align="left" width="10%">
                  <Avatar src={details["Picture"]} alt={details["Name"]}  className={classes.large} variant="square"/>
                </StyledTableCell>
                <StyledTableCell>
                  <Table >
                  <TableBody>
                     <StyledTableRow>

                        <StyledTableCell align="left">
                          {details["Type"]} of  {details["State"]}, District: {details["District"]}
                          <hr/>
                        </StyledTableCell>

                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell align="left" colSpan={1}>
                            <h1>{details["Name"]} </h1>
                        </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>

                        <StyledTableCell align="left">

                        <Grid>
                          <div> Phone #: {details["Phone"]} </div>
                          <br/>
                          <Button variant="outlined" className={classes.button} href={details["facebook"]}>
                              <Facebook className={classes.icon} />
                            </Button>
                            <Button variant="outlined" className={classes.button} href={details["flickr"]}>
                              <Flickr className={classes.icon} />
                            </Button>
                          <Button variant="outlined" className={classes.button}  href={details["instagram"]}>
                              <Instagram className={classes.icon} />
                            </Button>
                          <Button variant="outlined" className={classes.button} href={details["twitter"]}>
                              <Twitter className={classes.icon} />
                            </Button>
                            <Button variant="outlined" className={classes.button}  href={details["youtube"]}>
                              <Youtube className={classes.icon} />
                            </Button>
                          </Grid>
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>

                        <StyledTableCell align="left"> <h1>SCORE: 0.00 </h1>  </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                </Table>
                </StyledTableCell>

              </StyledTableRow>
          </TableBody>
      </Table>
    </TableContainer>
    <br/>
    <hr/>
    <br/>
    </ThemeProvider>
  </div>

);
}

export default MOCProfile
