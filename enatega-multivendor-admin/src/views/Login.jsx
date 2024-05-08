import React, { useState, useEffect, useRef } from 'react'
import { withTranslation } from 'react-i18next'
import {
  Box,
  Alert,
  Typography,
  Input,
  Button,
  Grid,
  Link,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@mui/material'

import { useMutation, gql } from '@apollo/client'
import { ownerLogin } from '../apollo'
import { validateFunc } from '../constraints/constraints'
import useStyles from '../components/Configuration/styles'
import useGlobalStyles from '../utils/globalStyles'
import LoginBg from '../assets/img/loginBg.png'
import LoginPageIcon from '../assets/img/LoginPageIcon.png'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const LOGIN = gql`
  ${ownerLogin}
`
const Login = props => {
  const [showPassword, setShowPassword] = useState(false)
  const [stateData, setStateData] = useState({
    email: 'admin@gmail.com',
    password: '123123',
    emailError: null,
    passwordError: null,
    error: null,
    type: null, /// 0 for vendor
    redirectToReferrer: !!localStorage.getItem('user-enatega')
  })
  const formRef = useRef()
  const { t } = props

  const [isLogged, setIsLogged] = useState(false)
  const onBlur = (event, field) => {
    setStateData({
      ...stateData,
      [field + 'Error']: !validateFunc({ [field]: stateData[field] }, field)
    })
  }
  const validate = () => {
    const emailError = !validateFunc({ email: stateData.email }, 'email')
    const passwordError = !validateFunc(
      { password: stateData.password },
      'password'
    )
    setStateData({ ...stateData, emailError, passwordError })
    return emailError && passwordError
  }
  const { redirectToReferrer, type } = stateData

  useEffect(() => {
    if (isLogged) {
      if (redirectToReferrer && type === 0) {
        props.history.replace('/restaurant/list')
      }
      if (redirectToReferrer && type === 1) {
        props.history.replace('/super_admin/vendors')
      }
    }
  }, [isLogged])

  const onCompleted = data => {
    localStorage.setItem('user-enatega', JSON.stringify(data.ownerLogin))
    const userType = data.ownerLogin.userType
    if (userType === 'VENDOR') {
      setStateData({
        ...stateData,
        redirectToReferrer: true,
        type: 0,
        emailError: null,
        passwordError: null
      })
    } else {
      setStateData({
        ...stateData,
        redirectToReferrer: true,
        type: 1,
        emailError: null,
        passwordError: null
      })
    }
    setIsLogged(true)
    setTimeout(hideAlert, 5000)
  }
  const hideAlert = () => {
    setStateData({
      ...stateData,
      emailError: null,
      passwordError: null
    })
  }
  const onError = error => {
    if (error.graphQLErrors.length) {
      setStateData({
        ...stateData,
        error: error.graphQLErrors[0].message
      })
    }
    if (error.networkError) {
      setStateData({
        ...stateData,
        error: error.message
      })
    }
    setIsLogged(false)
    setTimeout(hideAlert, 5000)
  }
  const [mutate] = useMutation(LOGIN, { onError, onCompleted })

  const loginFunc = async() => {
    if (validate()) {
      mutate({ variables: { ...stateData } })
    }
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <>
      <Grid
        container
        sx={{
          backgroundImage: `url(${LoginBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
          // height: '100%'
        }}>
        <Grid
          item
          lg={5}
          pt={5}
          pb={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
            // backgroundColor: 'green'
            // marginTop: '5%'
          }}>
          <img
            src={LoginPageIcon}
            alt="login img"
            style={{ height: '50%', width: '70%' }}
          />
        </Grid>
        <Grid
          item
          lg={7}
          ml={-10}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
            {t('enterYourDetailsBelow')}
          </Typography>
          <Box container sx={{ width: 600 }} className={classes.container}>
            <Box className={classes.flexRow}>
              <Box item className={classes.heading}>
                <Typography variant="h6" className={classes.text}>
                  {t('LogintoEnatega')}
                </Typography>
              </Box>
            </Box>

            <Box className={classes.form}>
              <form ref={formRef}>
                <Box>
                  <Typography className={classes.labelText}>
                    {t('Email')}
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    id="input-email"
                    name="input-email"
                    value={stateData.email}
                    onChange={event => {
                      setStateData({ ...stateData, email: event.target.value })
                    }}
                    onBlur={event => {
                      onBlur(event, 'email')
                    }}
                    placeholder={t('Email')}
                    type="email"
                    disableUnderline
                    className={[
                      globalClasses.input,
                      stateData.emailError === false
                        ? globalClasses.inputError
                        : stateData.emailError === true
                        ? globalClasses.inputSuccess
                        : ''
                    ]}
                  />
                </Box>
                <Box>
                  <Typography className={classes.labelText}>
                    {t('Password')}
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    id="input-password"
                    name="input-password"
                    placeholder={t('Password')}
                    value={stateData.password}
                    type={showPassword ? 'text' : 'password'}
                    onChange={event => {
                      setStateData({
                        ...stateData,
                        password: event.target.value
                      })
                    }}
                    onBlur={event => {
                      onBlur(event, 'password')
                    }}
                    disableUnderline
                    className={[
                      globalClasses.input,
                      stateData.passwordError === false
                        ? globalClasses.inputError
                        : stateData.passwordError === true
                        ? globalClasses.inputSuccess
                        : ''
                    ]}
                    endAdornment={
                      <InputAdornment position="end">
                        <Checkbox
                          checked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                          color="primary"
                          icon={<VisibilityOffIcon />}
                          checkedIcon={<VisibilityIcon />}
                        />
                      </InputAdornment>
                    }
                  />
                </Box>
                <Box
                  pl={3}
                  pr={4}
                  pt={2}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label={t('RememberMe')}
                    />
                  </FormGroup>
                  <Link
                    href="/#/auth/reset"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                      fontWeight: 'bold'
                    }}>
                    {t('ForgotYourPassword')}
                  </Link>
                </Box>
                <Box>
                  <Button
                    className={globalClasses.button100}
                    onClick={loginFunc}>
                    {t('Login')}
                  </Button>
                </Box>
              </form>
              <Box mt={2}>
                {stateData.error && (
                  <Alert
                    className={globalClasses.alertError}
                    variant="filled"
                    severity="error">
                    {stateData.error}
                  </Alert>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
export default withTranslation()(Login)
