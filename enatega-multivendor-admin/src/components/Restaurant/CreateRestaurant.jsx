import React, { useState, useRef, useMemo } from 'react'
import { validateFunc } from '../../constraints/constraints'
import { withTranslation } from 'react-i18next'
import { useMutation, gql, useQuery } from '@apollo/client'
import { createRestaurant, getCuisines, restaurantByOwner } from '../../apollo'

import {
  Box,
  Alert,
  Typography,
  Button,
  Input,
  Switch,
  Grid,
  Checkbox,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  ListItemText
} from '@mui/material'

import ConfigurableValues from '../../config/constants'

import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { SHOP_TYPE } from '../../utils/enums'
import Dropdown from '../Dropdown'

const CREATE_RESTAURANT = gql`
  ${createRestaurant}
`
const RESTAURANT_BY_OWNER = gql`
  ${restaurantByOwner}
`
const CUISINES = gql`
  ${getCuisines}
`
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const CreateRestaurant = props => {
  const { CLOUDINARY_UPLOAD_URL, CLOUDINARY_FOOD } = ConfigurableValues()

  const { t } = props

  const owner = props.owner
  const [showPassword, setShowPassword] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [nameError, setNameError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [addressError, setAddressError] = useState(null)
  const [deliveryTimeError, setDeliveryTimeError] = useState(null)
  const [minimumOrderError, setMinimumOrderError] = useState(null)
  const [salesTaxError, setSalesTaxError] = useState(null)
  const [restaurantCuisines, setRestaurantCuisines] = React.useState([])

  // const [shopType, setShopType] = useState(SHOP_TYPE.RESTAURANT)
  const [errors, setErrors] = useState('')
  const [success, setSuccess] = useState('')
  const onCompleted = data => {
    console.log('on complete here')
    setNameError(null)
    setAddressError(null)
    setUsernameError(null)
    setPasswordError(null)
    setDeliveryTimeError(null)
    setMinimumOrderError(null)
    setErrors('')
    setSalesTaxError(null)
    setSuccess(t('RestaurantAdded'))
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
    if (graphQLErrors && graphQLErrors.length) {
      setErrors(graphQLErrors[0].message)
    }
    if (networkError) {
      setErrors(t('NetworkError'))
    }
    setTimeout(hideAlert, 5000)
  }
  const hideAlert = () => {
    setErrors('')
    setSuccess('')
  }

  const { data: cuisines } = useQuery(CUISINES)
  const cuisinesInDropdown = useMemo(
    () => cuisines?.cuisines?.map(item => item.name),
    [cuisines]
  )
  console.log('cuisines => ', cuisinesInDropdown)

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
      setErrors(t('FieldsRequired'))
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

  const handleCuisineChange = event => {
    const {
      target: { value }
    } = event
    setRestaurantCuisines(
      typeof value === 'string' ? value.split(',') : value
    )
  }
  
  const classes = useStyles()
  const globalClasses = useGlobalStyles()


  return (
    <Box container className={classes.container}>
      <Box style={{ alignItems: 'start' }} className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            {t('AddRestaurant')}
          </Typography>
        </Box>
        <Box ml={30} mt={1}>
          <label>{t('Available')}</label>
          <Switch defaultChecked style={{ color: 'black' }} />
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Username')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="username"
                  id="input-type-username"
                  placeholder={t('RestaurantUsername')}
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
                  onChange={event => {
                    event.target.value = event.target.value
                      .trim()
                      .replace(/\s/g, '')
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Password')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="password"
                  id="input-type-password"
                  placeholder={t('RestaurantPassword')}
                  type={showPassword ? 'text' : 'password'}
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
                  endAdornment={
                    <InputAdornment position="end">
                      <Checkbox
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        color="primary"
                        icon={<VisibilityOffIcon />}
                        checkedIcon={<VisibilityIcon />}
                      />
                    </InputAdornment>
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Name')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="name"
                  id="input-type-name"
                  placeholder={t('RestaurantName')}
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
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Address')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="address"
                  id="input-type-address"
                  placeholder={t('RestaurantAddress')}
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('DeliveryTime')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="deliveryTime"
                  id="input-type-delivery-time"
                  placeholder={t('DeliveryTime')}
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
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('MinOrder')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="minimumOrder"
                  id="input-type-minimum-order"
                  placeholder={t('MinOrder')}
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('SalesTax')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  name="salesTax"
                  id="input-type-sales-tax"
                  placeholder={t('SalesTax')}
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <Dropdown
                title={t('Shop Category')}
                values={Object.values(SHOP_TYPE)}
                defaultValue={SHOP_TYPE.RESTAURANT}
                id={'shop-type'}
                name={'shopType'}
                displayEmpty={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Cuisines')}
                </Typography>
                <Select
                  multiple
                  value={restaurantCuisines}
                  onChange={handleCuisineChange}
                  input={<OutlinedInput />}
                  renderValue={selected => selected.join(', ')}
                  MenuProps={MenuProps}
                  className={[globalClasses.input]}
                  style={{ margin: '0 0 0 -20px', padding: '0px 0px' }}>
                  {cuisinesInDropdown?.map(cuisine => (
                    <MenuItem
                      key={'restaurant-cuisine-' + cuisine}
                      value={cuisine}
                      style={{ color: '#000000', textTransform: 'capitalize' }}>
                      <Checkbox
                        checked={restaurantCuisines.indexOf(cuisine) > -1}
                      />
                      <ListItemText primary={cuisine} />
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
          </Grid>

          <Box
            mt={3}
            style={{ alignItems: 'center' }}
            className={globalClasses.flex}>
            <img
              className={classes.image}
              alt="..."
              src={
                imgUrl ||
                'https://enatega.com/wp-content/uploads/2023/11/man-suit-having-breakfast-kitchen-side-view.webp'
              }
            />
            <label htmlFor="file-upload" className={classes.fileUpload}>
              {t('UploadAnImage')}
            </label>
            <input
              className={classes.file}
              id="file-upload"
              type="file"
              accept="image/*"
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
                const isValid = onSubmitValidaiton()
                if (isValid) {
                  const imgUpload = await uploadImageToCloudinary()
                  const form = formRef.current
                  const name = form.name.value
                  const address = form.address.value
                  const deliveryTime = form.deliveryTime.value
                  const minimumOrder = form.minimumOrder.value
                  const username = form.username.value
                  const password = form.password.value
                  const shopType = form.shopType.value
                  mutate({
                    variables: {
                      owner,
                      restaurant: {
                        name,
                        address,
                        image:
                          imgUpload ||
                          'https://enatega.com/wp-content/uploads/2023/11/man-suit-having-breakfast-kitchen-side-view.webp',
                        deliveryTime: Number(deliveryTime),
                        minimumOrder: Number(minimumOrder),
                        username,
                        password,
                        shopType,
                        cuisines: restaurantCuisines
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
