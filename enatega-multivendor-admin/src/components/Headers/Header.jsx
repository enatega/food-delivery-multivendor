import React from 'react'
import { Box, useMediaQuery } from '@mui/material'
import HeaderIcon from '../../assets/svg/header.svg'
function Header() {
  const matches = useMediaQuery('(min-width:1350px)')
  return (
    <>
      <Box
        sx={{
          height: 188,
          display: { xs: 'none', sm: 'block' },
          marginTop: { sm: -17, md: -14, lg: -12 },
          backgroundImage: `url(${HeaderIcon})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '105% 188px',
          backgroundPosition: 'center',
          background: matches
            ? 'linear-gradient(91.15deg, #90EA93 4.41%, #6FCF97 99.86%)'
            : '',
          borderRadius: matches ? '0 0 40px 40px' : '',
          marginLeft: matches ? 0 : -3.5,
          marginBottom: 2
        }}></Box>
    </>
  )
}

export default Header
