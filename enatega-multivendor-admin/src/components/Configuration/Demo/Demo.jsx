import React, { useRef } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { saveDemoConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Switch, Typography, Button } from '@mui/material'

const SAVE_DEMO_CONFIGURATION = gql`
  ${saveDemoConfiguration}
`

function DemoConfiguration(props) {
  const formRef = useRef()
  const [mutate, { loading }] = useMutation(SAVE_DEMO_CONFIGURATION)


  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Demo Toggles
          </Typography>
        </Box>
        
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
           
          </Box>
          <Box>
            <Typography className={classes.labelText}>
             Enable Rider Demo
          <Switch
            defaultChecked={props.enableRiderDemo}
            id="input-rider-demo"
            name="input-rider-demo"
            style={{ color: 'black' }}
          />
            </Typography>
          </Box>
          <Box>
            <Typography className={classes.labelText}>
            Enable Restaurant Demo
          <Switch
            defaultChecked={props.enableRestaurantDemo}
            id="input-restaurant-demo"
            name="input-restaurant-demo"
            style={{ color: 'black' }}
          />
            </Typography>
          </Box>
          <Box>
            <Typography className={classes.labelText}>
            Enable Admin Demo
          <Switch
            defaultChecked={props.enableAdminDemo}
            id="input-admin-demo"
            name="input-admin-demo"
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
                        enableRiderDemo :formRef.current['input-rider-demo'].checked,
                        enableRestaurantDemo: formRef.current['input-restaurant-demo'].checked,
                        enableAdminDemo: formRef.current['input-admin-demo'].checked,
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

export default withTranslation()(DemoConfiguration)
