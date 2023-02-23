import React from 'react'
import { Input, InputAdornment, IconButton, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import useStyles from './styles'

export default function SearchBar(props) {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <IconButton onClick={props.onClick}>
        <RefreshIcon
          sx={{
            color: '#6FCF97'
          }}
        />
      </IconButton>
      <Input
        placeholder="Search"
        onChange={props.onChange}
        value={props.value}
        sx={{
          backgroundColor: '#f9fafc',
          height: 29,
          width: 180,
          fontSize: 11,
          color: '#5A5858',
          padding: '5px 10px',
          borderRadius: 15
        }}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{
              color: '#6FCF97'
            }}>
            <SearchIcon />
          </InputAdornment>
        }
        disableUnderline
        id="basic-input"
      />
    </Box>
  )
}
