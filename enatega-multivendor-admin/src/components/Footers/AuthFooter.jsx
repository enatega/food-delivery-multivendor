import * as React from 'react'
import { Box, Link, BottomNavigation, Typography } from '@mui/material'
import useStyles from './styles'

export default function AuthFooter(props) {
  const classes = useStyles()

  return (
    <Box
      className={classes.footer}
      sx={{
        bgcolor: 'transparent'
      }}>
      <BottomNavigation
        sx={{
          bgcolor: 'transparent'
        }}
        showLabels>
        <Typography className={classes.text}>©2022</Typography>

        <Link
          className={classes.link}
          href="https://multivendor.ninjascode.com/"
          target="_blank"
          underline="none">
          Enatega Multivendor
        </Link>
        <Link
          className={classes.link}
          href="https://ninjascode.com/pages/ourteam.html"
          target="_blank"
          underline="none">
          About Us
        </Link>
        <Link
          className={classes.link}
          href="https://medium.com/@sharangohar"
          target="_blank"
          underline="none">
          Blog
        </Link>
      </BottomNavigation>
    </Box>
  )
}
