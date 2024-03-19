import React, { useRef, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../constraints/constraints'
import { withTranslation } from 'react-i18next'
import { createCuisine, editCuisine, getCuisines } from '../../apollo'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'
import {
  Box,
  Typography,
  Input,
  Button,
  Alert,
  Grid
} from '@mui/material'

const CREATE_CUISINE = gql`
  ${createCuisine}
`
const EDIT_CUISINE = gql`
  ${editCuisine}
`
const GET_CUISINES = gql`
  ${getCuisines}
`

function Category(props) {
  const formRef = useRef()
  const name = props.cuisine ? props.cuisine.name : ''
  const description = props.cuisine ? props.cuisine.description : ''
  const mutation = props.cuisine ? EDIT_CUISINE : CREATE_CUISINE
  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')
  const [nameError, setNameError] = useState(null)
  const [descriptionError, setDescriptionError] = useState(null)
  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }
  const onCompleted = data => {
    console.log('Data => ', data)
    const message = props.cuisine ? t('CuisineUpdated') : t('CuisineAdded')
    successSetter(message)
    mainErrorSetter('')
    if (!props.cuisine) clearFields()
  }
  const onError = error => {
    console.log('Error => ', error)
    let message = ''
    try {
      message = error.graphQLErrors[0].message
    } catch (err) {
      message = t('ActionFailedTryAgain')
    }
    successSetter('')
    mainErrorSetter(message)
  }
  const [mutate, { loading }] = useMutation(mutation, {
    refetchQueries: [{ query: GET_CUISINES }],
    onError,
    onCompleted
  })

  const onSubmitValidaiton = () => {
    const nameError = !validateFunc(
      { name: formRef.current['input-name'].value },
      'name'
    )
    const descriptionError = !validateFunc(
      { description: formRef.current['input-description'].value },
      'description'
    )
    setNameError(nameError)
    setDescriptionError(descriptionError)
    return nameError && descriptionError
  }
  const clearFields = () => {
    formRef.current.reset()
    setNameError(null)
    setDescriptionError(null)
  }

  const { t } = props
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box
          item
          className={props.cuisine ? classes.headingBlack : classes.heading}>
          <Typography
            variant="h6"
            className={props.cuisine ? classes.textWhite : classes.text}>
            {props.cuisine ? t('EditCuisine') : t('AddCuisine')}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.labelText}>
                  {t('Name')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  id="input-name"
                  name="input-name"
                  placeholder={t('Name')}
                  type="text"
                  defaultValue={name}
                  onBlur={event =>
                    onBlur(setNameError, 'name', event.target.value)
                  }
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.labelText}>
                  {t('Description')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  id="input-description"
                  name="input-description"
                  placeholder={t('Description')}
                  type="text"
                  defaultValue={description}
                  onBlur={event => {
                    onBlur(
                      setDescriptionError,
                      'description',
                      event.target.value
                    )
                  }}
                  disableUnderline
                  className={[
                    globalClasses.input,
                    descriptionError === false
                      ? globalClasses.inputError
                      : descriptionError === true
                      ? globalClasses.inputSuccess
                      : ''
                  ]}
                />
              </Grid>
            </Grid>
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
                      cuisineInput: {
                        _id: props.cuisine ? props.cuisine._id : '',
                        name: formRef.current['input-name'].value,
                        description: formRef.current['input-description'].value
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

export default withTranslation()(Category)
