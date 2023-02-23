import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import ResetPassword from '../ResetPassword/ResetPassword'
import { useApolloClient } from '@apollo/client'
import {
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Typography,
  AppBar,
  Box,
  Toolbar,
  Divider
} from '@mui/material'

function AdminNavbar(props) {
  const client = useApolloClient()
  const [modal, modalSetter] = useState(false)
  const toggleModal = () => {
    modalSetter(prev => !prev)
  }
  const { t } = props
  const vendor = localStorage.getItem('user-enatega')
    ? JSON.parse(localStorage.getItem('user-enatega')).userType === 'VENDOR'
    : false
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      sx={{
        display: { xs: 'none', sm: 'block' },
        flexGrow: 1,
        boxShadow: 0
      }}>
      <AppBar position="static" sx={{ bgcolor: 'transparent', boxShadow: 0 }}>
        <Toolbar>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ flexGrow: 1, color: 'common.black', fontWeight: 'bold' }}>
            {props.match.path === '/restaurant' ? '' : t(props.brandText)}
          </Typography>

          <div>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: 'white',
                paddingRight: '10px',
                borderRadius: '40px',
                height: 40,
                width: 90
              }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit">
                <img
                  alt="..."
                  src={require('../../assets/img/theme/team-4-800x800.jpg')}
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: '50%',
                    marginLeft: -10
                  }}
                />
              </IconButton>
              <Typography
                mt={1}
                sx={{ fontWeight: 'bold' }}
                color="common.black">
                Ninja
              </Typography>
            </Box>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <MenuItem sx={{ color: '#000' }} onCLick={handleClose}>
                Welcome
              </MenuItem>
              <Divider />
              {vendor ? (
                <MenuItem
                  sx={{ color: '#000' }}
                  onClick={e => {
                    e.preventDefault()
                    toggleModal()
                  }}>
                  Reset Password
                </MenuItem>
              ) : null}
              <MenuItem
                sx={{ color: '#000' }}
                onClick={e => {
                  e.preventDefault()
                  localStorage.removeItem('user-enatega')
                  localStorage.removeItem('restaurant_id')
                  client.clearStore()
                  props.history.push('/auth/login')
                }}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Modal
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        open={modal}
        onClose={() => {
          toggleModal()
        }}>
        <ResetPassword />
      </Modal>
    </Box>
  )
}

export default withTranslation()(AdminNavbar)
