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
    backgroundColor: theme.palette.primary.main2,
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
  parametersHeading: {textAlign: 'left', marginTop: '15px', marginLeft: '8px', fontWeight: '500', fontSize: '16px'}
}))

export default useStyles
