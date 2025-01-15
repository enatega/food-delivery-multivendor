import React from 'react'
import Header from '../components/Headers/Header'
import useGlobalStyles from '../utils/globalStyles'
import {
  Box,
  Typography,
  Container,
  Grid,
  ButtonBase,
  useTheme
} from '@mui/material'
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
import { withTranslation } from 'react-i18next'

// const { t } = useTranslation();

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

const SuperAdminDashboard = props => {
  const { t } = props
  const theme = useTheme()
  console.log('superadmin props: ', props)
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

  // Move the initialization of data inside the component
  const labels = [
    t('January'),
    t('February'),
    t('March'),
    t('April'),
    t('May'),
    t('June'),
    t('July')
  ]

  const data = {
    labels,
    datasets: [
      {
        label: t('Restaurants'),
        data: [1, 2, 3, 4, 5, 6, 7],
        borderColor: theme.palette.warning.dark,
        backgroundColor: theme.palette.warning.dark
      },
      {
        label: t('Vendors'),
        data: [8, 7, 6, 5, 4, 3, 2],
        borderColor: theme.palette.secondary.lightest,
        backgroundColor: theme.palette.secondary.lightest
      },
      {
        label: t('Riders'),
        data: [2, 4, 6, 8, 7, 4, 1],
        borderColor: 'black',
        backgroundColor: 'black'
      },
      {
        label: t('Users'),
        data: [9, 6, 4, 2, 3, 5, 7],
        borderColor: 'orange',
        backgroundColor: 'orange'
      }
    ]
  }
  const sty = {
    fontSize: 35,
    fontWeight: 'bold',
    color: theme.palette.secondary.lightest,
    textAlign: 'center'
  }
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
                    sx={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: theme.palette.common.white
                    }}>
                    {t('MainPageText')}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 15, color: theme.palette.success.light }}>
                    {t('MainPageText1')}
                  </Typography>
                  <ButtonBase
                    onClick={() =>
                      (window.location.href = 'https://enatega.com')
                    }
                    variant="contained"
                    sx={{ width: '30%' }}
                    className={globalClasses.button}>
                    {t('ViewSite')}
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
                bgcolor: theme.palette.info.lightest,
                boxShadow: `0px 0px 11px ${theme.palette.info.dark}`,
                borderRadius: 3,
                mt: -10,
                p: 2,
                position: 'relative',
                zIndex: 999,
                color: theme.palette.common.black
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
              <Typography sx={headSty}>{t('TotalUsers')}</Typography>
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
              <Typography sx={headSty}>{t('TotalVendors')}</Typography>
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
              <Typography sx={headSty}>{t('TotalRestaurants')}</Typography>
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
              <Typography sx={headSty}>{t('TotalRiders')}</Typography>
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

const headSty = { fontSize: 15, fontWeight: 'bold' }

export default withTranslation()(SuperAdminDashboard)
