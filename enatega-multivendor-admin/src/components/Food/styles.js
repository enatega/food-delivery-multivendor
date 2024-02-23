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
    boxShadow: `0px 0px 38px ${theme.palette.common.blackShade}`,
    textAlign: 'center',
    paddingBottom: 5
  },
  width60: {
    width: '75%',
    alignSelf: 'center'
  },
  innerContainer: {
    padding: 12,
    backgroundColor: theme.palette.common.white,
    borderRadius: 20,
    textAlign: 'left'
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
  text: {
    color: theme.palette.common.black,
    fontWeight: 'bold'
  },
  textWhite: {
    color: theme.palette.common.white,
    fontWeight: 'bold'
  },
  form: {
    margin: 25,
    alignItems: 'center'
  },
  labelText: {
    textAlign: 'left',
    marginLeft: '4%',
    fontSize: '15px',
    fontWeight: '500',
    marginTop: '10px'
  },
  fileUpload: {
    marginTop: 10,
    backgroundColor: theme.palette.primary.main2,
    display: 'inlineBlock',
    padding: '3px 6px',
    cursor: 'pointer',
    color: theme.palette.common.white,
    borderRadius: 10,
    fontSize: 12
  },
  file: {
    display: 'none'
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 30
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
  },
  space: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  itemHeader: {
    textAlign: 'left',
    marginLeft: 20,
    fontWeight: 'bold'
  },
  quantity: {
    padding: 2,
    border: '1px solid grey',
    borderRadius: 5
  },
  items: {},
  price: {
    backgroundColor: theme.palette.common.black,
    borderRadius: 20,
    alignItems: 'center',
    textAlign: 'center'
  },
  textBlack: {
    color: theme.palette.common.black
  },
  textPrimary: {
    color: theme.palette.primary.main2
  },
  pd: {
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10
  },
  pb: {
    paddingBottom: 20
  },
  btnBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputLength: {
    width: '50%'
  },
  bgPrimary: {
    backgroundColor: theme.palette.primary.main2,
    width: '70%',
    marginLeft: '15%'
  }
}))

export default useStyles
