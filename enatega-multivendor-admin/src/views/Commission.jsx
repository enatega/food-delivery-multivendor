import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import Header from '../components/Headers/Header'
import { restaurants, updateCommission } from '../apollo'
import CustomLoader from '../components/Loader/CustomLoader'
import useGlobalStyles from '../utils/globalStyles'
import { Container, Box, Typography, Grid, Input, Button } from '@mui/material'
import useStyles from '../components/Rider/styles'
import { ReactComponent as CommissionIcon } from '../assets/svg/svg/CommisionRate.svg'

const GET_RESTAURANTS = gql`
  ${restaurants}
`
const UPDATE_COMMISSION = gql`
  ${updateCommission}
`
const Commission = () => {
  const getValues = id => {
    const commissionRate = document.getElementById(id).value
    return { id, commissionRate: +commissionRate }
  }
  const [mutate, { error }] = useMutation(UPDATE_COMMISSION)

  const { data, error: errorQuery, loading: loadingQuery } = useQuery(
    GET_RESTAURANTS
  )
  const globalClasses = useGlobalStyles()
  const classes = useStyles()
  return (
    <>
      <Header />
      <Grid container>
        <Grid item lg={8}>
          <Container className={globalClasses.flex} fluid>
            <Box container className={classes.container}>
              <Box item className={classes.heading}>
                <Typography variant="h6" className={classes.text}>
                  Commission Rates
                </Typography>
              </Box>
              <Box className={classes.form}>
                {errorQuery ? <span>error {errorQuery.message}</span> : null}
                {loadingQuery ? (
                  <CustomLoader />
                ) : (
                  data &&
                  data.restaurants.map(restaurant => (
                    <Grid key={restaurant._id} container spacing={1}>
                      <Grid item sm={5} mt={3}>
                        {restaurant.name}
                      </Grid>
                      <Grid item sm={4}>
                        <Input
                          disableUnderline
                          className={globalClasses.input}
                          id={restaurant._id}
                          placeholder="Commission percent"
                          min={0}
                          max={100}
                          type="number"
                          step="1"
                          defaultValue={restaurant.commissionRate}
                        />
                      </Grid>
                      <Grid item sm={3}>
                        <Button
                          className={globalClasses.button}
                          onClick={() => {
                            const result = getValues(restaurant._id)
                            mutate({ variables: result })
                          }}>
                          Save
                        </Button>
                        {error && <span>{error.message}</span>}
                      </Grid>
                    </Grid>
                  ))
                )}
              </Box>
            </Box>
          </Container>
        </Grid>
        <Grid
          item
          lg={4}
          sx={{ display: { xs: 'none', lg: 'block' } }}
          mt={5}
          ml={-3}
          order={{ xs: 1, lg: 2 }}>
          <CommissionIcon />
        </Grid>
      </Grid>
    </>
  )
}
export default Commission
