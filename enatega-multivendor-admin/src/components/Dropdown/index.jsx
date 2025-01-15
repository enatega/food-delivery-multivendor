import React from 'react'
import { Box, MenuItem, Select, Typography } from '@mui/material'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'

function Dropdown({
  defaultValue = '',
  values,
  title,
  name,
  id,
  displayEmpty = true
}) {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  return (
    <Box>
      <Typography className={classes.labelText}>{title}</Typography>
      <Select
        style={{ margin: '0 0 0 0', padding: '0px 0px' }}
        id={id}
        name={name}
        defaultValue={defaultValue}
        displayEmpty={displayEmpty}
        className={[globalClasses.input]}>
        {values.map(value => (
          <MenuItem value={value} key={value} style={{ color: 'black' }}>
            {value.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}

export default Dropdown
