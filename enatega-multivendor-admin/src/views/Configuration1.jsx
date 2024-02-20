import React from 'react'
import { withTranslation } from 'react-i18next'
import { useQuery, gql } from '@apollo/client'
import Header from '../components/Headers/Header'
import { getConfiguration } from '../apollo'

import { Grid , useTheme } from '@mui/material'
import { ReactComponent as ConfigIcon } from '../assets/svg/svg/Configuration.svg'
import { Box } from '@mui/material'

const GET_CONFIGURATION = gql`
  ${getConfiguration}
`
const Configuration1 = props => {
  const {  error: errorQuery, loading: loadingQuery } = useQuery(
    GET_CONFIGURATION
  )
  const { t } = props;
  const theme = useTheme();
  return (
    <>
      <Header />
      {errorQuery && t('Error')}
      {loadingQuery ? (
        t('LoadingDots')
      ) : (
        <Grid container ml={2} spacing={2}>
          <Grid item sx={12} md={7} lg={7}>
          <Box container style={{backgroundColor: 'white',
                margin: '60px 0',
                borderRadius: 20,
                boxShadow: `0px 0px 38px ${theme.palette.common.blackShade}`,
                textAlign: 'center',
                alignItems:"center",
                justifyContent:"center",
                padding: 1}}>
                <h4>{t('AvailableAfterPurchasing')}</h4>
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
