import React, { useState, useEffect } from 'react'
import { makeStyles, Paper, TableBody, TableCell, TableRow, TablePagination, Toolbar, Input } from '@material-ui/core'
import useTable from '../components/useTable'
import { list, search } from '../services/api-car'
import AsyncSelect from 'react-select/async';

import PieCharts from './PieCharts'

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
  { id: 'Year', label: 'Year' }
];
export default function Home() {
  const classes = useStyles()
  const [Records, setRecords] = useState([]);

  const pages = [5, 8, 10]
  const [CurrentPage, setCurrentPage] = React.useState(0);
  const [TotalPages, setTotalPages] = React.useState(0);
  const [RowsPerPage, setRowsPerPage] = React.useState(pages[CurrentPage]);

  //pie data
  const [series, setseries] = React.useState([]);



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

  const loadOptions = (inputValue, callback) => {
    var response = [];
    search(inputValue).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {

        response = data.cars
        callback(response.map(i => ({ label: i.model, value: i._id })))
      }
    })
    console.log(response)

  };
  const handleInputChange = e => {

  }
  const onChange = selectedUsers => {
    console.log(selectedUsers.label)
    search(selectedUsers.label).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        console.log(data)
        setRecords(data.cars)
      }
    })
  }


  return (

    <Paper>
      <AsyncSelect
        loadOptions={loadOptions}
        onInputChange={handleInputChange}
        placeholder={'Search car model...'}
        onChange={onChange}
      />
      <PieCharts
        cars={Records}
      />


      <TblContainer>
        <TblHead />
        <TableBody>
          {
            Records.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.manufacturer}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.year}</TableCell>
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

