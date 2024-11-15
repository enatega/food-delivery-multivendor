import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { withTranslation } from 'react-i18next'

import { Box, Typography, Input, Button, Alert } from '@mui/material'

import { editCategory, createCategory } from '../../apollo'
import useGlobalStyles from '../../utils/globalStyles'
import useStyles from '../styles'

const CREATE_CATEGORY = gql`
  ${createCategory}
`
const EDIT_CATEGORY = gql`
  ${editCategory}
`
function Category(props) {
  console.log("props",props);
  const mutation = props.category ? EDIT_CATEGORY : CREATE_CATEGORY
  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')
  const [category, setCategory] = useState(
    props.category ? props.category.title : ''
  )
  const restaurantId = localStorage.getItem('restaurantId')
  const onCompleted = data => {
    console.log("category",props.category)
    const message = props.category
      ? t('CategoryUpdatedSuccessfully')
      : t('CategoryAddedSuccessfully')
    successSetter(message)
    mainErrorSetter('')
    setCategory('')  
    setTimeout(hideAlert, 3000)
  }
  const onError = (error) => {
    let message = t('ActionFailedTryAgain'); 
    if (error.message.includes('Category already exists')) {
      message = error.message; 
    }
    successSetter('');
    mainErrorSetter(message);
    setTimeout(hideAlert, 3000);
  };
  const [mutate, { loading }] = useMutation(mutation, { onError, onCompleted })
  const hideAlert = () => {
    mainErrorSetter('')
    successSetter('')
  }
  const { t } = props
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box
          item
          className={props.category ? classes.headingBlack : classes.heading2}>
          <Typography variant="h6" className={classes.textWhite}>
            {props.category ? t('Edit Category') : t('Add Category')}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.form}>
        <form>
          <Box>
            <Typography className={classes.labelText}>{t('Name')}</Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-category"
              name="input-category"
              placeholder={t('PHCategory')}
              type="text"
              defaultValue={category}
              onChange={e => {
                setCategory(e.target.value)
              }}
              disableUnderline
              className={globalClasses.input}
            />
          </Box>
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={async e => {
                e.preventDefault()
                if (!loading) {
                  mutate({
                    variables: {
                      category: {
                        _id: props.category ? props.category._id : '',
                        title: category,
                        restaurant: restaurantId
                      }
                    }
                  })
                  // Close the modal after 3 seconds by calling the parent's onClose callback
                  setTimeout(() => {
                    // props.onClose(); // Close the modal
                  }, 4000)
                }
              }}>
              {t('Save')}
            </Button>
          </Box>
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
        </form>
      </Box>
    </Box>
  )
}

export default withTranslation()(Category)
