import React, { useState } from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TablePagination } from '@mui/material';
import { Paper } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0', // Optional: for visual aid
    },
    tableContainer: {
      width: '80%', // Set a specific width
      maxWidth: 1200, // Optional: add a max width
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[3],
      borderRadius: theme.shape.borderRadius,
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
  }));
  

const DisplayPrice = () => {
    const [data, setData] = useState(JSON.parse(sessionStorage.getItem('data'))['prices']);
    const quantity = sessionStorage.getItem('quantity');
    const resource = sessionStorage.getItem('resourceName');
    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setrowsPerPage] = React.useState(10); // can change later

    const visibleRows = React.useMemo(
        () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [data, page]
    )

    const classes = useStyles();
    
    const printData = () => {
        console.log(data);
        console.log(quantity);
        console.log(resource);

    }

    return (
        <div className="classes.container">
            <header className="App-header">
                <p>So, you have {quantity} {resource}{(quantity > 1) ? 's' : ''}, what can you make with it?</p>

            <div>
                <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer component={Paper} className='classes.tableContainer'>
                    <Table sx={{ minWidth: 650 }} className='classes.table' aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.map((row) => (
                                <TableRow
                                    key={row.itemName}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.itemName}
                                    </TableCell>
                                    <TableCell align="right">{row.price}</TableCell>
                                    <TableCell align="right">{row.quantity} {row.resource}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setPage(0);
                        setrowsPerPage(e.target.value);
                    }}
                />
                </Paper>
            </div>
           
            {/* <button onClick={printData}>Click me!</button> */}
            </header> 
        </div>
    );
}

export default DisplayPrice;