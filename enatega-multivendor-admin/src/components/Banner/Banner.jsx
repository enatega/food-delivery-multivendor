import React, { useRef, useState } from 'react'
import { useMutation, gql, useQuery } from '@apollo/client'
import { validateFunc } from '../../constraints/constraints'
import { withTranslation } from 'react-i18next'
import { createBanner, editBanner, getBannerActions, getBanners } from '../../apollo'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'
import {
  Box,
  Typography,
  Input,
  Button,
  Alert,
  Grid,
  useTheme,
  Select,
  MenuItem
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ConfigurableValues from '../../config/constants'

const CREATE_BANNER = gql`
  ${createBanner}
`
const EDIT_BANNER = gql`
  ${editBanner}
`
const GET_BANNERS = gql`
  ${getBanners}
`
const GET_BANNER_ACTIONS = gql`
  ${getBannerActions}
`

function Banner(props) {
  const formRef = useRef()
  const theme = useTheme()
  const { CLOUDINARY_UPLOAD_URL, CLOUDINARY_FOOD } = ConfigurableValues()

  const mutation = props.banner ? EDIT_BANNER : CREATE_BANNER
  const {data: bannerActions} = useQuery(GET_BANNER_ACTIONS)

  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')
  const [file, setFile] = useState(props.banner ? props.banner.file : '')
  const [fileLoading, setFileLoading] = useState(false)
  const [data, setData] = useState({
    title: props.banner ? props.banner.title : '',
    description: props.banner ? props.banner.description : '',
    action: props.banner ? props.banner.action : '',
    screen: props.banner ? props.banner.screen : '',
  })
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    action: '',
    screen: '',
  })

  const [parameter, setParameter] = useState(props.banner ? JSON.parse(props.banner.parameters) : [
    {
      key: '',
      value: ''
    }
  ])

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

  const selectImage = (event, state) => {
    const result = filterImage(event)
    if (result) imageToBase64(result)
  }

  const onParameterAdd = index => {
    const parameters = parameter
    if (index === parameters.length - 1) {
      parameters.push({ key: '', value: ''})
    } else {
      parameters.splice(index + 1, 0, { key: '', value: '' })
    }
    setParameter([...parameters])
  }
  const onParameterRemove = index => {
    if (parameter.length === 1 && index === 0) {
      return
    }
    const parameters = parameter
    parameters.splice(index, 1)
    setParameter([...parameters])
  }
  const onParameterChange = (event, index, state) => {
    const parameters = parameter
    parameters[index][state] = event.target.value
    setParameter([...parameters])
  }

  const onCompleted = data => {
    console.log('Data => ', data)
    const message = props.banner ? t('BannerUpdated') : t('BannerAdded')
    successSetter(message)
    mainErrorSetter('')
    if (!props.banner) clearFields()
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
    refetchQueries: [{ query: GET_BANNERS }],
    onError,
    onCompleted
  })

  const onSubmitValidaiton = () => {
    const titleError = validateFunc(
      { title: data.title },
      'title'
    )
    const descriptionError = validateFunc(
      { description: data.description },
      'description'
    )
    const actionError = validateFunc(
      { action: data.action },
      'action'
    )
    const screenError = validateFunc(
      { screen: data.screen },
      'screen'
    )
    setErrors({
      title: titleError,
      description: descriptionError,
      action: actionError,
      screen: screenError
    })

    return !titleError?.title && !descriptionError?.description && !actionError?.action && !screenError?.screen
  }

  const clearFields = () => {
    setErrors({
      title: '',
      description: '',
      action: '',
      screen: ''
    })
    setData({
      title: '',
      description: '',
      action: '',
      screen: ''
    })
    setParameter([
      {
        key: '',
        value: ''
      }
    ])
    setFile('')
  }

  const onDataChange = (name, value) => {
    setErrors((prev)=>({...prev, [name]: null}))
    setData((prev)=>({...prev, [name]: value}))
  }

  const uploadImageToCloudinary = async() => {
    if (file === '') return file
    if (props.banner && props.banner.file === file) return file

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
          className={props.banner ? classes.headingBlack : classes.heading}>
          <Typography
            variant="h6"
            className={props.banner ? classes.textWhite : classes.text}>
            {props.banner ? t('EditBanner') : t('AddBanner')}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={5}>
                <Typography className={classes.labelText}>
                  {t('Title')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  placeholder={t('Title')}
                  type="text"
                  defaultValue={data.title}
                  onChange={(e)=>onDataChange('title', e.target.value)}
                  disableUnderline
                  className={[
                    globalClasses.input,
                    errors.title ? globalClasses.inputError : "",
                    data.title && !errors.title && globalClasses.inputSuccess
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <Typography className={classes.labelText}>
                  {t('Description')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  placeholder={t('Description')}
                  type="text"
                  defaultValue={data.description}
                  onChange={(e)=>onDataChange('description', e.target.value)}
                  disableUnderline
                  className={[
                    globalClasses.input,
                    errors.description
                      ? globalClasses.inputError
                      : "",
                      data.description && !errors.description && globalClasses.inputSuccess
                  ]}
                />
              </Grid>
            </Grid>
          </Box>
          <Box className={globalClasses.flexRow}>
            
            <Grid container spacing={0}>
              <Grid item xs={12} sm={5}>
                <Typography className={classes.labelText}>
                  {t('Action')}
                </Typography>
                {bannerActions?.bannerActions?.length > 0  && (
                <Select
                  style={{ marginTop: -1 }}
                  defaultValue={data.action}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  value={data.action}
                  placeholder='Select action'
                  onChange={(e)=>onDataChange('action', e.target.value)}
                  className={[
                    globalClasses.input,
                    errors.action
                      ? globalClasses.inputError
                      : "",
                      data.action && !errors.action && globalClasses.inputSuccess
                  ]}>
                    {
                      bannerActions?.bannerActions?.map((item, index)=>(
                        <MenuItem
                          style={{ color: 'black', textTransform: 'capitalize' }}
                          value={item}
                          key={item+index}
                          >
                          {item}
                        </MenuItem>
                      ))}
                </Select>

                )}
              </Grid>
              <Grid item xs={12} sm={5}>
                <Typography className={classes.labelText}>
                  {t('Screen')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  placeholder={t('Screen')}
                  type="text"
                  defaultValue={data.screen}
                  onChange={(e)=>onDataChange('screen', e.target.value)}
                  disableUnderline
                  className={[
                    globalClasses.input,
                    errors.screen
                      ? globalClasses.inputError
                      : "",
                      data.screen && !errors.screen && globalClasses.inputSuccess
                  ]}
                />
              </Grid>
            </Grid>
          </Box>
          <Box>
          <Typography className={classes.parametersHeading}>Other Parameters (Optional)</Typography>

          </Box>
          {parameter.map((optionItem, index) => (
            <Grid container key={optionItem._id}>
              <Grid item xs={12} sm={5}>
                <div>
                  <Typography className={classes.labelText}>
                    {t('Key')}
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    id={`input-key-${index}`}
                    placeholder={t('Key')}
                    type="text"
                    value={optionItem.key}
                    onChange={event => {
                      onParameterChange(event, index, 'key')
                    }}
                    disableUnderline
                    className={[
                      globalClasses.input,
                      // optionItem.titleError === true
                      //   ? globalClasses.inputError
                      //   : ''
                    ]}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={5}>
                <div>
                  <Typography className={classes.labelText}>
                    {t('Value')}
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    id={`input-value-${index}`}
                    placeholder={t('Value')}
                    type="text"
                    value={optionItem.value}
                    onChange={event => {
                      onParameterChange(event, index, 'value')
                    }}
                    disableUnderline
                    className={[
                      globalClasses.input,
                      // optionItem.descriptionError === true
                      //   ? globalClasses.inputError
                      //   : ''
                    ]}
                  />
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={2}
                container
                justify="center"
                alignItems="center">
                {!props.option && (
                  <div className={classes.labelText}>
                    <RemoveIcon
                      style={{
                        backgroundColor: theme.palette.common.black,
                        color: theme.palette.warning.dark,
                        borderRadius: '50%',
                        marginTop: 12,
                        marginRight: 10
                      }}
                      onClick={() => {
                        onParameterRemove(index)
                      }}
                    />
                    <AddIcon
                      style={{
                        backgroundColor: theme.palette.warning.dark,
                        color: theme.palette.common.black,
                        borderRadius: '50%',
                        marginTop: 12
                      }}
                      onClick={() => {
                        onParameterAdd(index)
                      }}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          ))}
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
              htmlFor={props.banner ? 'edit-banner-image' : 'add-banner-image'}
              className={classes.fileUpload}>
              {t('UploadAnImage')}
            </label>
            <input
              className={classes.file}
              id={props.banner ? 'edit-banner-image' : 'add-banner-image'}
              type="file"
              accept="image/*"
              onChange={event => {
                selectImage(event, 'imgMenu')
              }}
            />
          </Box>

          {loading || fileLoading ? t('Loading') : null}
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading || fileLoading}
              onClick={async e => {
                e.preventDefault()
                console.log('onSubmitValidaiton => ', onSubmitValidaiton())
                if(onSubmitValidaiton()){
                  const inputData = {
                    title: data.title,
                    description: data.description,
                    action: data.action,
                    screen: data.screen,
                    file: await uploadImageToCloudinary(),
                    parameters: JSON.stringify(parameter)
                  }
                  console.log('onSubmitValidaiton inputData => ', inputData)
                  mutate({
                    variables: {
                      bannerInput: {
                        _id: props.banner ? props.banner._id : '',
                        ...inputData
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

export default withTranslation()(Banner)
