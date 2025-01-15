import React from 'react'
import { withTranslation } from 'react-i18next'
import { Grid, useTheme } from '@mui/material'
import { ReactComponent as ConfigIcon } from '../assets/svg/svg/Configuration.svg'
import { Box } from '@mui/material'

const Configuration1 = props => {
  const { t } = props
  const theme = useTheme()
  return (<Grid container ml={2} spacing={2}>
          <Grid item sx={12} md={7} lg={7}>
            <Box
              container
              style={{
                backgroundColor: 'white',
                margin: '60px 0',
                borderRadius: 20,
                boxShadow: `0px 0px 38px ${theme.palette.common.blackShade}`,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 1
              }}>
              <h4>{t('AvailableAfterPurchasing')}</h4>
            </Box>
          </Grid>
          <Grid
            item
            lg={5}
            sx={{ display: { xs: 'none', lg: 'block' } }}
            ml={-2}>
            <ConfigIcon />
          </Grid>
        </Grid>)
}

export default withTranslation()(Configuration1)
