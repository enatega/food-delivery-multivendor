import React, { useState, useRef } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import { validateFunc } from '../../constraints/constraints'
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
  Button
} from '@mui/material'

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

function WithdrawRequest(props) {
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
  const [zoneError, zoneErrorSetter] = useState(null)
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
    setTimeout(hideAlert, 5000)
  }
  const onError = ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      mainErrorSetter(graphQLErrors[0].message)
    }
    if (networkError) {
      mainErrorSetter(networkError.result.errors[0].message)
    }
    successSetter('')
    setTimeout(hideAlert, 5000)
  }
  const [mutate, { loading }] = useMutation(mutation, {
    refetchQueries: [{ query: GET_RIDERS }, { query: GET_AVAILABLE_RIDERS }],
    onError,
    onCompleted
  })
  const { data } = useQuery(GET_ZONES)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }
  const onSubmitValidaiton = () => {
    const nameError = !validateFunc(
      { name: formRef.current['input-name'].value },
      'name'
    )
    const usernameError = !validateFunc(
      { username: formRef.current['input-userName'].value },
      'username'
    )
    const passwordError = !validateFunc(
      { password: formRef.current['input-password'].value },
      'password'
    )
    const phoneError = !validateFunc(
      { phone: formRef.current['input-phone'].value },
      'phone'
    )
    const zoneError = !validateFunc(
      { zone: formRef.current['input-zone'].value },
      'zone'
    )

    nameErrorSetter(nameError)
    usernameErrorSetter(usernameError)
    phoneErrorSetter(phoneError)
    passwordErrorSetter(passwordError)
    zoneErrorSetter(zoneError)
    return (
      nameError && usernameError && phoneError && passwordError && zoneError
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
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
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

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
            <Input
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
            <Input
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
          </Box>
          <Box className={globalClasses.flexRow}>
            <Input
              ref={formRef}
              id="input-phone"
              name="input-phone"
              placeholder={t('PhoneNumber')}
              type="number"
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
            />
            <Input
              id="input-password"
              name="input-password"
              placeholder={t('PHNumber')}
              type="text"
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
            />
          </Box>
          <Box className={globalClasses.flexRow}>
            <Select
              id="input-zone"
              name="input-zone"
              defaultValue={riderZone}
              value={riderZone}
              onChange={e => setRiderZone(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className={[
                globalClasses.input,
                zoneError === false
                  ? globalClasses.inputError
                  : zoneError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}>
              {!zone && (
                <MenuItem style={{ color: 'black' }} value={''}>
                  {t('Select')}
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
              className={globalClasses.alertError}
              variant="filled"
              severity="error">
              {mainError}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  )
}
export default withTranslation()(WithdrawRequest)
