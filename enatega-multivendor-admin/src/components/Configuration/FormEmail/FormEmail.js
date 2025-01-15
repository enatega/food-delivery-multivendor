import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveFormEmailConfiguration } from '../../../apollo'
import { Box, Typography, Input, Button, CircularProgress } from '@mui/material'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'

const SAVE_EMAIL_CONFIGURATION = gql`
  ${saveFormEmailConfiguration}
`

function EmailConfiguration(props) {
  const formRef = useRef()
  const [email, setEmail] = useState(props.formEmail || '')
  const [emailError, setEmailError] = useState(null)
  const [mutate, { loading }] = useMutation(SAVE_EMAIL_CONFIGURATION)

  const validateInput = () => {
    const emailErrors = !validateFunc({ email: email }, 'email')

    setEmailError(emailErrors)
    return emailErrors
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Form Submission Email
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>
              Form Submission Email
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-email"
              name="input-email"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
              }}
              disableUnderline
              className={[
                globalClasses.input,
                emailError === false
                  ? globalClasses.inputError
                  : emailError === true
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
                if (validateInput()) {
                  mutate({
                    variables: {
                      configurationInput: {
                        formEmail: formRef.current['input-email'].value
                      }
                    }
                  })
                    .then(response => {
                      // Handle successful response
                      console.log(response)
                    })
                    .catch(error => {
                      // Handle GraphQL errors
                      console.error('GraphQL error:', error.message)
                    })
                }
              }}>
              {loading ? (
                <CircularProgress size={24} color="primary" />
              ) : (
                'SAVE'
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default withTranslation()(EmailConfiguration)
