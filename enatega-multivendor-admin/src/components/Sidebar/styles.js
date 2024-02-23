import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  rowDisplay: { display: 'flex', flexDirection: 'row' },
  logo: {
    marginLeft: -10
  },
  sidebarContainer: {
    backgroundColor: theme.palette.primary.main2,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 0
    }
  },
  sidebarBox: {
    backgroundColor: theme.palette.common.white,
    padding: '5px 15px 5px 5px',
    borderRadius: '0px 35px 35px 0px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 0
    },
    height: '100%'
  },
  sidebarList: { padding: '5px 5px 20px 10px' },
  sidebarLink: {
    height: '18px',
    backgroundColor: theme.palette.background.primary,
    marginTop: 8,
    padding: '7px 10px',
    borderRadius: 10,

    '&:hover': {
      backgroundColor: theme.palette.primary.main2,
      boxShadow: `0px 0px 5px ${theme.palette.warning.darkest}`
    }
  },
  active: {
    backgroundColor: theme.palette.primary.main2,
    boxShadow: `0px 0px 5px ${theme.palette.warning.darkest}`
  },
  blackText: {
    color: 'black',
    fontWeight: 400
  },
  whiteText: {
    color: 'white',
    fontWeight: 400
  },
  linkText: {
    fontSize: 13,
    fontWeight: 400,
    paddingLeft: 12,
    marginTop: -2
  },
  headingText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15,
    color: theme.palette.common.black
  },
  logoText: {
    fontWeight: 'bold',
    paddingLeft: 10,
    fontSize: 21
  },
  restContainer: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: theme.palette.background.primary,
    borderRadius: 10,
    marginRight: 7
  },
  restText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.common.black
  },
  restImage: {
    borderRadius: 5,
    marginRight: 10
  }
}))

export default useStyles
