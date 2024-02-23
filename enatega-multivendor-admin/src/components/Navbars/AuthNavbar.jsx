import React from 'react'
import { withTranslation } from 'react-i18next'
import { Typography, AppBar, Box, Toolbar } from '@mui/material'

function AdminNavbar(props) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        boxShadow: 0
      }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.main2', boxShadow: 0 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('EnategaDashboard')}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default withTranslation()(AdminNavbar)
