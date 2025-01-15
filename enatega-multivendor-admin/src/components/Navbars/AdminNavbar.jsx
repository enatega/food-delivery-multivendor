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
  Divider,
  FormControl,
  Select,
  useTheme
} from '@mui/material'
import profileImg from '../../assets/img/theme/team-4-800x800.jpg'


function AdminNavbar(props) {
  const theme = useTheme()
  const client = useApolloClient()
  const [modal, setModal] = useState(false)
  const [language, setLanguage] = useState(
    localStorage.getItem('enatega-language') || 'en'
  )
  const [anchorEl, setAnchorEl] = useState(null) // Define anchorEl state

  const { t, i18n } = props

  const toggleModal = () => {
    setModal(prev => !prev)
  }

  const handleMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChangeLanguage = event => {
    const newLanguage = event.target.value
    setLanguage(newLanguage)
    localStorage.setItem('enatega-language', newLanguage)
    i18n.changeLanguage(newLanguage)
    handleClose()
  }

  const vendor = localStorage.getItem('user-enatega')
    ? JSON.parse(localStorage.getItem('user-enatega')).userType === 'VENDOR'
    : false

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
              onClick={handleMenu}
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
                color="inherit">
                <img
                  alt="..."
                  src={profileImg}
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
                sx={{ fontWeight: 'bold',cursor: 'pointer' }}
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
              <MenuItem>
                <FormControl>
                  <Select
                    value={language}
                    onChange={handleChangeLanguage}
                    style={{ color: theme.palette.common.black }}>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="en">
                      English
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="ar">
                      Arabic
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="de">
                      Deutsche
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="zh">
                      中文
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="km">
                      ភាសាខ្មែរ
                    </MenuItem>
                    <MenuItem
                      sx={{ color: theme.palette.common.black }}
                      value="fr">
                      français
                    </MenuItem>
                  </Select>
                </FormControl>
              </MenuItem>
              <Divider />
              {vendor ? (
                <MenuItem
                  sx={{ color: theme.palette.common.black }}
                  onClick={e => {
                    e.preventDefault()
                    toggleModal()
                  }}>
                  {t('ResetPassword')}
                </MenuItem>
              ) : null}
              <MenuItem
                sx={{ color: theme.palette.common.black }}
                onClick={e => {
                  e.preventDefault()
                  localStorage.removeItem('user-enatega')
                  localStorage.removeItem('restaurant_id')
                  client.clearStore()
                  props.history.push('/auth/login')
                }}>
                {t('Logout')}
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
