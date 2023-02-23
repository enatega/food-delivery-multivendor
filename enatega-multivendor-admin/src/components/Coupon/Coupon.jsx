import React, { useRef, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../constraints/constraints'
import { withTranslation } from 'react-i18next'
import { editCoupon, createCoupon, getCoupons } from '../../apollo'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'
import { Box, Switch, Typography, Input, Button, Alert } from '@mui/material'

const CREATE_COUPON = gql`
  ${createCoupon}
`
const EDIT_COUPON = gql`
  ${editCoupon}
`
const GET_COUPONS = gql`
  ${getCoupons}
`

function Category(props) {
  const formRef = useRef()
  const title = props.coupon ? props.coupon.title : ''
  const discount = props.coupon ? props.coupon.discount : ''
  const [enabled, setEnabled] = useState(
    props.coupon ? props.coupon.enabled : false
  )
  const mutation = props.coupon ? EDIT_COUPON : CREATE_COUPON
  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')
  const [titleError, titleErrorSetter] = useState(null)
  const [discountError, discountErrorSetter] = useState(null)
  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }
  const onCompleted = data => {
    const message = props.coupon ? 'Coupon updated' : 'Coupon added'
    successSetter(message)
    mainErrorSetter('')
    if (!props.coupon) clearFields()
  }
  const onError = error => {
    let message = ''
    try {
      message = error.graphQLErrors[0].message
    } catch (err) {
      message = 'Action failed. Please Try again'
    }
    successSetter('')
    mainErrorSetter(message)
  }
  const [mutate, { loading }] = useMutation(mutation, {
    refetchQueries: [{ query: GET_COUPONS }],
    onError,
    onCompleted
  })

  const onSubmitValidaiton = () => {
    const titleError = !validateFunc(
      { title: formRef.current['input-code'].value },
      'title'
    )
    const discountError = !validateFunc(
      { discount: formRef.current['input-discount'].value },
      'discount'
    )
    titleErrorSetter(titleError)
    discountErrorSetter(discountError)
    return titleError && discountError
  }
  const clearFields = () => {
    formRef.current.reset()
    titleErrorSetter(null)
    discountErrorSetter(null)
  }

  const { t } = props
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box
          item
          className={props.coupon ? classes.headingBlack : classes.heading}>
          <Typography
            variant="h6"
            className={props.coupon ? classes.textWhite : classes.text}>
            {props.coupon ? t('Edit Coupon') : t('Add Coupon')}
          </Typography>
        </Box>
        <Box ml={10} mt={1}>
          <label>{enabled ? 'Disable' : 'Enable'}</label>
          <Switch
            defaultChecked={enabled}
            value={enabled}
            onChange={e => setEnabled(e.target.checked)}
            id="input-enabled"
            name="input-enabled"
            style={{ color: 'black' }}
          />
        </Box>
      </Box>
      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
            <Input
              id="input-code"
              name="input-code"
              placeholder="Code e.g SALE50"
              type="text"
              defaultValue={title}
              onBlur={event =>
                onBlur(titleErrorSetter, 'title', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                titleError === false
                  ? globalClasses.inputError
                  : titleError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
            <Input
              id="input-discount"
              name="input-discount"
              placeholder="Discount % i.e 1-99"
              type="number"
              defaultValue={discount}
              onBlur={event => {
                onBlur(discountErrorSetter, 'discount', event.target.value)
              }}
              disableUnderline
              className={[
                globalClasses.input,
                discountError === false
                  ? globalClasses.inputError
                  : discountError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          {loading ? t('Loading') : null}
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={async e => {
                e.preventDefault()
                if (onSubmitValidaiton() && !loading) {
                  mutate({
                    variables: {
                      couponInput: {
                        _id: props.coupon ? props.coupon._id : '',
                        title: formRef.current['input-code'].value,
                        discount: +formRef.current['input-discount'].value,
                        enabled: enabled
                      }
                    }
                  })
                }
              }}>
              SAVE
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

export default withTranslation()(Category)
