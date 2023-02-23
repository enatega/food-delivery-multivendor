import React from 'react'
import Header from '../components/Headers/Header'
import useGlobalStyles from '../utils/globalStyles'
import { Box, Typography, Container, Grid, ButtonBase } from '@mui/material'
import RiderStat from '../assets/img/RiderStat.png'
import RestStat from '../assets/img/RestStat.png'
import VendorStat from '../assets/img/VendorStat.png'
import UserStat from '../assets/img/UserStat.png'
import { ReactComponent as DashboardIcon } from '../assets/svg/svg/dashboard.svg'
import { Line } from 'react-chartjs-2'
import { getUsers, getRiders, restaurants, getVendors } from '../apollo'
import { gql, useQuery } from '@apollo/client'
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
ChartJS.defaults.color = '#000'

const GET_USERS = gql`
  ${getUsers}
`
const GET_RIDERS = gql`
  ${getRiders}
`
const GET_RESTAURANTS = gql`
  ${restaurants}
`
const GET_VENDORS = gql`
  ${getVendors}
`

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

export const data = {
  labels,
  datasets: [
    {
      label: 'Restaurants',
      data: [1, 2, 3, 4, 5, 6, 7],
      borderColor: '#90EA93',
      backgroundColor: '#90EA93'
    },
    {
      label: 'Vendors',
      data: [8, 7, 6, 5, 4, 3, 2],
      borderColor: '#3C8F7C',
      backgroundColor: '#3C8F7C'
    },
    {
      label: 'Riders',
      data: [2, 4, 6, 8, 7, 4, 1],
      borderColor: 'black',
      backgroundColor: 'black'
    },
    {
      label: 'Users',
      data: [9, 6, 4, 2, 3, 5, 7],
      borderColor: 'orange',
      backgroundColor: 'orange'
    }
  ]
}
const SuperAdminDashboard = () => {
  const globalClasses = useGlobalStyles()
  const { loading: loadingVendors, data: vendors } = useQuery(GET_VENDORS)
  const { data: restaurants, loading: loadingRest } = useQuery(
    GET_RESTAURANTS,
    { fetchPolicy: 'network-only' }
  )
  const { data: riders, loading: loadingRiders } = useQuery(GET_RIDERS)
  const { data: users, loading: loadingUsers } = useQuery(GET_USERS, {
    variables: { page: 0 }
  })
  return (
    <>
      <Header />
      <Container sx={{ ml: 5 }} fluid className={globalClasses.flex}>
        <Grid container mt={2} spacing={2}>
          <Grid item md={8} xs={12}>
            <Box sx={{ bgcolor: 'common.black', borderRadius: 5 }}>
              <Grid container p={3}>
                <Grid item md={9}>
                  <Typography
                    sx={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
                    A cross-plalform software
                  </Typography>
                  <Typography sx={{ fontSize: 15, color: '#CDCDCD' }}>
                    A full fledged solution highly suitable to build any
                    restaurant.
                  </Typography>
                  <ButtonBase
                    onClick={() =>
                      (window.location.href = 'https://enatega.com')
                    }
                    variant="contained"
                    sx={{ width: '30%' }}
                    className={globalClasses.button}>
                    View Site
                  </ButtonBase>
                </Grid>
                <Grid item md={3}>
                  <DashboardIcon />
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                mt: 5,
                ml: -2,
                bgcolor: 'primary.main',
                height: 100,
                width: 100,
                borderRadius: 50
              }}></Box>
            <Box
              sx={{
                bgcolor: 'rgba(238, 244, 250, 0.66)',
                boxShadow: '0px 0px 11px rgba(0, 0, 0, 0.08)',
                borderRadius: 3,
                mt: -10,
                p: 2,
                position: 'relative',
                zIndex: 999,
                color: '#000'
              }}>
              <Line data={data} />
            </Box>
            <Box
              sx={{
                mt: -7,
                ml: '93%',
                bgcolor: 'primary.main2',
                height: 70,
                width: 70,
                borderRadius: 50
              }}></Box>
          </Grid>
          <Grid item md={3} ml={3} xs={12}>
            <BoxCard>
              <Typography sx={headSty}>Total Users</Typography>
              <Typography sx={sty}>
                {loadingUsers ? '...' : users.users.length}
              </Typography>
              <img
                src={UserStat}
                alt="stat"
                style={imgStyle}
                width={30}
                height={40}
              />
            </BoxCard>
            <BoxCard>
              <Typography sx={headSty}>Total Vendors</Typography>
              <Typography sx={sty}>
                {loadingVendors ? '...' : vendors.vendors.length}
              </Typography>
              <img
                src={VendorStat}
                alt="stat"
                style={imgStyle}
                width={30}
                height={40}
              />
            </BoxCard>
            <BoxCard>
              <Typography sx={headSty}>Total Restaurants</Typography>
              <Typography sx={sty}>
                {loadingRest ? '...' : restaurants.restaurants.length}
              </Typography>
              <img
                src={RestStat}
                alt="stat"
                style={imgStyle}
                width={30}
                height={40}
              />
            </BoxCard>
            <BoxCard>
              <Typography sx={headSty}>Total Riders</Typography>
              <Typography sx={sty}>
                {loadingRiders ? '...' : riders.riders.length}
              </Typography>
              <img
                src={RiderStat}
                alt="stat"
                style={imgStyle}
                width={30}
                height={40}
              />
            </BoxCard>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const BoxCard = ({ children }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 5,
      bgcolor: 'common.white',
      width: '80%',
      mb: 3
    }}>
    {children}
  </Box>
)

const imgStyle = { marginLeft: '40%' }
const sty = {
  fontSize: 35,
  fontWeight: 'bold',
  color: '#3C8F7C',
  textAlign: 'center'
}
const headSty = { fontSize: 15, fontWeight: 'bold' }

export default SuperAdminDashboard
