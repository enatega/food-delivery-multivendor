import React, { useState, useRef, useMemo, useEffect } from 'react'
import { validateFunc } from '../constraints/constraints'
import { withTranslation, useTranslation } from 'react-i18next'
import Header from '../components/Headers/Header'
import { useQuery, useMutation, gql } from '@apollo/client'
import { getRestaurantProfile, editRestaurant, getCuisines } from '../apollo'
import ConfigurableValues from '../config/constants'
import useStyles from '../components/Restaurant/styles'
import useGlobalStyles from '../utils/globalStyles'
import defaultLogo from '../assets/img/defaultLogo.png'
import {
  Box,
  Alert,
  Typography,
  Button,
  Input,
  Grid,
  Checkbox,
  Select,
  OutlinedInput,
  MenuItem,
  ListItemText
} from '@mui/material'
import { Container } from '@mui/system'
import CustomLoader from '../components/Loader/CustomLoader'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { SHOP_TYPE } from '../utils/enums'
import Dropdown from '../components/Dropdown'

const GET_PROFILE = gql`
  ${getRestaurantProfile}
`
const EDIT_RESTAURANT = gql`
  ${editRestaurant}
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

const VendorProfile = () => {
  const { CLOUDINARY_UPLOAD_URL, CLOUDINARY_FOOD } = ConfigurableValues()

  const { t } = useTranslation()

  const restaurantId = localStorage.getItem('restaurantId')
  const [showPassword, setShowPassword] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [nameError, setNameError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [addressError, setAddressError] = useState(null)
  const [prefixError, setPrefixError] = useState(null)
  const [deliveryTimeError, setDeliveryTimeError] = useState(null)
  const [minimumOrderError, setMinimumOrderError] = useState(null)
  const [salesTaxError, setSalesTaxError] = useState(null)
  const [errors, setErrors] = useState('')
  const [success, setSuccess] = useState('')
  const [restaurantCuisines, setRestaurantCuisines] = useState([])

  const onCompleted = data => {
    setNameError(null)
    setAddressError(null)
    setPrefixError(null)
    setUsernameError(null)
    setPasswordError(null)
    setDeliveryTimeError(null)
    setMinimumOrderError(null)
    setSalesTaxError(null)
    setErrors('')
    setSuccess(t('RestaurantUpdatedSuccessfully'))
    setTimeout(hideAlert, 5000)
  }

  const onError = ({ graphQLErrors, networkError }) => {
    setNameError(null)
    setAddressError(null)
    setPrefixError(null)
    setUsernameError(null)
    setPasswordError(null)
    setDeliveryTimeError(null)
    setMinimumOrderError(null)
    setSalesTaxError(null)
    setSuccess('')
    if (graphQLErrors) {
      setErrors(graphQLErrors[0].message)
    }
    if (networkError) {
      setErrors(networkError.result.errors[0].message)
    }
    setTimeout(hideAlert, 5000)
  }
  const hideAlert = () => {
    setErrors('')
    setSuccess('')
  }
  const { data, error: errorQuery, loading: loadingQuery } = useQuery(
    GET_PROFILE,
    {
      variables: { id: restaurantId }
    }
  )

  const restaurantImage = data?.restaurant?.image
  const restaurantLogo = data?.restaurant?.logo

  const [mutate, { loading }] = useMutation(EDIT_RESTAURANT, {
    onError,
    onCompleted,
    refetchQueries: [GET_PROFILE]
  })

  const formRef = useRef(null)

  const handleFileSelect = (event, type) => {
    let result
    result = filterImage(event)
    if (result) imageToBase64(result, type)
  }

  const filterImage = event => {
    let images = []
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i)
    }
    images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
    return images.length ? images[0] : undefined
  }

  const imageToBase64 = (imgUrl, type) => {
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      if (type === 'image' && fileReader.result) {
        setImgUrl(fileReader.result)
      } else if (type === 'logo' && fileReader.result) {
        setLogoUrl(fileReader.result)
      }
    }
    fileReader.readAsDataURL(imgUrl)
  }

  const uploadImageToCloudinary = async uploadType => {
    if (!uploadType) return

    const apiUrl = CLOUDINARY_UPLOAD_URL
    const data = {
      file: uploadType,
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
    const prefix = form.prefix.value
    const deliveryTime = form.deliveryTime.value
    const minimumOrder = form.minimumOrder.value
    const salesTax = +form.salesTax.value

    // Check if deliveryTime, minimumOrder, and salesTax are negative
    if (deliveryTime < 0) {
      setDeliveryTimeError(true)
      setErrors(t('DeliveryTime cannot be negative'))
      return false
    }
    if (minimumOrder < 0) {
      setMinimumOrderError(true)
      setErrors(t('Minimum Order cannot be negative'))
      return false
    }
    if (salesTax < 0) {
      setSalesTaxError(true)
      setErrors(t('Sales Tax cannot be negative'))
      return false
    }

    const nameErrors = !validateFunc({ name }, 'name')
    const addressErrors = !validateFunc({ address }, 'address')
    const prefixErrors = !validateFunc({ prefix: prefix }, 'prefix')
    const deliveryTimeErrors = !validateFunc(
      { deliveryTime: deliveryTime },
      'deliveryTime'
    )
    const minimumOrderErrors = !validateFunc(
      { minimumOrder: minimumOrder },
      'minimumOrder'
    )
    const usernameErrors = !validateFunc({ name: username }, 'name')
    const passwordErrors = !validateFunc({ password }, 'password')
    const salesTaxError = !validateFunc({ salesTax }, 'salesTax')
    setNameError(nameErrors)
    setAddressError(addressErrors)
    setPrefixError(prefixErrors)
    setUsernameError(usernameErrors)
    setPasswordError(passwordErrors)
    setDeliveryTimeError(deliveryTimeErrors)
    setMinimumOrderError(minimumOrderErrors)
    setSalesTaxError(salesTaxError)
    if (
      !(
        nameErrors &&
        addressErrors &&
        prefixErrors &&
        usernameErrors &&
        passwordErrors &&
        deliveryTimeErrors &&
        minimumOrderErrors &&
        salesTaxError
      )
    ) {
      setErrors(t('FieldsRequired'))
    }
    return (
      nameErrors &&
      addressErrors &&
      prefixErrors &&
      usernameErrors &&
      passwordErrors &&
      deliveryTimeErrors &&
      minimumOrderErrors &&
      salesTaxError
    )
  }

  const { data: cuisines } = useQuery(CUISINES)
  const cuisinesInDropdown = useMemo(
    () => cuisines?.cuisines?.map(item => item.name),
    [cuisines]
  )
  const handleCuisineChange = event => {
    const {
      target: { value }
    } = event
    setRestaurantCuisines(typeof value === 'string' ? value.split(',') : value)
  }

  useEffect(() => {
    setRestaurantCuisines(data?.restaurant?.cuisines)
  }, [data?.restaurant?.cuisines])

  useEffect(() => {
    if (restaurantImage) setImgUrl(restaurantImage)
    if (restaurantLogo) setLogoUrl(restaurantLogo)
  }, [restaurantImage, restaurantLogo])

  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  return (
    <>
      <Header />
      <Container className={globalClasses.flex} fluid>
        <Box container className={classes.container}>
          <Box style={{ alignItems: 'start' }} className={classes.flexRow}>
            <Box item className={classes.heading2}>
              <Typography variant="h6" className={classes.textWhite}>
                {t('UpdateProfile')}
              </Typography>
            </Box>
          </Box>
          {errorQuery && <span>{errorQuery.message}</span>}
          {loadingQuery ? (
            <CustomLoader />
          ) : (
            <Box className={classes.form}>
              <form ref={formRef}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography className={classes.labelText}>
                        {t('RestaurantUsername')}
                      </Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="username"
                        id="input-type-username"
                        placeholder={t('RestaurantUsername')}
                        type="text"
                        defaultValue={(data && data.restaurant.username) || ''}
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
                          if (event.target.value.includes(' ')) {
                            const usernameWithoutSpaces = event.target.value.replace(
                              / /g,
                              ''
                            )
                            event.target.value = usernameWithoutSpaces
                          }
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
                        placeholder={t('PHRestaurantPassword')}
                        type={showPassword ? 'text' : 'password'}
                        defaultValue={(data && data.restaurant.password) || ''}
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
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography className={classes.labelText}>
                        {t('Name')}
                      </Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="name"
                        id="input-type-name"
                        placeholder={t('PHRestaurantName')}
                        type="text"
                        defaultValue={(data && data.restaurant.name) || ''}
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
                        placeholder={t('PHRestaurantAddress')}
                        type="text"
                        defaultValue={(data && data.restaurant.address) || ''}
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
                </Grid>

                <Grid container spacing={2}>
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
                        defaultValue={data && data.restaurant.deliveryTime}
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
                        defaultValue={data && data.restaurant.minimumOrder}
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
                </Grid>
                <Grid container spacing={2}>
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
                        defaultValue={data && data.restaurant.tax}
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
                    <Box>
                      <Typography className={classes.labelText}>
                        {t('OrderPrefix')}
                      </Typography>
                      <Input
                        style={{ marginTop: -1 }}
                        name="prefix"
                        id="input-type-order_id_prefix"
                        placeholder={t('OrderPrefix')}
                        type="text"
                        defaultValue={data && data.restaurant.orderPrefix}
                        disableUnderline
                        className={[
                          globalClasses.input,
                          prefixError === false
                            ? globalClasses.inputError
                            : prefixError === true
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
                      defaultValue={
                        data.restaurant.shopType || SHOP_TYPE.RESTAURANT
                      }
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
                        onChange={handleCuisineChange}
                        input={<OutlinedInput />}
                        value={restaurantCuisines}
                        renderValue={selected => selected.join(', ')}
                        defaultValue={data?.restaurant?.cuisines}
                        MenuProps={MenuProps}
                        className={[globalClasses.input]}
                        style={{ margin: '0 0 0 -20px', padding: '0px 0px' }}>
                        {cuisinesInDropdown?.map(cuisine => (
                          <MenuItem
                            key={'restaurant-cuisine-' + cuisine}
                            value={cuisine}
                            style={{
                              color: '#000000',
                              textTransform: 'capitalize'
                            }}>
                            <Checkbox
                              checked={
                                restaurantCuisines?.indexOf(cuisine) > -1
                              }
                            />
                            <ListItemText primary={cuisine} />
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
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
                      <label
                        htmlFor="file-upload"
                        className={classes.fileUpload}>
                        {t('UploadAnImage')}
                      </label>
                      <input
                        className={classes.file}
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={event => {
                          handleFileSelect(event, 'image')
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box
                      mt={3}
                      style={{ alignItems: 'center' }}
                      className={globalClasses.flex}>
                      <img
                        className={classes.image}
                        alt="..."
                        src={logoUrl || defaultLogo}
                      />
                      <label
                        htmlFor="logo-upload"
                        className={classes.fileUpload}>
                        {t('UploadaLogo')}
                      </label>
                      <input
                        className={classes.file}
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={event => {
                          handleFileSelect(event, 'logo')
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Box>
                  <Button
                    className={globalClasses.button}
                    disabled={loading}
                    onClick={async e => {
                      e.preventDefault()
                      if (onSubmitValidaiton()) {
                        const imgUpload = await uploadImageToCloudinary(imgUrl)
                        const logoUpload = await uploadImageToCloudinary(
                          logoUrl
                        )
                        const form = formRef.current
                        const name = form.name.value
                        const address = form.address.value
                        const prefix = form.prefix.value // can we not update this?
                        const deliveryTime = form.deliveryTime.value
                        const minimumOrder = form.minimumOrder.value
                        const username = form.username.value
                        const password = form.password.value
                        const salesTax = form.salesTax.value
                        const shopType = form.shopType.value
                        mutate({
                          variables: {
                            restaurantInput: {
                              _id: restaurantId,
                              name,
                              address,
                              image:
                                imgUpload ||
                                data.restaurant.image ||
                                'https://enatega.com/wp-content/uploads/2023/11/man-suit-having-breakfast-kitchen-side-view.webp',
                              logo: logoUpload || defaultLogo,
                              orderPrefix: prefix,
                              deliveryTime: Number(deliveryTime),
                              minimumOrder: Number(minimumOrder),
                              username: username,
                              password: password,
                              salesTax: +salesTax,
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
          )}
        </Box>
      </Container>
    </>
  )
}
export default withTranslation()(VendorProfile)
