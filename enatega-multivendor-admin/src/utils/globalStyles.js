import { makeStyles } from '@mui/styles'

const useGlobalStyles = makeStyles(theme => ({
  flex: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    backgroundColor: theme.palette.common.white,
    margin: '20px 20px 0 0',
    height: 40,
    width: '90%',
    fontSize: 15,
    color: theme.palette.text.disabled,
    padding: '5px 20px',
    borderRadius: 31,
    boxShadow: '0px 0px 18px rgba(0, 0, 0, 0.04)',
    border: `1px solid ${theme.palette.grey[100]}`
  },
  inputError: {
    border: `2px solid ${theme.palette.error.main}`
  },
  inputSuccess: {
    border: `2px solid ${theme.palette.primary.main2}`
  },
  button: {
    backgroundColor: theme.palette.primary.main2,
    height: 35,
    borderRadius: 15,
    color: theme.palette.common.black,
    fontWeight: 'bold',
    border: 'none',
    margin: '20px 0 0 0',
    padding: '5px 25px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  },
  button100: {
    width: '90%',
    backgroundColor: theme.palette.primary.main2,
    height: 35,
    borderRadius: 15,
    color: theme.palette.common.black,
    fontWeight: 'bold',
    border: 'none',
    margin: '20px 0 0 0',
    padding: '5px 25px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  },
  selectInput: {
    height: 20,
    backgroundColor: theme.palette.common.white,
    borderRadius: 10,
    boxShadow: '0px 0px 18px rgba(0, 0, 0, 0.04)',
    border: `1px solid ${theme.palette.grey[100]}`
  },
  timing: {
    backgroundColor: theme.palette.background.primary,
    margin: '30px 0',
    borderRadius: 20,
    boxShadow: `0px 0px 38px ${theme.palette.common.blackShade}`,
    textAlign: 'center'
  },
  timingHeader: {
    backgroundColor: theme.palette.primary.main2,
    borderRadius: '20px 20px 0 0',
    fontWeight: 'bold',
    padding: '10px ',
    color: theme.palette.common.black
  },
  dayComponent: {
    // backgroundColor: theme.palette.grey[700],
    padding: 5,
    borderRadius: 15,
    marginTop: 5,
    marginBottom: 5
  },
  day: {
    // backgroundColor: theme.palette.grey[200],
    color: theme.palette.common.black,
    borderRadius: 15
  },
  openBtn: {
    borderRadius: 20,
    padding: '0 5px',
    backgroundColor: theme.palette.primary.main2,
    color: theme.palette.common.black
  },
  closeBtn: {
    borderRadius: 20,
    padding: '0 5px',
    color: theme.palette.primary.main2,
    backgroundColor: theme.palette.common.black
  },
  mb: {
    marginBottom: 20
  },
  alertSuccess: {
    backgroundColor: theme.palette.primary.main2,
    paddingTop: 0,
    paddingBottom: 0
  },
  alertError: {
    backgroundColor: theme.palette.warning.main,
    paddingTop: 0,
    paddingBottom: 0
  }
}))

export default useGlobalStyles
