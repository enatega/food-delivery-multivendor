import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  container: {
    backgroundColor: theme.palette.background.primary,

    margin: '30px 0',
    borderRadius: 20,
    boxShadow: '0px 0px 38px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
    paddingBottom: 5
  },
  width60: {
    width: '65%',
    alignSelf: 'center'
  },
  heading: {
    backgroundColor: theme.palette.primary.main3,
    width: '50%',
    padding: 10,
    borderRadius: '20px 20px 20px 0',
    textAlign: 'center'
  },
  headingBlack: {
    backgroundColor: theme.palette.common.black,
    width: '50%',
    padding: 10,
    borderRadius: '20px 20px 20px 0',
    textAlign: 'center'
  },
  form: {
    margin: 25,
    alignItems: 'center'
  },
  text: {
    color: theme.palette.common.white,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: theme.palette.common.black,
    height: 35,
    borderRadius: 15,
    color: theme.palette.primary.main2,
    fontWeight: 'bold',
    border: 'none',
    margin: '20px 0 20px 0',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  }
}))

export default useStyles
