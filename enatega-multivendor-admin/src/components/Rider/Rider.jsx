import React, { useState, useRef } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import { validateFuncForRider } from '../../constraints/constraints'
import { withTranslation } from 'react-i18next'
// core components
import {
  createRider,
  editRider,
  getRiders,
  getZones,
  getAvailableRiders
} from '../../apollo'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'
import {
  Box,
  Switch,
  Typography,
  Input,
  Alert,
  Select,
  MenuItem,
  Button,
  Grid,
  Checkbox
} from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const CREATE_RIDER = gql`
  ${createRider}
`
const EDIT_RIDER = gql`
  ${editRider}
`
const GET_RIDERS = gql`
  ${getRiders}
`
const GET_ZONES = gql`
  ${getZones}
`
const GET_AVAILABLE_RIDERS = gql`
  ${getAvailableRiders}
`

function Rider(props) {
  const formRef = useRef()
  const mutation = props.rider ? EDIT_RIDER : CREATE_RIDER
  const name = props.rider ? props.rider.name : ''
  const userName = props.rider ? props.rider.username : ''
  const password = props.rider ? props.rider.password : ''
  const phone = props.rider ? props.rider.phone : ''
  const zone = props.rider ? props.rider.zone._id : ''
  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')
  const [nameError, nameErrorSetter] = useState(null)
  const [usernameError, usernameErrorSetter] = useState(null)
  const [passwordError, passwordErrorSetter] = useState(null)
  const [phoneError, phoneErrorSetter] = useState(null)
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('')
  const [zoneError, zoneErrorSetter] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [riderAvailable, setRiderAvailable] = useState(
    props.rider ? props.rider.available : true
  )
  const [riderZone, setRiderZone] = useState(
    props.rider ? props.rider.zone._id : ''
  )

  const onCompleted = data => {
    if (!props.rider) clearFields()
    const message = props.rider
      ? t('RiderUpdatedSuccessfully')
      : t('RiderAddedSuccessfully')
    mainErrorSetter('')
    successSetter(message)
    setTimeout(hideAlert, 3000)
  }
  const onError = ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      mainErrorSetter(graphQLErrors[0].message)
    }
    if (networkError) {
      mainErrorSetter(networkError.result.errors[0].message)
    }
    successSetter('')
    setTimeout(hideAlert, 3000)
  }
  const [mutate, { loading }] = useMutation(mutation, {
    refetchQueries: [{ query: GET_RIDERS }, { query: GET_AVAILABLE_RIDERS }],
    onError,
    onCompleted
  })
  const { data } = useQuery(GET_ZONES)

  const onBlur = (setter, field, state) => {
    const validationResult = validateFuncForRider({ [field]: state }, field)
    setter(validationResult.isValid)
  }
  const onSubmitValidaiton = () => {
    const nameError = validateFuncForRider(
      { name: formRef.current['input-name'].value },
      'name'
    )
    const usernameError = validateFuncForRider(
      { username: formRef.current['input-userName'].value },
      'username'
    )
    const passwordError = validateFuncForRider(
      { password: formRef.current['input-password'].value },
      'password'
    )
    const phoneError = validateFuncForRider(
      { phone: formRef.current['input-phone'].value },
      'phone'
    )
    const zoneError = validateFuncForRider(
      { zone: formRef.current['input-zone'].value },
      'zone'
    )

    nameErrorSetter(nameError.isValid)
    usernameErrorSetter(usernameError.isValid)
    setUserNameErrorMessage(usernameError.errorMessage)
    phoneErrorSetter(phoneError.isValid)
    passwordErrorSetter(passwordError.isValid)
    zoneErrorSetter(zoneError.isValid)
    return (
      nameError.isValid &&
      usernameError.isValid &&
      phoneError.isValid &&
      passwordError.isValid &&
      zoneError.isValid
    )
  }
  const clearFields = () => {
    formRef.current.reset()
    nameErrorSetter(null)
    usernameErrorSetter(null)
    passwordErrorSetter(null)
    phoneErrorSetter(null)
    zoneErrorSetter(null)
  }

  const hideAlert = () => {
    mainErrorSetter('')
    successSetter('')
  }
  const { t } = props

  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box
          item
          className={props.rider ? classes.headingBlack : classes.heading}>
          <Typography
            variant="h6"
            className={props.rider ? classes.textWhite : classes.text}>
            {props.rider ? t('EditRider') : t('AddRider')}
          </Typography>
        </Box>
        <Box ml={10} mt={1}>
          <label>{t('Available')}</label>
          <Switch
            defaultChecked={riderAvailable}
            value={riderAvailable}
            onChange={e => setRiderAvailable(e.target.checked)}
            id="input-available"
            name="input-available"
            style={{ color: 'black' }}
          />
        </Box>
      </Box>

      {/* <Box className={classes.form}> */}
      <form ref={formRef}>
        <Box className={globalClasses.flexRow}>
          <Grid container spacing={-4} style={{ maxWidth: '600px' }}>
            <Grid item xs={12} sm={6} style={{ alignItems: 'center' }}>
              {/* <Box> */}
              <Typography className={classes.labelText}>{t('Name')}</Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-name"
                name="input-name"
                placeholder={t('PHRiderName')}
                type="text"
                defaultValue={name}
                onBlur={event => {
                  onBlur(nameErrorSetter, 'name', event.target.value)
                }}
                disableUnderline
                className={[
                  globalClasses.input,
                  nameError === false
                    ? globalClasses.inputError
                    : nameError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
              {/* </Box> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* <Box> */}
              <Typography className={classes.labelText}>
                {t('Username')}
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-username"
                name="input-userName"
                placeholder={t('Username')}
                type="text"
                defaultValue={userName}
                onBlur={event =>
                  onBlur(usernameErrorSetter, 'username', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  usernameError === false
                    ? globalClasses.inputError
                    : usernameError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
              {usernameError === false && (
                <Typography
                  variant="p"
                  style={{
                    color: 'red',
                    fontSize: '12px',
                    float: 'left',
                    marginTop: '5px',
                    textAlign: 'left',
                    marginLeft: '10px',
                  }}>
                  {t(userNameErrorMessage)}
                </Typography>
              )}
              {/* </Box> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* <Box> */}
              <Typography className={classes.labelText}>
                {t('Password')}
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-password"
                name="input-password"
                placeholder={t('Password')}
                type={showPassword ? 'text' : 'password'}
                defaultValue={password}
                onBlur={event =>
                  onBlur(passwordErrorSetter, 'password', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  passwordError === false
                    ? globalClasses.inputError
                    : passwordError === true
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
              {/* </Box> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* <Box> */}
              <Typography className={classes.labelText}>
                {t('Number')}
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                ref={formRef}
                id="input-phone"
                name="input-phone"
                placeholder={t('PhoneNumber')}
                type="tel"
                defaultValue={phone}
                onBlur={event =>
                  onBlur(phoneErrorSetter, 'phone', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  phoneError === false
                    ? globalClasses.inputError
                    : phoneError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
                pattern="[0-9]*"
              />
              {/* </Box> */}
            </Grid>
          </Grid>
        </Box>

        <Box className={globalClasses.flexRow}>
          <Select
            labelId="rider-zone"
            id="input-zone"
            name="input-zone"
            defaultValue={riderZone}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            value={riderZone}
            onChange={e => setRiderZone(e.target.value)}
            className={[
              globalClasses.input,
              zoneError === false
                ? globalClasses.inputError
                : zoneError === true
                ? globalClasses.inputSuccess
                : ''
            ]}>
            {!zone && (
              <MenuItem sx={{ color: 'black' }} value={''}>
                {t('RiderZone')}
              </MenuItem>
            )}
            {data &&
              data.zones.map(zone => (
                <MenuItem
                  style={{ color: 'black' }}
                  value={zone._id}
                  key={zone._id}>
                  {zone.title}
                </MenuItem>
              ))}
          </Select>
        </Box>
        <Box>
          <Button
            className={globalClasses.button}
            disabled={loading}
            onClick={async e => {
              e.preventDefault()
              if (onSubmitValidaiton()) {
                mutate({
                  variables: {
                    riderInput: {
                      _id: props.rider ? props.rider._id : '',
                      name: formRef.current['input-name'].value,
                      username: formRef.current['input-userName'].value,
                      password: formRef.current['input-password'].value,
                      phone: formRef.current['input-phone'].value,
                      zone: riderZone,
                      available: riderAvailable
                    }
                  }
                })
                // Close the modal after 3 seconds by calling the parent's onClose callback
                setTimeout(() => {
                  props.onClose() // Close the modal
                }, 4000)
              }
            }}>
            {t('Save')}
          </Button>
        </Box>
      </form>
      <Box mt={2}>
        {success && (
          <Alert
            className={globalClasses.alertSuccess}
            variant="filled"
            severity="success">
            {success}
          </Alert>
        )}
        {mainError && (
          <Alert
            className={globalClasses.alertSuccess}
            variant="filled"
            severity="error">
            {mainError}
          </Alert>
        )}
      </Box>
      {/* </Box> */}
    </Box>
  )
}
export default withTranslation()(Rider)
