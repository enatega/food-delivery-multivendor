import { blue } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: blue.A200
      }
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: blue.A200,
        // color: "white",
      }
    },
    MuiPickersDay: {
      day: {
        color: blue.A700
      },
      daySelected: {
        backgroundColor: blue['400']
      },
      dayDisabled: {
        color: blue['100']
      },
      current: {
        color: blue['900']
      }
    },
    MuiPickersModal: {
      dialogAction: {
        color: blue['400']
      }
    }
  },
  typography: {
    fontFamily: ['Inter', 'Open Sans', 'sans-serif'].join(),
    htmlFontSize: 16,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 300,
      fontSize: '6rem',
      lineHeight: 1.167,
      letterSpacing: '-0.01562em'
    },
    h2: {
      fontWeight: 300,
      fontSize: '3.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em'
    },
    h3: {
      fontWeight: 400,
      fontSize: '3rem',
      lineHeight: 1.167,
      letterSpacing: '0em'
    },
    h4: {
      fontWeight: 400,
      fontSize: '2.125rem',
      lineHeight: 1.235,
      letterSpacing: '0.00735em'
    },
    h5: {
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.334,
      letterSpacing: '0em'
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.6,
      letterSpacing: '0.0075em'
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em'
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em'
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em'
    },
    body2: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em'
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase'
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em'
    },
    overline: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase'
    },
    shape: {
      borderRadius: 4
    },
    zIndex: {
      mobileStepper: 1000,
      speedDial: 1050,
      appBar: 1100,
      drawer: 1200,
      modal: 1300,
      snackbar: 1400,
      tooltip: 1500
    }
  },
  palette: {
    mode: 'light',
    common: {
      black: '#000',
      blackShade: 'rgba(0, 0, 0, 0.06)',
      white: '#fff'
    },
    primary: {
      main: '#6FCF97',
      main2: '#90EA93',
      main3: '#3C8F7C',
      light: '#fff',
      dark: '#000',
      contrastText: '#fff'
    },
    secondary: {
      main: '#FAFAFA',
      light: '#333333',
      lightest: '#3C8F7C',
      dark: '#949393',
      darkest: '#3EC6DD',
      contrastText: '#fff'
    },
    success: {
      main: '#1DB20D',
      light: '#CDCDCD',
      lightest: '#EEF4FA',
      dark: '#FDEFDD',
      darkest: '#DEE6ED',
      contrastText: '#fff'
    },
    info: {
      main: 'rgba(39,111,191,0.8)',
      light: 'rgba(63, 64, 65, 0.66)',
      lightest: 'rgba(238, 244, 250, 0.66)',
      dark: 'rgba(0, 0, 0, 0.08)',
      darkest: 'rgba(0, 0, 0, 0.1)',
      contrastText: '#fff'
    },
    error: {
      main: '#fe0000',
      light: '#BB2124',
      lightest: '#fb6340',
      contrastText: '#fff'
    },
    warning: {
      main: '#FA7751',
      light: '#FCC54C',
      lightest: 'rgba(240, 173, 78,0.2)',
      dark: '#90EA93',
      darkest: 'rgba(111, 207, 151, 0.34)',
      contrastText: '#fff'
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    text: {
      primary: '#fff',
      secondary: '#212121',
      disabled: '#5A5858',
      hint: '#FFF'
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    background: {
      paper: '#FAFAFA',
      default: '#fff',
      primary: '#f9fafc'
    }
  }
})

export default theme
