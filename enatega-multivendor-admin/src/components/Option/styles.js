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
  heading: {
    backgroundColor: theme.palette.primary.main3,
    width: '50%',
    padding: 10,
    borderRadius: '20px 20px 20px 0',
    textAlign: 'center'
  },
  form: {
    margin: 25,
    alignItems: 'center'
  },
  btn: {
    // height: 20,
    // width: 20,
    // padding: 0,
    // borderRadius: '50%',
    // marginTop: 20
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
  addIcon: {
    backgroundColor: theme.palette.primary.main2,
    color: theme.palette.common.black,
    borderRadius: '50%',
    margin: '0 10px 0 0'
  },
  removeIcon: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.primary.main2,
    borderRadius: '50%',
    margin: '0 10px 0 0'
  },
  labelText: {
    textAlign: 'left',
    marginLeft: '4%',
    fontSize: '15px',
    fontWeight: '500',
    marginTop: '10px'
  }
}))

export default useStyles
