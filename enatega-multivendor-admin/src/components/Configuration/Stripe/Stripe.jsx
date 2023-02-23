import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveStripeConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Typography, Input, Button } from '@mui/material'

const SAVE_STRIPE_CONFIGURATION = gql`
  ${saveStripeConfiguration}
`

function Stripe(props) {
  const formRef = useRef()
  const publishableKey = props.publishableKey || ''
  const secretKey = props.secretKey || ''
  const [publishError, publishErrorSetter] = useState(null)
  const [secretError, secretErrorSetter] = useState(null)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }
  const [mutate, { loading }] = useMutation(SAVE_STRIPE_CONFIGURATION)

  const validateInput = () => {
    let publishableKeyResult = true
    let secretKeyResult = true
    publishableKeyResult = !!formRef.current['input-publishablekey'].value
    secretKeyResult = !!formRef.current['input-secretkey'].value
    publishErrorSetter(publishableKeyResult)
    secretErrorSetter(secretKeyResult)
    return publishableKeyResult && secretKeyResult
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Stripe
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
            <Input
              id="input-publishablekey"
              name="input-publishablekey"
              placeholder="publish key e.g pk_test_lEaBbVGnTkzja2FyFiNlbqtw"
              type="password"
              defaultValue={publishableKey}
              onBlur={event => {
                onBlur(
                  publishErrorSetter,
                  'publishableKey',
                  event.target.value.trim()
                )
              }}
              disableUnderline
              className={[
                globalClasses.input,
                publishError === false
                  ? globalClasses.inputError
                  : publishError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          <Box className={globalClasses.flexRow}>
            <Input
              id="input-secretkey"
              placeholder="Secret e.g sk_test_rKNqVc2tSkdgZHNO3XnPCLn4"
              type="password"
              defaultValue={secretKey}
              onBlur={event =>
                onBlur(
                  secretErrorSetter,
                  'secretKey',
                  event.target.value.trim()
                )
              }
              disableUnderline
              className={[
                globalClasses.input,
                secretError === false
                  ? globalClasses.inputError
                  : secretError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={e => {
                e.preventDefault()
                if (validateInput() && !loading) {
                  mutate({
                    variables: {
                      configurationInput: {
                        publishableKey:
                          formRef.current['input-publishablekey'].value,
                        secretKey: formRef.current['input-secretkey'].value
                      }
                    }
                  })
                }
              }}>
              SAVE
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}
export default withTranslation()(Stripe)
