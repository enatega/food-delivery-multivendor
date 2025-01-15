import React, { useState } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { validateFunc } from '../../constraints/constraints'
import { updateOrderStatus, getConfiguration } from '../../apollo'
import Loader from 'react-loader-spinner'
import {
  Box,
  Divider,
  Grid,
  Typography,
  Alert,
  Input,
  Button,
  useTheme
} from '@mui/material'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'

// constants
const UPDATE_STATUS = gql`
  ${updateOrderStatus}
`

const GET_CONFIGURATION = gql`
  ${getConfiguration}
`

function Order(props) {
  const theme = useTheme()
  const { order, t } = props
  const [reason, reasonSetter] = useState('')
  const [reasonError, reasonErrorSetter] = useState(null)
  const [error, errorSetter] = useState('')
  const [success, successSetter] = useState('')

  const onCompleted = ({ updateOrderStatus }) => {
    if (updateOrderStatus) {
      successSetter(t('OrderStatusUpdated'))
    }
    setTimeout(onDismiss, 5000)
  }
  const onError = error => {
    errorSetter(error.message)
    setTimeout(onDismiss, 5000)
  }
  const { data } = useQuery(GET_CONFIGURATION)
  const [mutate, { loading }] = useMutation(UPDATE_STATUS, {
    onError,
    onCompleted
  })

  const validateReason = () => {
    const reasonError = !validateFunc({ reason }, 'reason')
    reasonErrorSetter(reasonError)
    return reasonError
  }

  const onDismiss = () => {
    errorSetter('')
    successSetter('')
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  if (!props.order) return null
  return (
    <Box className={[classes.container, classes.pb]}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            {t('Order')} # {order.orderId}
          </Typography>
        </Box>
      </Box>
      <Box className={[classes.container, classes.bgPrimary]}>
        <Typography className={classes.itemHeader} variant="h6">
          {t('Items')}
        </Typography>
        <Box container className={classes.innerContainer}>
          {order &&
            order.items.map(item => (
              <>
                <Grid container mb={1} mt={1}>
                  <Grid item lg={1}>
                    <Typography
                      className={[classes.quantity, classes.textBlack]}
                      variant="p">
                      {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid className={classes.textBlack} item lg={9}>
                    {`${item.title}${
                      item.variation.title ? `(${item.variation.title})` : ''
                    }`}
                  </Grid>
                  <Grid
                    className={[classes.price, classes.textPrimary]}
                    item
                    lg={2}>
                    {data && data.configuration.currencySymbol}{' '}
                    {(item.variation.price * item.quantity).toFixed(2)}
                  </Grid>
                </Grid>
                {item.specialInstructions.length > 0 && (
                  <Typography variant="text" className={classes.textBlack}>
                    {t('SpecialInstructions')}
                  </Typography>
                )}
                <Divider />
              </>
            ))}
        </Box>
      </Box>
      <Box mt={3} className={[classes.container, classes.bgPrimary]}>
        <Typography className={classes.itemHeader} variant="h6">
          {t('Charges')}
        </Typography>
        <Box container className={classes.innerContainer}>
          <Grid container mb={1} mt={1}>
            <Grid className={classes.textBlack} item lg={10}>
              {t('Subtotal')}
            </Grid>
            <Grid className={[classes.textBlack]} item lg={2}>
              {data && data.configuration.currencySymbol}{' '}
              {(
                order.orderAmount -
                order.deliveryCharges -
                order.tipping -
                order.taxationAmount
              ).toFixed(2)}
            </Grid>
          </Grid>
          <Divider />
          <Grid container mb={1} mt={1}>
            <Grid className={classes.textBlack} item lg={10}>
              {t('DeliveryFee')}
            </Grid>
            <Grid className={[classes.textBlack]} item lg={2}>
              {data && data.configuration.currencySymbol}{' '}
              {order && order.deliveryCharges.toFixed(2)}
            </Grid>
          </Grid>
          <Divider />
          <Grid container mb={1} mt={1}>
            <Grid className={classes.textBlack} item lg={10}>
              {t('TaxCharges')}
            </Grid>
            <Grid className={[classes.textBlack]} item lg={2}>
              {data && data.configuration.currencySymbol}{' '}
              {order && order.taxationAmount.toFixed(2)}
            </Grid>
          </Grid>
          <Divider />
          <Grid container mb={1} mt={1}>
            <Grid className={classes.textBlack} item lg={10}>
              {t('Tip')}
            </Grid>
            <Grid className={[classes.textBlack]} item lg={2}>
              {data && data.configuration.currencySymbol}{' '}
              {order && order.tipping.toFixed(2)}
            </Grid>
          </Grid>
          <Divider />
          <Grid container mb={1} mt={5}>
            <Grid className={classes.textBlack} item lg={10}>
              {t('Total')}
            </Grid>
            <Grid className={[classes.textBlack]} item lg={2}>
              {data && data.configuration.currencySymbol}{' '}
              {order && order.orderAmount.toFixed(2)}
            </Grid>
          </Grid>
          <Divider />
        </Box>
      </Box>
      <Box mb={3} className={[classes.container, classes.bgPrimary]}>
        <Typography className={classes.itemHeader} variant="h6">
          {t('PaymentMethod')}
        </Typography>
        <Box container className={classes.innerContainer}>
          <Grid container mb={1} mt={1}>
            <Grid item lg={3} />
            <Grid
              className={[classes.price, classes.textPrimary, classes.pd]}
              item
              lg={6}>
              {order.paymentMethod}
            </Grid>
            <Grid item lg={3} />
          </Grid>
          <Divider />
          <Grid container mb={1} mt={2}>
            <Grid item lg={10}>
              <Typography className={[classes.textBlack]} variant="p">
                {t('PaidAmount')}
              </Typography>
            </Grid>
            <Grid className={[classes.price, classes.textPrimary]} item lg={2}>
              {data && data.configuration.currencySymbol}{' '}
              {order && order.paidAmount ? order.paidAmount.toFixed(2) : 0}
            </Grid>
          </Grid>
        </Box>
      </Box>
      {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
        <>
          {loading && (
            <Loader
              className="text-center"
              type="TailSpin"
              color={theme.palette.error.lightest}
              height={40}
              width={40}
              visible={loading}
            />
          )}
          <Box className={classes.btnBox}>
            <Button
              className={globalClasses.button}
              disabled={
                order.orderStatus !== 'CANCELLED' &&
                order.orderStatus !== 'PENDING'
              }
              onClick={() => {
                mutate({
                  variables: {
                    id: order._id,
                    status: 'ACCEPTED',
                    reason: ''
                  }
                })
              }}>
              {order && order.status === true ? t('Accepted') : t('Accept')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              className={globalClasses.button}
              disabled={order.orderStatus === 'CANCELLED'}
              onClick={() => {
                if (validateReason()) {
                  mutate({
                    variables: {
                      id: order._id,
                      status: 'CANCELLED',
                      reason: order.reason
                    }
                  })
                }
              }}>
              {order.status === false ? t('Cancelled') : t('Cancel')}
            </Button>
            <Input
              name="reason"
              id="input-reason"
              placeholder={t('PHReasonIfRejected')}
              type="text"
              disableUnderline
              value={(order && order.reason) || reason}
              onChange={event => {
                reasonSetter(event.target.value)
              }}
              className={[globalClasses.input, classes.inputLength]}
            />
          </Box>
          {reasonError ? null : null}
        </>
      )}
      <Box mt={2}>
        {success && (
          <Alert
            className={globalClasses.alertSuccess}
            variant="filled"
            severity="success">
            {success}
          </Alert>
        )}
        {error && (
          <Alert
            className={globalClasses.alertError}
            variant="filled"
            severity="error">
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  )
}
export default withTranslation()(Order)
