import React, { useState, useEffect } from 'react'
import { makeStyles, Paper, TableBody, TableCell, TableRow, TablePagination, Toolbar, Input } from '@material-ui/core'
import useTable from '../components/useTable'
import { list } from '../services/api-car'
import Search from './Search'

import PieCharts from './PieCharts'

import Controls from "../components/controls/Controls";
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5)
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  media: {
    minHeight: 400
  },
  credit: {
    padding: 10,
    textAlign: 'right',
    backgroundColor: '#ededed',
    borderBottom: '1px solid #d0d0d0',
    '& a': {
      color: '#3f4771'
    }
  }
}))
const headCells = [
  { id: 'Manufacturer', label: 'Manufacturer' },
  { id: 'Model', label: 'Model' },
  { id: 'Year', label: 'Year' },
  { id: 'Actions', label: 'Actions' }
];
export default function Home() {
  const classes = useStyles()
  const [Records, setRecords] = useState([]);

  const pages = [5, 8, 10]
  const [CurrentPage, setCurrentPage] = React.useState(0);
  const [TotalPages, setTotalPages] = React.useState(0);
  const [RowsPerPage, setRowsPerPage] = React.useState(pages[CurrentPage]);



  const [toTalCarsDB, setTotalCarsDB] = React.useState(0);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  }


  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(CurrentPage, RowsPerPage, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {

        setRecords(data.cars)
        setCurrentPage(data.currentPage)
        setTotalPages(data.totalPages)
        setTotalCarsDB(data.totalCarCount)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [CurrentPage, RowsPerPage])



  const {
    TblContainer,
    TblHead
  } = useTable(Records, headCells);


  function handleSearchSelection(newValue) {
    setRecords(newValue)
  }

  return (

    <Paper>
      <Search onChange={handleSearchSelection} />
      <PieCharts
        cars={Records}
      />
      <Toolbar>
        <Controls.Button
          text="Add New"
          variant="outlined"
          startIcon={<AddIcon />}
          className={classes.newButton}
          onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}
        />
      </Toolbar>


      <TblContainer>
        <TblHead />
        <TableBody>
          {
            Records.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.manufacturer}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => { openInPopup(item) }}>
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    color="secondary">
                    <CloseIcon fontSize="small" />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </TblContainer>
      <TablePagination
        rowsPerPageOptions={pages}
        component="div"
        count={toTalCarsDB}
        rowsPerPage={RowsPerPage}
        page={parseInt(CurrentPage)}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

