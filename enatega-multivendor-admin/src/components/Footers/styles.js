import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  footer: {
    marginTop: '20%',
    width: '100%',
    padding: 3,
    background: `linear-gradient(237.49deg, ${theme.palette.success.lightest} 0.63%, ${theme.palette.success.darkest} 85.49%)`
  },
  link: {
    padding: 10,
    color: theme.palette.secondary.dark,
    '&:hover': { color: theme.palette.primary.main2 }
  },
  text: {
    padding: 10
  }
}))

export default useStyles
