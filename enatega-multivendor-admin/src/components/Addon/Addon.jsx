import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useQuery, useMutation, gql } from '@apollo/client'
import { getRestaurantDetail, createAddons, editAddon } from '../../apollo'
import OptionsComponent from '../Option/Option'
import { validateFunc } from '../../constraints/constraints'
import {
  Box,
  Typography,
  Input,
  Alert,
  Modal,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  useTheme
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'

const GET_OPTIONS = gql`
  ${getRestaurantDetail}
`
const CREATE_ADDONS = gql`
  ${createAddons}
`
const EDIT_ADDON = gql`
  ${editAddon}
`

function Addon(props) {
  const theme = useTheme()
  const { t } = props
  console.log(props)
  const restaurantId = localStorage.getItem('restaurantId')
  const onCompleted = ({ createAddons, editAddon }) => {
    if (createAddons) {
      addonSetter([
        {
          title: '',
          description: '',
          quantityMinimum: 0,
          quantityMaximum: 1,
          options: [],
          titleError: false,
          optionsError: false,
          quantityMinimumError: false,
          quantityMaximumError: false
        }
      ])
      successSetter(t('Saved'))
      mainErrorSetter('')
    }
    if (editAddon) {
      successSetter(t('Saved'))
      mainErrorSetter('')
    }
    setTimeout(onDismiss, 3000)
  }
  const onError = error => {
    mainErrorSetter(` ${t('errorWhileSaving')} ${error}`)
    successSetter('')
    setTimeout(onDismiss, 3000)
  }
  const [addon, addonSetter] = useState(
    props.addon
      ? [
          {
            ...props.addon,
            options: props.addon.options,
            titleError: false,
            optionsError: false,
            quantityMinimumError: false,
            quantityMaximumError: false
          }
        ]
      : [
          {
            title: '',
            description: '',
            quantityMinimum: 0,
            quantityMaximum: 1,
            options: [],
            titleError: false,
            optionsError: false,
            quantityMinimumError: false,
            quantityMaximumError: false
          }
        ]
  )
  const [modal, modalSetter] = useState(false)
  const [addonIndex, addonIndexSetter] = useState(0)
  const [success, successSetter] = useState('')
  const [mainError, mainErrorSetter] = useState('')

  const onChange = (event, index, state) => {
    const addons = addon
    addons[index][state] = event.target.value
    addonSetter([...addons])
  }
  const mutation = props.addon ? EDIT_ADDON : CREATE_ADDONS

  const { data, error: errorQuery, loading: loadingQuery } = useQuery(
    GET_OPTIONS,
    {
      variables: { id: restaurantId }
    }
  )
  const [mutate, { loading }] = useMutation(mutation, { onError, onCompleted })
  const onBlur = (index, state) => {
    const addons = addon
    if (state === 'title') {
      addons[index].titleError = !!validateFunc(
        { addonTitle: addons[index][state] },
        'addonTitle'
      )
    }
    if (state === 'quantityMinimum') {
      addons[index].quantityMinimumError = !!validateFunc(
        { addonQuantityMinimum: addons[index][state] },
        'addonQuantityMinimum'
      )
      addons[index].quantityMinimumError = addons[index].quantityMinimum < 0
      addons[index].quantityMinimumError =
        addons[index].options.length < addons[index][state]
    }
    if (state === 'quantityMaximum') {
      addons[index].quantityMaximumError = !!validateFunc(
        { addonQuantityMaximum: addons[index][state] },
        'addonQuantityMaximum'
      )
      addons[index].quantityMinimumError = addons[index].quantityMaximum <= 1
      addons[index].quantityMaximumError =
        addons[index].quantityMaximum < addons[index].quantityMinimum
    }
    if (state === 'options') {
      addons[index].optionsError = addons[index].options.length === 0
    }
    addonSetter([...addons])
  }
  const onSelectOption = (index, id) => {
    const addons = addon
    const option = addons[index].options.indexOf(id)
    if (option < 0) addons[index].options.push(id)
    else addons[index].options.splice(option, 1)
    addonSetter([...addons])
  }
  const updateOptions = ids => {
    const addons = addon
    addons[addonIndex].options = addons[addonIndex].options.concat(ids)
    addonSetter([...addons])
  }
  const onAdd = index => {
    const addons = addon
    if (index === addons.length - 1) {
      addons.push({
        title: '',
        description: '',
        quantityMinimum: 0,
        quantityMaximum: 1,
        options: []
      })
    } else {
      addons.splice(index + 1, 0, {
        title: '',
        description: '',
        quantityMinimum: 0,
        quantityMaximum: 1,
        options: []
      })
    }
    addonSetter([...addons])
  }
  const onRemove = index => {
    if (addon.length === 1 && index === 0) {
      return
    }
    const addons = addon
    addons.splice(index, 1)
    addonSetter([...addons])
  }
  const toggleModal = index => {
    modalSetter(prev => !prev)
    addonIndexSetter(index)
  }
  const validate = () => {
    const addons = addon
    addons.map((addon, index) => {
      onBlur(index, 'title')
      onBlur(index, 'description')
      onBlur(index, 'quantityMinimum')
      onBlur(index, 'quantityMaximum')
      onBlur(index, 'options')
      return addon
    })
    const error = addons.filter(
      addon =>
        addon.titleError ||
        addon.quantityMinimumError ||
        addon.quantityMaximumError ||
        addon.optionsError
    )
    if (!error.length) return true
    return false
  }

  const onDismiss = () => {
    mainErrorSetter('')
    successSetter('')
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  return (
    <Box container className={[classes.container, classes.width60]}>
      <Box className={classes.flexRow}>
        <Box
          item
          className={props.addon ? classes.headingBlack : classes.heading}>
          <Typography variant="h6" className={classes.text}>
            {t('Addons')}
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        {addon.map((addonItem, index) => (
          <Box key={index}>
            <Box>
              <label>{t('AddRemoveAddon')}</label>
              <RemoveIcon
                style={{
                  backgroundColor: theme.palette.common.black,
                  color: theme.palette.warning.dark,
                  borderRadius: '50%',
                  marginLeft: 12,
                  marginRight: 10
                }}
                onClick={() => {
                  onRemove(index)
                }}
              />
              <AddIcon
                style={{
                  backgroundColor: theme.palette.warning.dark,
                  color: theme.palette.common.black,
                  borderRadius: '50%'
                }}
                onClick={() => {
                  onAdd(index)
                }}
              />
            </Box>
            <Typography className={classes.labelText}>{t('Title')}</Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-title"
              placeholder={t('Title')}
              type="text"
              value={addonItem.title}
              onChange={event => {
                onChange(event, index, 'title')
              }}
              disableUnderline
              className={[
                globalClasses.input,
                addonItem.titleError === true ? globalClasses.inputError : ''
              ]}
            />
            <Typography className={classes.labelText}>
              {t('Description')}
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-description"
              placeholder={t('Description')}
              type="text"
              value={addonItem.description || ''}
              onChange={event => {
                onChange(event, index, 'description')
              }}
              disableUnderline
              className={[
                globalClasses.input,
                addonItem.descriptionError === true
                  ? globalClasses.inputError
                  : ''
              ]}
            />
            <Typography className={classes.labelText}>
              {t('MinQuantity')}
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-minimum"
              placeholder={t('MinimumQuantity')}
              type="number"
              value={addonItem.quantityMinimum}
              onChange={event => {
                onChange(event, index, 'quantityMinimum')
              }}
              disableUnderline
              className={[
                globalClasses.input,
                addonItem.quantityMinimumError === true
                  ? globalClasses.inputError
                  : ''
              ]}
            />
            <Typography className={classes.labelText}>
              {t('MaxQuantity')}
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-maximum"
              placeholder={t('MaximumQuantity')}
              type="number"
              value={addonItem.quantityMaximum}
              onChange={event => {
                onChange(event, index, 'quantityMaximum')
              }}
              disableUnderline
              className={[
                globalClasses.input,
                addonItem.quantityMaximumError === true
                  ? globalClasses.inputError
                  : ''
              ]}
            />
            <Box className={classes.container}>
              <Box className={classes.flexRow}>
                <Box item className={classes.heading}>
                  <Typography variant="p" className={classes.text}>
                    {t('Options')}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={1} mt={1}>
                {loadingQuery ? <span>Loading ...</span> : null}
                {errorQuery ? (
                  <span style={{ marginLeft: 20 }}>
                    Error! {errorQuery.message}
                  </span>
                ) : null}
                {data &&
                  data.restaurant.options.map(option => (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      key={option._id}
                      style={{ textAlign: 'left', paddingLeft: 20 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={option._id}
                            checked={addon[index].options.includes(option._id)}
                            onChange={() => onSelectOption(index, option._id)}
                          />
                        }
                        label={`${option.title} (Description: ${option.description})(Price: ${option.price})`}
                      />
                    </Grid>
                  ))}
              </Grid>
              <Button
                className={classes.button}
                onClick={() => toggleModal(index)}>
                {t('NewOption')}
              </Button>
            </Box>
          </Box>
        ))}
        <Box>
          <Button
            className={globalClasses.button}
            disabled={loading}
            onClick={() => {
              if (validate()) {
                props.addon
                  ? mutate({
                      variables: {
                        addonInput: {
                          addons: {
                            _id: props.addon._id,
                            title: addon[0].title,
                            description: addon[0].description,
                            options: addon[0].options,
                            quantityMinimum: +addon[0].quantityMinimum,
                            quantityMaximum: +addon[0].quantityMaximum
                          },
                          restaurant: restaurantId
                        }
                      }
                    })
                  : mutate({
                      variables: {
                        addonInput: {
                          addons: addon.map(
                            ({
                              title,
                              description,
                              options,
                              quantityMinimum,
                              quantityMaximum
                            }) => ({
                              title,
                              description,
                              options,
                              quantityMinimum: +quantityMinimum,
                              quantityMaximum: +quantityMaximum
                            })
                          ),
                          restaurant: restaurantId
                        }
                      }
                    })
                // Close the modal after 3 seconds by calling the parent's onClose callback
                setTimeout(() => {
                  props.onClose() // Close the modal
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
      </Box>
      <Modal
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        open={modal}
        onClose={() => {
          toggleModal()
        }}>
        <OptionsComponent updateOptions={updateOptions} />
      </Modal>
    </Box>
  )
}
export default withTranslation()(Addon)
