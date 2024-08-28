import * as React from 'react'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Link,
  SvgIcon,
  useTheme
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import routes from '../../routes'
import useStyles from './styles'
import { ReactComponent as Logo } from '../../assets/svg/logo.svg'
import { useLocation } from 'react-router-dom'
import { useTranslation, withTranslation } from 'react-i18next'

const drawerWidth = 240
function AdminSidebar(props) {
  const theme = useTheme()
  const { t } = useTranslation()
  const location = useLocation()
  const classes = useStyles()
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const createLinks = (
    // <Box className={classes.sidebarContainer}>
    <Box className={classes.sidebarBox}>
      <Toolbar className={[classes.rowDisplay, classes.logo]}>
        <Logo fontSize="small" />
        <Typography
          variant="h2"
          className={[classes.headingText, classes.logoText]}>
          ENATEGA
        </Typography>
      </Toolbar>
      <Box className={classes.sidebarList}>
        {routes.map((prop, key) => {
        
          return prop.appearInSidebar && prop.admin ? (
            <>
              {key === 1 ? (
                <Typography className={classes.headingText} variant="h3">
                  {t('GENERAL')}
                </Typography>
              ) : null}
              {key === 6 ? (
                <Typography className={classes.headingText} variant="h3">
                  {t('MANAGEMENT')}
                </Typography>
              ) : null}
              <Link
                className={[
                  classes.rowDisplay,
                  classes.sidebarLink,
                  location.pathname === `${prop.layout}${prop.path}` &&
                    classes.active
                ]}
                href={'#' + prop.layout + prop.path}
                underline="none">
                <SvgIcon
                  component={prop.icon}
                  htmlColor="red"
                  fontSize="small"
                />
                <Typography
                  variant="h6"
                  className={[
                    classes.linkText,
                    location.pathname !== `${prop.layout}${prop.path}`
                      ? classes.blackText
                      : classes.whiteText
                  ]}>
                  {t(prop.name)}
                </Typography>
              </Link>
            </>
          ) : null
        })}
      </Box>
    </Box>
    // </Box>
  )

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <>
      {/* <CssBaseline /> */}
      <AppBar
        mb={10}
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { sm: 'none' },
          bgcolor: 'primary.main2',
          marginBottom: '100px'
        }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '70%' }
          }}>
          {createLinks}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            backgroundColor: 'red',
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: `linear-gradient(180deg, ${theme.palette.warning.dark} 50%, transparent 50%)`,
              borderRight: 'none'
            }
          }}
          open>
          {createLinks}
        </Drawer>
      </Box>
    </>
  )
}

export default withTranslation()(AdminSidebar)
