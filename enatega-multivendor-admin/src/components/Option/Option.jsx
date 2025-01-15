import React, { useState } from 'react'
import {
  Box,
  Typography,
  Input,
  Alert,
  Button,
  Grid,
  useTheme
} from '@mui/material'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { createOptions, editOption } from '../../apollo'
import { validateFunc } from '../../constraints/constraints'
import useStyles from './styles'
import useGlobalStyles from '../../utils/globalStyles'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const CREATE_OPTIONS = gql`
  ${createOptions}
`

const EDIT_OPTION = gql`
  ${editOption}
`

function Option(props) {
  const theme = useTheme()
  const { t } = props
  const [option, optionSetter] = useState(
    props.option
      ? [{ ...props.option, titleError: false, priceError: false }]
      : [
          {
            title: '',
            description: '',
            price: 0,
            titleError: false,
            priceError: false
          }
        ]
  )
  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')
  const mutation = props.option ? EDIT_OPTION : CREATE_OPTIONS
  const onCompleted = ({ createOptions, editOption }) => {
    if (createOptions) {
      optionSetter([
        {
          title: '',
          description: '',
          price: 0,
          titleError: false,
          priceError: false
        }
      ])
      successSetter(t('Saved'))
      mainErrorSetter('')
      setTimeout(hideAlert, 3000)
    }
    if (editOption) {
      successSetter(t('Saved'))
      mainErrorSetter('')
    }
  }
  const onError = error => {
    mainErrorSetter(`${t('errorWhileSaving')} ${error}`)
    successSetter('')
    setTimeout(hideAlert, 3000)
  }
  const [mutate, { loading }] = useMutation(mutation, { onError, onCompleted })
  const hideAlert = () => {
    mainErrorSetter('')
    successSetter('')
  }
  const onBlur = (index, state) => {
    const options = option
    if (state === 'title') {
      options[index].titleError = !!validateFunc(
        { optionTitle: options[index][state] },
        'optionTitle'
      )
    }
    if (state === 'price') {
      options[index].priceError = !!validateFunc(
        { optionPrice: options[index][state] },
        'optionPrice'
      )
    }
    optionSetter([...options])
  }
  const onAdd = index => {
    const options = option
    if (index === options.length - 1) {
      options.push({ title: '', description: '', price: 0 })
    } else {
      options.splice(index + 1, 0, { title: '', description: '', price: 0 })
    }
    optionSetter([...options])
  }
  const onRemove = index => {
    if (option.length === 1 && index === 0) {
      return
    }
    const options = option
    options.splice(index, 1)
    optionSetter([...options])
  }
  const onChange = (event, index, state) => {
    const options = option
    options[index][state] = event.target.value
    optionSetter([...options])
  }
  const validate = () => {
    const options = option
    options.map((option, index) => {
      onBlur(index, 'title')
      onBlur(index, 'description')
      onBlur(index, 'price')
      return option
    })
    const error = options.filter(
      option => option.titleError || option.priceError
    )
    if (!error.length) return true
    return false
  }

  const restaurantId = localStorage.getItem('restaurantId')

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box
          item
          className={props.option ? classes.headingBlack : classes.heading}>
          <Typography variant="h6" className={classes.textWhite}>
            {props.option ? t('UpdateOption') : t('AddOption')}
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form>
          {option.map((optionItem, index) => (
            <Grid container key={optionItem._id}>
              <Grid item xs={12} sm={3}>
                <div>
                  <Typography className={classes.labelText}>
                    {t('Title')}
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    id={`input-title-${index}`}
                    placeholder={t('Title')}
                    type="text"
                    value={optionItem.title}
                    onChange={event => {
                      onChange(event, index, 'title')
                    }}
                    disableUnderline
                    className={[
                      globalClasses.input,
                      optionItem.titleError === true
                        ? globalClasses.inputError
                        : ''
                    ]}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={3}>
                <div>
                  <Typography className={classes.labelText}>
                    {t('Description')}
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    id={`input-description-${index}`}
                    placeholder={t('Description')}
                    type="text"
                    value={optionItem.description}
                    onChange={event => {
                      onChange(event, index, 'description')
                    }}
                    disableUnderline
                    className={[
                      globalClasses.input,
                      optionItem.descriptionError === true
                        ? globalClasses.inputError
                        : ''
                    ]}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={3}>
                <div>
                  <Typography className={classes.labelText}>
                    {t('Price')}
                  </Typography>
                  <Input
                    style={{ marginTop: -1 }}
                    id={`input-price-${index}`}
                    placeholder={t('Price')}
                    type="number"
                    value={optionItem.price}
                    onChange={event => {
                      onChange(event, index, 'price')
                    }}
                    disableUnderline
                    className={[
                      globalClasses.input,
                      optionItem.priceError === true
                        ? globalClasses.inputError
                        : ''
                    ]}
                  />
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={3}
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
                        onRemove(index)
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
                        onAdd(index)
                      }}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          ))}

          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={() => {
                if (validate()) {
                  const invalidPrice = option.some(opt => opt.price <= 0)
                  if (invalidPrice) {
                    mainErrorSetter('Price must be greater than 0')
                    successSetter('')
                    setTimeout(hideAlert, 3000)
                    return
                  }
                  props.option
                    ? mutate({
                        variables: {
                          optionInput: {
                            options: {
                              _id: props.option._id,
                              title: option[0].title,
                              description: option[0].description,
                              price: +option[0].price
                            },
                            restaurant: restaurantId
                          }
                        }
                      })
                    : mutate({
                        variables: {
                          optionInput: {
                            options: option.map(
                              ({ title, description, price }) => ({
                                title,
                                description,
                                price: +price
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
export default withTranslation()(Option)
