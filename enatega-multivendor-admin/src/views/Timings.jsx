/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { withTranslation, useTranslation } from 'react-i18next'
// core components
import Header from '../components/Headers/Header'
import { getRestaurantProfile, updateTimings } from '../apollo'
import TimeRangePicker from '@wojtekmaj/react-timerange-picker'
import CustomLoader from '../components/Loader/CustomLoader'
import useGlobalStyles from '../utils/globalStyles'
import { Container, Grid, Box, Button, Alert, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
const GET_RESTAURANT_PROFILE = gql`
  ${getRestaurantProfile}
`
const UPDATE_TIMINGS = gql`
  ${updateTimings}
`
const Timings = props => {
  const [value, onChange] = useState({})
  const restaurantId = localStorage.getItem('restaurantId')

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { t } = props
  const onChangeTime = (day, values) => {
    value[day] = values
    onChange(value)
  }
  const getTransformedTimings = e => {
    const openingTimes = Object.keys(value).map(v => {
      return {
        day: v,
        times: value[v].map(timings => ({
          startTime: timings[0].split(':'),
          endTime: timings[1].split(':')
        }))
      }
    })
    return openingTimes
  }
  const { data, error: errorQuery, loading: loadingQuery } = useQuery(
    GET_RESTAURANT_PROFILE,
    {
      variables: { id: restaurantId }
    }
  )
  const transformedTimes = {}

  const [mutate, { loading }] = useMutation(UPDATE_TIMINGS)

  data &&
    data.restaurant.openingTimes.forEach(value => {
      transformedTimes[value.day] = value.times.map(t => [
        `${t.startTime[0]}:${t.startTime[1]}`,
        `${t.endTime[0]}:${t.endTime[1]}`
      ])
    })
  const globalClasses = useGlobalStyles()

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className={globalClasses.flex} fluid>
        {errorQuery ? <span>Error! {errorQuery.message}</span> : null}
        {loadingQuery ? (
          <CustomLoader />
        ) : (
          <Box className={globalClasses.timing}>
            <Grid container className={globalClasses.timingHeader}>
              <Grid item md={2} lg={2}>
                {t('Days')}
              </Grid>
              <Grid item md={7} lg={7}>
                {t('OpenTimes')}
              </Grid>
            </Grid>
            <DayComponent
              day={t('MON')}
              value={transformedTimes.MON || [['00:00', '23:59']]}
              onChangeTime={onChangeTime}
            />
            <DayComponent
              day={t('TUE')}
              value={transformedTimes.TUE || [['00:00', '23:59']]}
              onChangeTime={onChangeTime}
            />
            <DayComponent
              day={t('WED')}
              value={transformedTimes.WED || [['00:00', '23:59']]}
              onChangeTime={onChangeTime}
            />
            <DayComponent
              day={t('THU')}
              value={transformedTimes.THU || [['00:00', '23:59']]}
              onChangeTime={onChangeTime}
            />
            <DayComponent
              day={t('FRI')}
              value={transformedTimes.FRI || [['00:00', '23:59']]}
              onChangeTime={onChangeTime}
            />
            <DayComponent
              day={t('SAT')}
              value={transformedTimes.SAT || [['00:00', '23:59']]}
              onChangeTime={onChangeTime}
            />
            <DayComponent
              day={t('SUN')}
              value={transformedTimes.SUN || [['00:00', '23:59']]}
              onChangeTime={onChangeTime}
            />
            <Button
              onClick={e => {
                e.preventDefault()
                const openingTimes = getTransformedTimings()
                mutate({
                  variables: {
                    id: restaurantId,
                    openingTimes
                  },
                  onCompleted: () => {
                    setSuccessMessage(t('TimeSavedSuccessfully'))
                    setTimeout(() => setSuccessMessage(''), 5000)
                    setErrorMessage('')
                  },
                  onError: error => {
                    setErrorMessage(t('ErrorWhileSavingTime'))
                    setTimeout(() => setErrorMessage(''), 5000)
                    setSuccessMessage('')
                  }
                })
              }}
              className={[globalClasses.button, globalClasses.mb]}>
              {loading ? t('SavingDots') : t('Save')}
            </Button>
            {successMessage && (
              <Alert
                className={globalClasses.alertSuccess}
                variant="filled"
                severity="success">
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert
                className={globalClasses.alertError}
                variant="filled"
                severity="error">
                {errorMessage}
              </Alert>
            )}
          </Box>
        )}
      </Container>
    </>
  )
}

export default withTranslation()(Timings)
const DayComponent = ({ day, value, onChangeTime }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  useEffect(() => {
    onChangeTime(day, values)
  })
  const globalClasses = useGlobalStyles()

  const [values, onChange] = useState(value)
  return (
    <Grid container className={globalClasses.dayComponent}>
      <Grid item lg={2} md={2} className={globalClasses.day}>
        {day}
      </Grid>
      <Grid item lg={7} md={7}>
        {values.map((value, index) => (
          <Box key={value + index}>
            <TimeRangePicker
              required
              rangeDivider="to"
              disableClock
              format="hh:mm a"
              clearIcon={null}
              style={{ backgroundColor: 'red', color: 'green' }}
              value={value}
              onChange={value => {
                values[index] = value
                onChange([...values])
              }}
            />
            {index === values.length - 1 && (
              <AddIcon
                style={{
                  backgroundColor: theme.palette.warning.dark,
                  color: theme.palette.common.black,
                  borderRadius: '50%',
                  marginBottom: -5,
                  marginLeft: 10
                }}
                onClick={e => {
                  e.preventDefault()
                  onChange([...values, ['00:00', '23:59']])
                }}
              />
            )}
            {values.length > 1 && (
              <RemoveIcon
                style={{
                  backgroundColor: theme.palette.common.black,
                  color: theme.palette.warning.dark,
                  borderRadius: '50%',
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: -5
                }}
                onClick={e => {
                  e.preventDefault()
                  values.splice(index, 1)
                  onChange([...values])
                }}
              />
            )}
          </Box>
        ))}
        {values.length === 0 && <span>{t('ClosedAllDay')}</span>}
      </Grid>
      <Grid item lg={3} md={3}>
        {values.length > 0 ? (
          <Button
            onClick={e => {
              e.preventDefault()
              onChange([])
            }}
            className={globalClasses.closeBtn}>
            {t('ClosedAllDay')}
          </Button>
        ) : null}
        {values.length === 0 ? (
          <Button
            onClick={e => {
              e.preventDefault()
              onChange([['00:00', '23:59']])
            }}
            className={globalClasses.openBtn}>
            {t('Open')}
          </Button>
        ) : null}
      </Grid>
    </Grid>
  )
}
