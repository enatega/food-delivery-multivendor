import * as React from 'react'
import { Box, Link, BottomNavigation, Typography } from '@mui/material'
import useStyles from './styles'
import { APP_NAME, CUSTOMER_URL, WEBSITE_URL } from '../../utils/constants'
import { toTitleCase } from '../../utils/helper'

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
          href={CUSTOMER_URL}
          target="_blank"
          underline="none">
          ${toTitleCase(APP_NAME)} Multivendor
        </Link>
        <Link
          className={classes.link}
          href="https://ninjascode.com/about-us/"
          target="_blank"
          underline="none">
          About Us
        </Link>
        <Link
          className={classes.link}
          href={`${WEBSITE_URL}/blog/`}
          target="_blank"
          underline="none">
          Blog
        </Link>
      </BottomNavigation>
    </Box>
  )
}
