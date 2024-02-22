import React from 'react'
import { Input, InputAdornment, IconButton, Box, useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import useStyles from './styles'
import { withTranslation, useTranslation } from 'react-i18next'

function SearchBar(props) {
  const theme = useTheme()
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <IconButton onClick={props.onClick}>
        <RefreshIcon
          sx={{
            color: theme.palette.primary.main
          }}
        />
      </IconButton>
      <Input
        placeholder={t('Search')}
        onChange={props.onChange}
        value={props.value}
        sx={{
          backgroundColor: theme.palette.background.primary,
          height: 29,
          width: 180,
          fontSize: 11,
          color: theme.palette.text.disabled,
          padding: '5px 10px',
          borderRadius: 15
        }}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{
              color: theme.palette.primary.main
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

export default withTranslation()(SearchBar)
