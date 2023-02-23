import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { sendNotificationUser } from '../apollo'
import Header from '../components/Headers/Header'
import CustomLoader from '../components/Loader/CustomLoader'
import { validateFunc } from '../constraints/constraints'
import {
  Container,
  Box,
  Typography,
  Input,
  Button,
  Alert,
  Grid
} from '@mui/material'
import useStyles from '../components/Tipping/styles'
import useGlobalStyles from '../utils/globalStyles'
import { ReactComponent as NotificationIcon } from '../assets/svg/svg/Notification.svg'

const NOTIFICATION_USER = gql`
  ${sendNotificationUser}
`
const Notifications = props => {
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationBody, setNotificationBody] = useState('')
  const [bodyError, setBodyError] = useState(null)
  const [titleError, setTitleError] = useState(null)
  const [mainError, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [mutate, { error, loading }] = useMutation(NOTIFICATION_USER)

  if (error) {
    console.log('error', JSON.stringify(error))
    setError('Failed.Please try again')
  }

  const onSubmitValidaiton = () => {
    const nTitleError = !validateFunc(
      { notificationTitle },
      'notificationTitle'
    )
    const nBodyError = !validateFunc({ notificationBody }, 'notificationBody')
    setTitleError(nTitleError)
    setBodyError(nBodyError)
    return nTitleError && nBodyError
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <>
      <Header />
      {/* Page content */}
      <Grid container>
        <Grid item>
          <Container className={globalClasses.flex} fluid>
            <Box container className={classes.container}>
              <Box className={classes.flexRow}>
                <Box item className={classes.heading}>
                  <Typography variant="h6" className={classes.text}>
                    Notifications
                  </Typography>
                </Box>
              </Box>

              <Box className={classes.form}>
                {loading ? (
                  <CustomLoader />
                ) : (
                  <form>
                    <Box className={globalClasses.flexRow}>
                      <Input
                        id="input-title"
                        placeholder="Title"
                        type="text"
                        value={notificationTitle}
                        onChange={event => {
                          setNotificationTitle(event.target.value)
                        }}
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
                        id="input-title"
                        placeholder="Body"
                        type="text"
                        value={notificationBody}
                        onChange={event => {
                          setNotificationBody(event.target.value)
                        }}
                        disableUnderline
                        className={[
                          globalClasses.input,
                          bodyError === false
                            ? globalClasses.inputError
                            : bodyError === true
                              ? globalClasses.inputSuccess
                              : ''
                        ]}
                      />
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
                                notificationBody: notificationBody,
                                notificationTitle: notificationTitle
                              }
                            })
                          }
                          setSuccess('')
                          setError('')
                        }}>
                        SAVE
                      </Button>
                    </Box>
                  </form>
                )}
                <Box mt={2}>
                  {success && (
                    <Alert variant="filled" severity="success">
                      {success}
                    </Alert>
                  )}
                  {mainError && (
                    <Alert variant="filled" severity="error">
                      {mainError}
                    </Alert>
                  )}
                </Box>
              </Box>
            </Box>
          </Container>
        </Grid>
        <Grid
          sx={{ display: { xs: 'none', lg: 'block' } }}
          item
          mt={5}
          ml={-3}
          order={{ xs: 1, lg: 2 }}>
          <NotificationIcon />
        </Grid>
      </Grid>
    </>
  )
}

export default withTranslation()(Notifications)
