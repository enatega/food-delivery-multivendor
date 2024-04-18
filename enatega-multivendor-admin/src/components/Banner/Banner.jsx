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
  useTheme
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const CREATE_CUISINE = gql`
  ${createCuisine}
`
const EDIT_CUISINE = gql`
  ${editCuisine}
`
const GET_CUISINES = gql`
  ${getCuisines}
`

function Banner(props) {
  const formRef = useRef()
  const theme = useTheme()
  const name = props.cuisine ? props.cuisine.name : ''
  const description = props.cuisine ? props.cuisine.description : ''
  const mutation = props.cuisine ? EDIT_CUISINE : CREATE_CUISINE
  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')
  const [nameError, setNameError] = useState(null)
  const [descriptionError, setDescriptionError] = useState(null)
  const [file, setFile] = useState('')
  const [data, setData] = useState({
    title: '',
    description: '',
    action: '',
    screen: '',
  })
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    action: '',
    screen: '',
  })

  const [parameter, setParameter] = useState([
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

  const onBlur = (field, state) => {
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

  const onDataChange = (name, value) => {
    console.log(name, value)
    setData((prev)=>({...prev, [name]: value}))
  }
  console.log('DATA => ', data)

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
            {props.cuisine ? t('EditBanner') : t('AddBanner')}
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
                  // onBlur={event =>
                  //   onBlur('title', event.target.value)
                  // }
                  disableUnderline
                  className={[
                    globalClasses.input,
                    errors.title ? globalClasses.inputError : globalClasses.inputSuccess
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
                  // onBlur={event => {
                  //   onBlur(
                  //     setDescriptionError,
                  //     'description',
                  //     event.target.value
                  //   )
                  // }}
                  onChange={(e)=>onDataChange('description', e.target.value)}
                  disableUnderline
                  className={[
                    globalClasses.input,
                    errors.description
                      ? globalClasses.inputError
                      : globalClasses.inputSuccess
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
                <Input
                  style={{ marginTop: -1 }}
                  placeholder={
                    t('Action') + ' (Action to perform i.e navigate)'
                  }
                  type="text"
                  defaultValue={data.action}
                  // onBlur={event =>
                  //   onBlur(setNameError, 'name', event.target.value)
                  // }
                  onChange={(e)=>onDataChange('action', e.target.value)}
                  disableUnderline
                  className={[
                    globalClasses.input,
                    errors.action
                      ? globalClasses.inputError
                      : globalClasses.inputSuccess
                  ]}
                />
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
                  // onBlur={event =>
                  //   onBlur(setNameError, 'name', event.target.value)
                  // }
                  onChange={(e)=>onDataChange('screen', e.target.value)}
                  disableUnderline
                  className={[
                    globalClasses.input,
                    errors.screen
                      ? globalClasses.inputError
                      : globalClasses.inputSuccess
                  ]}
                />
              </Grid>
            </Grid>
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
              htmlFor={props.food ? 'edit-food-image' : 'add-food-image'}
              className={classes.fileUpload}>
              {t('UploadAnImage')}
            </label>
            <input
              className={classes.file}
              id={props.food ? 'edit-food-image' : 'add-food-image'}
              type="file"
              accept="image/*"
              onChange={event => {
                selectImage(event, 'imgMenu')
              }}
            />
          </Box>

          {loading ? t('Loading') : null}
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={async e => {
                e.preventDefault()
                const inputData = {
                  title: data.title,
                  description: data.description,
                  action: data.action,
                  file: file,
                  parameters: JSON.stringify(parameter)
                }
                console.log('inputData => ', inputData)
                // if (onSubmitValidaiton() && !loading) {
                //   mutate({
                //     variables: {
                //       cuisineInput: {
                //         _id: props.cuisine ? props.cuisine._id : '',
                //         name: formRef.current['input-name'].value,
                //         description: formRef.current['input-description'].value
                //       }
                //     }
                //   })
                // }
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
