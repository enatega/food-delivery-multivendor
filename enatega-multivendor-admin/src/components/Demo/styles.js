import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  sidebarLink: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main2,
      boxShadow: `0px 0px 5px ${theme.palette.warning.darkest}`
    }
  },
}))

export default useStyles
