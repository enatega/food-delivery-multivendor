import React, { useRef, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../constraints/constraints'
import { withTranslation } from 'react-i18next'
import { createVendor, editVendor, getVendors } from '../../apollo'
import { Input, Button, Alert, Box, Typography } from '@mui/material'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'

const CREATE_VENDOR = gql`
  ${createVendor}
`
const EDIT_VENDOR = gql`
  ${editVendor}
`
const GET_VENDORS = gql`
  ${getVendors}
`

function Vendor(props) {
  const formRef = useRef()
  const mutation = props.vendor ? EDIT_VENDOR : CREATE_VENDOR
  const email = props.vendor ? props.vendor.email : ''
  const [error, errorSetter] = useState('')
  const [success, successSetter] = useState('')
  const [emailError, emailErrorSetter] = useState(null)
  const [passError, passErrorSetter] = useState(null)
  const { t } = props
  const onCompleted = data => {
    if (!props.vendor) clearFields()
    const message = props.vendor
      ? 'Vendor updated successfully'
      : 'Vendor added successfully'
    errorSetter('')
    successSetter(message)
    setTimeout(hideAlert, 5000)
  }

  const onError = ({ graphQLErrors, networkError }) => {
    successSetter('')
    if (graphQLErrors) errorSetter(graphQLErrors[0].message)
    else if (networkError) errorSetter(networkError.result.errors[0].message)
    else errorSetter('Something went wrong!')
    setTimeout(hideAlert, 5000)
  }
  const [mutate, { loading: mutateLoading }] = useMutation(mutation, {
    refetchQueries: [{ query: GET_VENDORS }],
    onError,
    onCompleted
  })

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const onSubmitValidaiton = () => {
    const emailError = !validateFunc(
      { email: formRef.current['input-email'].value },
      'email'
    )
    const passwordError = props.vendor
      ? true
      : !validateFunc(
          { password: formRef.current['input-password'].value },
          'password'
        )

    emailErrorSetter(emailError)
    passErrorSetter(passwordError)
    return emailError && passwordError
  }
  const clearFields = () => {
    formRef.current.reset()
    emailErrorSetter('')
    passErrorSetter('')
  }

  const hideAlert = () => {
    errorSetter('')
    successSetter('')
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  return (
    <Box className={classes.container}>
      <Box className={props.vendor ? classes.headingBlack : classes.heading}>
        <Typography className={props.vendor ? classes.textWhite : classes.text}>
          {props.vendor ? t('Edit Vendor') : t('Add Vendor')}
        </Typography>
      </Box>
      <Box item lg={12} className={[globalClasses.flex, classes.form]}>
        <form ref={formRef}>
          <Input
            id="input-email"
            name="input-email"
            placeholder="Email"
            type="email"
            disableUnderline
            className={[
              globalClasses.input,
              emailError === false
                ? globalClasses.inputError
                : emailError === true
                ? globalClasses.inputSuccess
                : ''
            ]}
            defaultValue={email}
            onBlur={event =>
              onBlur(emailErrorSetter, 'email', event.target.value)
            }
          />
          {!props.vendor ? (
            <Input
              placeholder="Password"
              disableUnderline
              className={[
                globalClasses.input,
                passError === false
                  ? globalClasses.inputError
                  : passError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
              id="input-password"
              name="input-password"
              type="text"
              onBlur={event => {
                onBlur(passErrorSetter, 'password', event.target.value)
              }}
            />
          ) : null}
          <Button
            className={globalClasses.button}
            disabled={mutateLoading}
            onClick={async e => {
              e.preventDefault()
              if (onSubmitValidaiton() && !mutateLoading) {
                mutate({
                  variables: {
                    vendorInput: {
                      _id: props.vendor ? props.vendor._id : '',
                      email: formRef.current['input-email'].value.toLowerCase(),
                      password: formRef.current['input-password']
                        ? formRef.current['input-password'].value
                        : ''
                    }
                  }
                })
              }
            }}>
            {props.vendor ? 'Update' : 'Save'}
          </Button>
        </form>
        <Box mt={2}>
          {success && (
            <Alert
              className={globalClasses.alertSuccess}
              variant="filled"
              severity="success">
              Success
            </Alert>
          )}
          {error && (
            <Alert
              className={globalClasses.alertError}
              variant="filled"
              severity="error">
              Error
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  )
}
export default withTranslation()(Vendor)
