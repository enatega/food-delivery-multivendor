import React, { useState } from 'react'
import { Box, Typography, Input, Alert, Button } from '@mui/material'
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
      successSetter('Saved')
      mainErrorSetter('')
      setTimeout(hideAlert, 5000)
    }
    if (editOption) {
      successSetter('Saved')
      mainErrorSetter('')
    }
  }
  const onError = error => {
    mainErrorSetter(`An error occured while saving. Try again ${error}`)
    successSetter('')
    setTimeout(hideAlert, 5000)
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
            {props.option ? 'Update Option' : 'Add Option'}
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form>
          {option.map((optionItem, index) => (
            <Box key={optionItem._id} className={globalClasses.flexRow}>
              <Input
                id="input-title"
                placeholder="Title"
                type="text"
                value={optionItem.title}
                onChange={event => {
                  onChange(event, index, 'title')
                }}
                disableUnderline
                className={[
                  globalClasses.input,
                  optionItem.titleError === true ? globalClasses.inputError : ''
                ]}
              />
              <Input
                id="input-description"
                placeholder="Description"
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
              <Input
                id="input-price"
                placeholder="Price"
                type="number"
                value={optionItem.price}
                onChange={event => {
                  onChange(event, index, 'price')
                }}
                disableUnderline
                className={[
                  globalClasses.input,
                  optionItem.priceError === true ? globalClasses.inputError : ''
                ]}
              />
              {!props.option && (
                <>
                  <RemoveIcon
                    style={{
                      backgroundColor: '#000',
                      color: '#90EA93',
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
                      backgroundColor: '#90EA93',
                      color: '#000',
                      borderRadius: '50%',
                      marginTop: 12
                    }}
                    onClick={() => {
                      onAdd(index)
                    }}
                  />
                </>
              )}
            </Box>
          ))}

          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={() => {
                if (validate()) {
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
