import React, { useState, useEffect } from 'react'
import { makeStyles, Paper, TableBody, TableCell, TableRow, TablePagination, Toolbar, Input } from '@material-ui/core'
import useTable from '../components/useTable'
import { list, search } from '../services/api-car'
import AsyncSelect from 'react-select/async';
import PieChart, {
  Series,
  Label,
  Connector,
  Size,
  Export
} from 'devextreme-react/pie-chart';

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
  const [options, setoptions] = React.useState({
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: [],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        },
        noData: {
          text: 'Loading...'
        }
      }
    }]
  });


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
        if (data.cars) {
          var chartData = []
          let counts = Records.reduce(function (result, item) {
            var currentCount = result[item.manufacturer] || 0;
            result[item.manufacturer] = currentCount + 1;
            return result;
          }, {});
          //setoptions.label = counts
          for (var key in counts) {
            let obj = {}
            obj["manufacturer"] = key
            obj["totalCarsBymanufacturer"] = counts[key]
            chartData.push(obj)
          }
          setseries(chartData)


          console.log(series)
        }
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


  const pointClickHandler = e => {
    toggleVisibility(e.target);
  }

  const legendClickHandler = e => {
    let arg = e.target;
    let item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

    this.toggleVisibility(item);
  }

  const toggleVisibility =e=> {
    item.isVisible() ? item.hide() : item.show();
  }

  return (

    <Paper>
      <AsyncSelect
        loadOptions={loadOptions}
        onInputChange={handleInputChange}
        placeholder={'Search car model...'}
        onChange={onChange}
      />
      <PieChart
        id="pie"
        dataSource={series}
        palette="Bright"
        title="Area of Countries"
        onPointClick={pointClickHandler}
        onLegendClick={legendClickHandler}
      >
        <Series
          argumentField="manufacturer"
          valueField="totalCarsBymanufacturer"
        >
          <Label visible={true}>
            <Connector visible={true} width={1} />
          </Label>
        </Series>

        <Size width={500} />
        <Export enabled={true} />
      </PieChart>
    

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

