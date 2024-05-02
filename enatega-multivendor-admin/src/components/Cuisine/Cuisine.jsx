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
  Grid,
  Select,
  MenuItem
} from '@mui/material'
import ConfigurableValues from '../../config/constants'

const CREATE_CUISINE = gql`
  ${createCuisine}
`
const EDIT_CUISINE = gql`
  ${editCuisine}
`
const GET_CUISINES = gql`
  ${getCuisines}
`

function Cuisine(props) {
  const { CLOUDINARY_UPLOAD_URL, CLOUDINARY_FOOD } = ConfigurableValues()
  const formRef = useRef()
  const name = props.cuisine ? props.cuisine.name : ''
  const description = props.cuisine ? props.cuisine.description : ''
  const mutation = props.cuisine ? EDIT_CUISINE : CREATE_CUISINE
  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')
  const [nameError, setNameError] = useState(null)
  const [descriptionError, setDescriptionError] = useState(null)
  const [shopType, setShopType] = useState(props.cuisine ? props.cuisine.shopType : 'restaurant')
  const [file, setFile] = useState(props.cuisine ? props.cuisine.image : '')
  const [fileLoading, setFileLoading] = useState(false)

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

  const filterImage = event => {
    let images = []
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i)
    }
    images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
    return images.length ? images[0] : undefined
  }

  const imageToBase64 = imgUrl => {
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      setFile(fileReader.result)
    }
    fileReader.readAsDataURL(imgUrl)
  }

  const selectImage = (event) => {
    console.log('selectImage')
    const result = filterImage(event)
    if (result) imageToBase64(result)
  }

  const uploadImageToCloudinary = async() => {
    if (file === '') return file
    if (props.cuisine && props.cuisine.image === file) return file

    setFileLoading(true)
    const apiUrl = CLOUDINARY_UPLOAD_URL
    const data = {
      file: file,
      upload_preset: CLOUDINARY_FOOD
    }
    try {
      const result = await fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST'
      })
      const imageData = await result.json()
      return imageData.secure_url
    } catch (e) {
      console.log('Image upload error => ', e)
    } finally{
      setFileLoading(false)
    }
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
              <Grid item xs={12}>
                <Typography className={classes.labelText}>
                  {t('shopType')}
                </Typography>
                <Select
                  style={{ marginTop: -1 }}
                  // defaultValue={data.action}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  value={shopType}
                  placeholder='Select action'
                  onChange={(e)=>setShopType(e.target.value)}
                  className={[
                    globalClasses.input,
                    !shopType
                      ? globalClasses.inputError
                      : "",
                      shopType && globalClasses.inputSuccess
                  ]}
                  >
                    {
                      ['restaurant', 'grocery'].map((item, index)=>(
                        <MenuItem
                          style={{ color: 'black', textTransform: 'capitalize' }}
                          value={item}
                          key={item+index}
                          >
                          {item}
                        </MenuItem>
                      ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Box
                  mt={3}
                  style={{ alignItems: 'center' }}
                  className={globalClasses.flex}>
                  <img
                    className={classes.image}
                    alt="..."
                    src={
                      file ||
                      'https://enatega.com/wp-content/uploads/2023/11/man-suit-having-breakfast-kitchen-side-view.webp'
                    }
                  />
                  <label
                    htmlFor={props.cuisine ? 'edit-cuisine-image' : 'add-cuisine-image'}
                    className={classes.fileUpload}>
                    {t('UploadAnImage')}
                  </label>
                  <input
                    className={classes.file}
                    id={props.cuisine ? 'edit-cuisine-image' : 'add-cuisine-image'}
                    type="file"
                    accept="image/*"
                    onChange={event => {
                      selectImage(event)
                      // console.log('Event => ', event)
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {loading ? t('Loading') : null}
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading || fileLoading}
              onClick={async e => {
                e.preventDefault()
                if (onSubmitValidaiton() && !loading) {
                  mutate({
                    variables: {
                      cuisineInput: {
                        _id: props.cuisine ? props.cuisine._id : '',
                        name: formRef.current['input-name'].value,
                        description: formRef.current['input-description'].value,
                        shopType,
                        image: await uploadImageToCloudinary()
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

export default withTranslation()(Cuisine)
