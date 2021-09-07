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
import { Link } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import { BrowserRouter } from "react-router-dom";

import { createTheme } from '@material-ui/core/styles';

import MOCProfile from "./MOCProfile";



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
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
  minWidth: 300,
  minHeight: 130,

  },
});

const theme = createTheme({
    overrides: {
        MuiTableCell: {
            root: {  //This can be referred from Material UI API documentation.
                padding: '5px',
            },
        },
    },
});


// @dev Displays the details from a file uploaded to pinata
function MOCMoniker(props)  {
  const classes = useStyles();
  const [details, setDetails] = useState([]);
  const {id, state, URI} = [props.id, props.state, props.URI];
  useLayoutEffect(() => {
    // get details from IPFS using the url stored in listings
    //alert(props.URI);
    fetchIPFS(props.URI);
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
  <>
  <ThemeProvider  theme={theme}>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="Details">
          <TableBody>
             <StyledTableRow>
                <StyledTableCell align="left" colSpan={1}>
                <Link to={`/MOCProfile/${props.id}/${props.state}/${encodeURIComponent(props.URI)}`} >
                  <Avatar src={details["Picture"]} alt={details["Name"]}/>
                </Link>

                </StyledTableCell>
                <StyledTableCell align="left" colSpan={1}>
                  <Table className={classes.table} aria-label="Details2">
                    <TableBody>
                     <StyledTableRow>

                        <StyledTableCell align="left" colSpan={5}>
                          {details["Name"]}
                        </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                        <StyledTableCell align="left"> {details["Type"]} of {details["State"]}, District: {details["District"]} </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                        <StyledTableCell align="left"> {details["Offices"]}  </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </StyledTableCell>
              </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </ThemeProvider>
  </>
  );
}

export default MOCMoniker
