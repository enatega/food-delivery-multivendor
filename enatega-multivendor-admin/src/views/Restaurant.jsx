import React, { useState } from 'react'
import RestaurantCard from '../components/Restaurant/Card'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { restaurantByOwner } from '../apollo'
import CreateRestaurant from '../components/Restaurant/CreateRestaurant'
import { Box, Button, Modal, Container, Grid, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import useGlobalStyles from '../utils/globalStyles'
import { withTranslation } from 'react-i18next'

const RESTAURANT_BY_OWNER = gql`
  ${restaurantByOwner}
`
const Restaurant = props => {
  const theme = useTheme()
  const { t } = props
  const [owner, setOwner] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const vendorId = localStorage.getItem('vendorId')
  const toggleModal = () => {
    setIsModalVisible(prevState => !prevState)
  }

  const globalClasses = useGlobalStyles()

  const { data, error: errorQuery, loading: loadingQuery } = useQuery(
    RESTAURANT_BY_OWNER,
    {
      variables: { id: vendorId }
    }
  )
  const links =
    data &&
    data.restaurantByOwner.restaurants.map((rest, index) => {
      return (
        <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
          <Link
            underline="none"
            style={{ textDecoration: 'none' }}
            key={rest._id}
            onClick={() => {
              localStorage.setItem('restaurantId', rest._id)
              localStorage.setItem('restaurantImage', rest.image)
              localStorage.setItem('restaurantName', rest.name)
            }}
            to={`/admin/dashboard/${rest.slug}`}>
            <RestaurantCard key={rest._id} rest={rest} />
          </Link>
        </Grid>
      )
    })
  return (
    <>
      <Box
        sx={{
          height: '160px',
          width: '100%',
          background: `linear-gradient(91.18deg, ${theme.palette.warning.dark} 1.49%, ${theme.palette.primary.main} 99.86%)`,
          borderRadius: '0 0 40px 40px',
          marginBottom: 1,
          mt: -10
        }}
      />
      {/* Page content */}
      <Container fluid>
        <Box mt={-10}>
          {loadingQuery ? <div>{t('Loading')}</div> : null}
          {errorQuery ? <span>`${errorQuery.message}`</span> : null}
          {!loadingQuery && !errorQuery && (
            <Grid container spacing={2}>
              {links}
            </Grid>
          )}
        </Box>
        <Box mt={6} className={globalClasses.flexRow}>
          <Button
            variant="contained"
            onClick={() => {
              setOwner(data.restaurantByOwner._id)
              toggleModal()
            }}
            style={{
              backgroundColor: theme.palette.common.black,
              color: theme.palette.warning.dark,
              borderRadius: 10
            }}
            startIcon={<AddIcon fill={theme.palette.common.black} />}>
            {t('AddNewRestaurant')}
          </Button>
        </Box>
        <Modal
          open={isModalVisible}
          onClose={toggleModal}
          style={{
            width: '65%',
            marginLeft: '18%',
            overflowY: 'auto'
          }}>
          <CreateRestaurant owner={owner} />
        </Modal>
      </Container>
    </>
  )
}
export default withTranslation()(Restaurant)
