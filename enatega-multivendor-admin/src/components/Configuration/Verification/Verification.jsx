import React, { useRef } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { saveVerificationToggles } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Switch, Typography, Button } from '@mui/material'

const SAVE_VERIFICATION_CONFIGURATION = gql`
  ${saveVerificationToggles}
`

function VerificationConfiguration(props) {
  const formRef = useRef()
  

  const [mutate, { loading }] = useMutation(SAVE_VERIFICATION_CONFIGURATION)


  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Skip Verifications
          </Typography>
        </Box>
        
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
           
          </Box>
          <Box>
            <Typography className={classes.labelText}>
             Skip Mobile Verification
          <Switch
            defaultChecked={props.skipMobileVerification}
            id="input-mobileVerification"
            name="input-mobileVerification"
            style={{ color: 'black' }}
          />
            </Typography>
          </Box>
          <Box>
            <Typography className={classes.labelText}>
             Skip Email Verification
          <Switch
            defaultChecked={props.skipEmailVerification}
            id="input-emailVerification"
            name="input-emailVerification"
            style={{ color: 'black' }}
          />
            </Typography>
          </Box>
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={e => {
                e.preventDefault()
                if (!loading) {
                  mutate({
                    variables: {
                      configurationInput: {
                        skipEmailVerification:
                          formRef.current['input-emailVerification'].checked,
                        skipMobileVerification:
                          formRef.current['input-mobileVerification'].checked,
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

export default withTranslation()(VerificationConfiguration)
