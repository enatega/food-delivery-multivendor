import React from 'react'
import { withTranslation } from 'react-i18next'
import { useQuery, gql } from '@apollo/client'
import Header from '../components/Headers/Header'
import { getConfiguration } from '../apollo'

import { Grid } from '@mui/material'
import { ReactComponent as ConfigIcon } from '../assets/svg/svg/Configuration.svg'
import { Box } from '@mui/material'

const GET_CONFIGURATION = gql`
  ${getConfiguration}
`
const Configuration1 = props => {
  const {  error: errorQuery, loading: loadingQuery } = useQuery(
    GET_CONFIGURATION
  )
  return (
    <>
      <Header />
      {errorQuery && 'Error'}
      {loadingQuery ? (
        'Loading'
      ) : (
        <Grid container ml={2} spacing={2}>
          <Grid item sx={12} md={7} lg={7}>
          <Box container style={{backgroundColor: 'white',
                margin: '60px 0',
                borderRadius: 20,
                boxShadow: '0px 0px 38px rgba(0, 0, 0, 0.06)',
                textAlign: 'center',
                alignItems:"center",
                justifyContent:"center",
                padding: 1}}>
               <h4>This feature will available after purchasing product</h4>
            </Box >
          </Grid>
          <Grid
            item
            lg={5}
            sx={{ display: { xs: 'none', lg: 'block' } }}
            ml={-2}>
            <ConfigIcon />
          </Grid>
          
        </Grid>
      )}
    </>
  )
}

export default withTranslation()(Configuration1)
