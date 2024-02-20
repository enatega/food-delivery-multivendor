import React, { useRef, useState } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import { validateFunc } from '../../constraints/constraints'
import { withTranslation } from 'react-i18next'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'
import { Box, Typography, Input, Button, Alert, Grid } from '@mui/material'
import { editTipping, getTipping, createTipping } from '../../apollo'

const GET_TIPPING = gql`
  ${getTipping}
`
const EDIT_TIPPING = gql`
  ${editTipping}
`

const CREATE_TIPPING = gql`
  ${createTipping}
`

function Tipping(props) {
  const { t } = props
  const formRef = useRef()
  // const mutation = props.coupon ? EDIT_COUPON : CREATE_COUPON
  const [tip1Error, setTip1Error] = useState(null)
  const [tip2Error, setTip2Error] = useState(null)
  const [tip3Error, setTip3Error] = useState(null)
  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')
  const onCompleted = data => {
    const message = t('TippingUpdated')
    successSetter(message)
    setTip1Error(null)
    setTip2Error(null)
    setTip3Error(null)
    mainErrorSetter('')
    clearFields()
    setTimeout(hideAlert, 3000)
  }
  const onError = error => {
    let message = ''
    try {
      message = error.graphQLErrors[0].message
    } catch (err) {
      message = t('ActionFailedTryAgain')
    }
    successSetter('')
    mainErrorSetter(message)
    setTimeout(hideAlert, 3000)
  }
  const onSubmitValidaiton = () => {
    const form = formRef.current
    const tip1 = form.tip1.value
    const tip2 = form.tip2.value
    const tip3 = form.tip3.value

    const tip1Errors = !validateFunc({ tip: tip1 }, 'tip')
    const tip2Errors = !validateFunc({ tip: tip2 }, 'tip')
    const tip3Errors = !validateFunc({ tip: tip3 }, 'tip')

    setTip1Error(tip1Errors)
    setTip2Error(tip2Errors)
    setTip3Error(tip3Errors)

    if (!(tip1Errors && tip2Errors && tip3Errors)) {
      mainErrorSetter(t('FieldsRequired'))
    }
    return tip1Errors && tip2Errors && tip3Errors
    // setTimeout(hideAlert, 3000)
  }
  const { data } = useQuery(GET_TIPPING, onError, onCompleted)
  const mutation = data && data.tips._id ? EDIT_TIPPING : CREATE_TIPPING

  const [mutate, { loading }] = useMutation(mutation, { onError, onCompleted })

  const clearFields = () => {
    formRef.current.reset()
  }

  const hideAlert = () => {
    mainErrorSetter('')
    successSetter('')
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            {props.coupon ? t('EditTipping') : t('AddTipping')}
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Tip1')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="tip1"
                  id="input-type-tip1"
                  placeholder={t('PHTip1')}
                  type="number"
                  defaultValue={
                    data && data.tips.tipVariations
                      ? data.tips.tipVariations[0]
                      : ''
                  }
                  disableUnderline
                  className={[
                    globalClasses.input,
                    tip1Error === false
                      ? globalClasses.inputError
                      : tip1Error === true
                      ? globalClasses.inputSuccess
                      : ''
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Tip2')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="tip2"
                  id="input-type-tip2"
                  placeholder={t('PHTip2')}
                  type="number"
                  defaultValue={
                    data && data.tips.tipVariations
                      ? data.tips.tipVariations[1]
                      : ''
                  }
                  disableUnderline
                  className={[
                    globalClasses.input,
                    tip2Error === false
                      ? globalClasses.inputError
                      : tip2Error === true
                      ? globalClasses.inputSuccess
                      : ''
                  ]}
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Tip3')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="tip3"
                  id="input-type-tip3"
                  placeholder={t('PHTip2')}
                  type="number"
                  defaultValue={
                    data && data.tips.tipVariations
                      ? data.tips.tipVariations[2]
                      : ''
                  }
                  disableUnderline
                  className={[
                    globalClasses.input,
                    tip3Error === false
                      ? globalClasses.inputError
                      : tip3Error === true
                      ? globalClasses.inputSuccess
                      : ''
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={async e => {
                e.preventDefault()
                if (onSubmitValidaiton()) {
                  const form = formRef.current
                  const tipArray = []
                  tipArray.push(Number(form.tip1.value))
                  tipArray.push(Number(form.tip2.value))
                  tipArray.push(Number(form.tip3.value))
                  mutate({
                    variables: {
                      tippingInput: {
                        _id: data.tips._id,
                        tipVariations: tipArray,
                        enabled: true
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

export default withTranslation()(Tipping)
