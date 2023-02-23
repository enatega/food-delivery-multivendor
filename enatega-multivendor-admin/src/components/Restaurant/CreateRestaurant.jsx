import React, { useState, useRef } from 'react'
import { validateFunc } from '../../constraints/constraints'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { createRestaurant, restaurantByOwner } from '../../apollo'
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_FOOD } from '../../config/constants'
import { Box, Alert, Typography, Button, Input, Switch } from '@mui/material'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'

const CREATE_RESTAURANT = gql`
  ${createRestaurant}
`
const RESTAURANT_BY_OWNER = gql`
  ${restaurantByOwner}
`

const CreateRestaurant = props => {
  const owner = props.owner

  const [imgUrl, setImgUrl] = useState('')
  const [nameError, setNameError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [addressError, setAddressError] = useState(null)
  const [deliveryTimeError, setDeliveryTimeError] = useState(null)
  const [minimumOrderError, setMinimumOrderError] = useState(null)
  const [salesTaxError, setSalesTaxError] = useState(null)
  const [errors, setErrors] = useState('')
  const [success, setSuccess] = useState('')
  const onCompleted = data => {
    setNameError(null)
    setAddressError(null)
    setUsernameError(null)
    setPasswordError(null)
    setDeliveryTimeError(null)
    setMinimumOrderError(null)
    setErrors('')
    setSalesTaxError(null)
    setSuccess('Restaurant added')
    clearFormValues()
    setTimeout(hideAlert, 5000)
  }
  const onError = ({ graphQLErrors, networkError }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkErrors', networkError)
    setNameError(null)
    setAddressError(null)
    setUsernameError(null)
    setPasswordError(null)
    setDeliveryTimeError(null)
    setMinimumOrderError(null)
    setSalesTaxError(null)
    setSuccess('')
    if (graphQLErrors) {
      setErrors('Server error')
    }
    if (networkError) {
      setErrors('Network error')
    }
    setTimeout(hideAlert, 5000)
  }
  const hideAlert = () => {
    setErrors('')
    setSuccess('')
  }
  const [mutate, { loading }] = useMutation(CREATE_RESTAURANT, {
    onError,
    onCompleted,
    update
  })

  const formRef = useRef(null)

  const selectImage = (event, state) => {
    const result = filterImage(event)
    if (result) imageToBase64(result)
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
      setImgUrl(fileReader.result)
    }
    fileReader.readAsDataURL(imgUrl)
  }
  const uploadImageToCloudinary = async() => {
    if (imgUrl === '') return imgUrl

    const apiUrl = CLOUDINARY_UPLOAD_URL
    const data = {
      file: imgUrl,
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
      console.log(e)
    }
  }

  const onSubmitValidaiton = data => {
    const form = formRef.current
    const name = form.name.value
    const address = form.address.value
    const username = form.username.value
    const password = form.password.value
    // IMPORTANT!!!!
    const deliveryTime = form.deliveryTime.value
    const minimumOrder = form.minimumOrder.value
    const salesTax = +form.salesTax.value

    const nameError = !validateFunc({ name }, 'name')
    const addressError = !validateFunc({ address }, 'address')

    const deliveryTimeError = !validateFunc(
      { deliveryTime: deliveryTime },
      'deliveryTime'
    )
    const minimumOrderError = !validateFunc(
      { minimumOrder: minimumOrder },
      'minimumOrder'
    )
    const usernameError = !validateFunc({ name: username }, 'name')
    const passwordError = !validateFunc({ password }, 'password')
    const salesTaxError = !validateFunc({ salesTax }, 'salesTax')
    setNameError(nameError)
    setAddressError(addressError)
    setUsernameError(usernameError)
    setPasswordError(passwordError)
    setDeliveryTimeError(deliveryTimeError)
    setMinimumOrderError(minimumOrderError)
    setSalesTaxError(salesTaxError)
    if (
      !(
        nameError &&
        addressError &&
        usernameError &&
        passwordError &&
        deliveryTimeError &&
        minimumOrderError &&
        salesTaxError
      )
    ) {
      setErrors('Fields Required')
    }
    return (
      nameError &&
      addressError &&
      usernameError &&
      passwordError &&
      deliveryTimeError &&
      minimumOrderError &&
      salesTaxError
    )
  }
  function update(cache, { data: { createRestaurant } }) {
    const { restaurantByOwner } = cache.readQuery({
      query: RESTAURANT_BY_OWNER,
      variables: { id: owner }
    })
    cache.writeQuery({
      query: RESTAURANT_BY_OWNER,
      variables: { id: owner },
      data: {
        restaurantByOwner: {
          ...restaurantByOwner,
          restaurants: [...restaurantByOwner.restaurants, createRestaurant]
        }
      }
    })
  }
  const clearFormValues = () => {
    const form = formRef.current
    form.name.value = ''
    form.address.value = ''
    form.username.value = ''
    form.password.value = ''
    form.deliveryTime.value = 20
    form.minimumOrder.value = 0
    setImgUrl('')
  }
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  return (
    <Box container className={classes.container}>
      <Box style={{ alignItems: 'start' }} className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Add Restaurant
          </Typography>
        </Box>
        <Box ml={30} mt={1}>
          <label>Available</label>
          <Switch defaultChecked style={{ color: 'black' }} />
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
            <Input
              name="username"
              id="input-type-username"
              placeholder="Restaurant's username"
              type="text"
              defaultValue={''}
              disableUnderline
              className={[
                globalClasses.input,
                usernameError === false
                  ? globalClasses.inputError
                  : usernameError === true
                    ? globalClasses.inputSuccess
                    : ''
              ]}
            />
            <Input
              name="password"
              id="input-type-password"
              placeholder="Restaurant's password"
              type="text"
              defaultValue={''}
              disableUnderline
              className={[
                globalClasses.input,
                passwordError === false
                  ? globalClasses.inputError
                  : passwordError === true
                    ? globalClasses.inputSuccess
                    : ''
              ]}
            />
          </Box>
          <Box className={globalClasses.flexRow}>
            <Input
              name="name"
              id="input-type-name"
              placeholder="Restaurant's name"
              type="text"
              defaultValue={''}
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
            <Input
              name="address"
              id="input-type-address"
              placeholder="Restaurant's address"
              type="text"
              defaultValue={''}
              disableUnderline
              className={[
                globalClasses.input,
                addressError === false
                  ? globalClasses.inputError
                  : addressError === true
                    ? globalClasses.inputSuccess
                    : ''
              ]}
            />
          </Box>
          <Box className={globalClasses.flexRow}>
            <Input
              name="deliveryTime"
              id="input-type-delivery-time"
              placeholder="Delivery Time"
              type="number"
              disableUnderline
              className={[
                globalClasses.input,
                deliveryTimeError === false
                  ? globalClasses.inputError
                  : deliveryTimeError === true
                    ? globalClasses.inputSuccess
                    : ''
              ]}
            />
            <Input
              name="minimumOrder"
              id="input-type-minimum-order"
              placeholder="Minimum order"
              type="number"
              disableUnderline
              className={[
                globalClasses.input,
                minimumOrderError === false
                  ? globalClasses.inputError
                  : minimumOrderError === true
                    ? globalClasses.inputSuccess
                    : ''
              ]}
            />
          </Box>
          <Box className={globalClasses.flexRow}>
            <Input
              name="salesTax"
              id="input-type-sales-tax"
              placeholder="Sales tax"
              type="number"
              disableUnderline
              className={[
                globalClasses.input,
                salesTaxError === false
                  ? globalClasses.inputError
                  : salesTaxError === true
                    ? globalClasses.inputSuccess
                    : ''
              ]}
            />
          </Box>
          <Box
            mt={3}
            style={{ alignItems: 'center' }}
            className={globalClasses.flex}>
            <img
              className={classes.image}
              alt="..."
              src={
                imgUrl ||
                'https://www.lifcobooks.com/wp-content/themes/shopchild/images/placeholder_book.png'
              }
            />
            <label htmlFor="file-upload" className={classes.fileUpload}>
              Upload an image
            </label>
            <input
              className={classes.file}
              id="file-upload"
              type="file"
              onChange={event => {
                selectImage(event, 'image_url')
              }}
            />
          </Box>
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={async e => {
                e.preventDefault()
                if (onSubmitValidaiton()) {
                  const imgUpload = await uploadImageToCloudinary()
                  const form = formRef.current
                  const name = form.name.value
                  const address = form.address.value
                  const deliveryTime = form.deliveryTime.value
                  const minimumOrder = form.minimumOrder.value
                  const username = form.username.value
                  const password = form.password.value

                  mutate({
                    variables: {
                      owner,
                      restaurant: {
                        name,
                        address,
                        image:
                          imgUpload ||
                          'https://www.lifcobooks.com/wp-content/themes/shopchild/images/placeholder_book.png',
                        deliveryTime: Number(deliveryTime),
                        minimumOrder: Number(minimumOrder),
                        username,
                        password
                      }
                    }
                  })
                }
              }}>
              SAVE
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
          {errors && (
            <Alert
              className={globalClasses.alertError}
              variant="filled"
              severity="error">
              {errors}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  )
}
export default withTranslation()(CreateRestaurant)
