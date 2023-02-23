import React, { useState } from 'react'
// node.js library that concatenates classes (strings)
// react plugin used to create charts
import { Line } from 'react-chartjs-2'
import stats from '../assets/img/stats.png'
import RiderStat from '../assets/img/RiderStat.png'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import { Box, Typography, Input, Button, Container, Grid } from '@mui/material'
import Header from '../components/Headers/Header'
import { useQuery, gql } from '@apollo/client'
import {
  getDashboardTotal,
  getDashboardSales,
  getDashboardOrders
} from '../apollo'
import useStyles from '../components/Option/styles'
import useGlobalStyles from '../utils/globalStyles'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const GET_DASHBOARD_TOTAL = gql`
  ${getDashboardTotal}
`
const GET_DASHBOARD_SALES = gql`
  ${getDashboardSales}
`
const GET_DASHBOARD_ORDERS = gql`
  ${getDashboardOrders}
`

const dataLine = {
  datasets: {
    label: 'Sales Amount',
    backgroundColor: '#3EC6DD',
    borderColor: '#3EC6DD'
  }
}
const dataBar = {
  datasets: {
    label: 'Order count',
    backgroundColor: '#90EA93',
    borderColor: '#90EA93'
  }
}

const Dashboard = props => {
  const restaurantId = localStorage.getItem('restaurantId')

  const intializeStartDate = () => {
    var d = new Date()
    d.setDate(d.getDate() - 7)
    return d.toISOString().substr(0, 10)
  }
  const [stateData, setStateData] = useState({
    startingDate: intializeStartDate(), // new Date().toISOString().substr(0,10),
    endingDate: new Date().toISOString().substr(0, 10)
  })

  const {
    data: dataTotal,
    error: errorTotal,
    loading: loadingTotal
  } = useQuery(GET_DASHBOARD_TOTAL, {
    variables: {
      startingDate: stateData.startingDate.toString(),
      endingDate: stateData.endingDate.toString(),
      restaurant: restaurantId
    }
  })
  const {
    data: dataSales,
    error: errorSales,
    loading: loadingSales
  } = useQuery(GET_DASHBOARD_SALES, {
    variables: {
      startingDate: stateData.startingDate.toString(),
      endingDate: stateData.endingDate.toString(),
      restaurant: restaurantId
    }
  })
  const { data: dataOrders, loading: loadingOrders } = useQuery(
    GET_DASHBOARD_ORDERS,
    {
      variables: {
        startingDate: stateData.startingDate.toString(),
        endingDate: stateData.endingDate.toString(),
        restaurant: restaurantId
      }
    }
  )
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  return (
    <>
      <Header />
      <Container className={globalClasses.flex} fluid>
        {errorTotal ? <span>{`Error! + ${errorTotal.message}`}</span> : null}
        <Box container className={classes.container}>
          <Box className={classes.flexRow}>
            <Box item className={classes.heading}>
              <Typography variant="h6" className={classes.textWhite}>
                Graph Filter
              </Typography>
            </Box>
          </Box>

          <Box className={classes.form}>
            <form>
              <Grid container sx={{ textAlign: 'left' }}>
                <Grid item md={6} xs={12}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Start Date
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    type="date"
                    max={new Date().toISOString().substr(0, 10)}
                    onChange={event => {
                      setStateData({
                        ...stateData,
                        startingDate: event.target.value
                      })
                    }}
                    value={stateData.startingDate}
                    disableUnderline
                    className={[globalClasses.input]}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography sx={{ fontWeight: 'bold' }}>End Date</Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    type="date"
                    max={new Date().toISOString().substr(0, 10)}
                    onChange={event => {
                      setStateData({
                        ...stateData,
                        endingDate: event.target.value
                      })
                    }}
                    value={stateData.endingDate}
                    disableUnderline
                    className={[globalClasses.input]}
                  />
                </Grid>
              </Grid>
              <Button className={globalClasses.button}>Apply</Button>
            </form>
          </Box>
        </Box>
      </Container>
      <Grid container spacing={2} m={2} p={2}>
        <Grid item md={8} xs={12}>
          <Box
            sx={{
              bgcolor: 'primary.main2',
              height: '70px',
              width: '70px',
              borderRadius: '50%',
              marginLeft: '94%'
            }}
          />
          <Box
            sx={{
              bgcolor: 'rgba(63, 64, 65, 0.66)',
              boxShadow: '0px 0px 11px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
              p: 2,
              position: 'relative',
              zIndex: 999,
              marginTop: -8
            }}>
            {errorSales ? null : null}
            <Line
              height={400}
              data={{
                labels: loadingSales
                  ? []
                  : dataSales &&
                    dataSales.getDashboardSales.orders.map(d => d.day),
                datasets: [
                  {
                    ...dataLine.datasets,
                    data: loadingSales
                      ? []
                      : dataSales &&
                        dataSales.getDashboardSales.orders.map(d => d.amount),
                    lineTension: 0.8
                  },
                  {
                    ...dataBar.datasets,
                    data: loadingOrders
                      ? []
                      : dataOrders &&
                        dataOrders.getDashboardOrders.orders.map(d => d.count)
                  }
                ]
              }}
              options={{
                maintainAspectRatio: false,
                legend: {
                  labels: {
                    display: false,
                    fontColor: '#fff',
                    fontSize: 10
                  }
                },
                scales: {
                  yAxes: {
                    grid: {
                      color: '#FFFFFF'
                    },
                    ticks: {
                      color: '#fafafa',
                      fontSize: 12
                    }
                  },
                  xAxes: {
                    grid: {
                      color: '#FFFFFF'
                    },
                    ticks: {
                      color: '#fafafa',
                      fontSize: 12
                    }
                  }
                }
              }}
            />
          </Box>
          <Box
            sx={{
              bgcolor: 'primary.main',
              height: '90px',
              width: '90px',
              borderRadius: '50%',
              marginTop: -10,
              ml: -1
            }}
          />
        </Grid>
        <Grid item md={3} ml={2} xs={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 5,
              bgcolor: 'common.white',
              width: '70%',
              mb: 3
            }}>
            <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
              Total Orders
            </Typography>
            <Typography
              sx={{
                fontSize: 35,
                fontWeight: 'bold',
                color: '#3C8F7C',
                textAlign: 'center'
              }}>
              {loadingTotal
                ? '...'
                : dataTotal && dataTotal.getDashboardTotal.totalOrders}
            </Typography>
            <img
              src={stats}
              style={{ marginLeft: '40%' }}
              width={30}
              height={40}
              alt="stat"
            />
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 5,
              bgcolor: 'common.white',
              width: '70%'
            }}>
            <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
              Total Sales
            </Typography>
            <Typography
              sx={{
                fontSize: 35,
                fontWeight: 'bold',
                color: '#3C8F7C',
                textAlign: 'center'
              }}>
              {loadingTotal
                ? '...'
                : dataTotal && dataTotal.getDashboardTotal.totalSales}
            </Typography>
            <img
              src={RiderStat}
              style={{ marginLeft: '40%' }}
              width={30}
              height={40}
              alt="stat"
            />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard
