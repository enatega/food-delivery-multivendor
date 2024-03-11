import React from 'react'
import { Link, Typography } from '@mui/material'
import useStyles from './styles'
import ConfigurableValues from '../../config/constants'
const DemoLink = ({link, title})=>{
    const { ENABLE_ADMIN_DEMO } = ConfigurableValues()
    const classes = useStyles()
    if(!ENABLE_ADMIN_DEMO) return null
    return (<Link
          href={link}
          target='_blank'
          className={[
              classes.sidebarLink,
              ]}>
          <Typography sx={{ fontSize: 20, }}>
            {title}
          </Typography>
          </Link>)
}

export default DemoLink