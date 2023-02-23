/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { withTranslation } from 'react-i18next'
// core components
import Header from '../components/Headers/Header'
import { getRestaurantProfile, updateTimings } from '../apollo'
import TimeRangePicker from '@wojtekmaj/react-timerange-picker'
import CustomLoader from '../components/Loader/CustomLoader'
import useGlobalStyles from '../utils/globalStyles'
import { Container, Grid, Box, Button } from '@mui/material'
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

  const [mutate, { error, loading }] = useMutation(UPDATE_TIMINGS)

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
                Days
              </Grid>
              <Grid item md={7} lg={7}>
                Open Times
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
                  }
                })
              }}
              className={[globalClasses.button, globalClasses.mb]}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
            {error && <span>{error.message}</span>}
          </Box>
        )}
      </Container>
    </>
  )
}

export default withTranslation()(Timings)
const DayComponent = ({ day, value, onChangeTime }) => {
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
                  backgroundColor: '#90EA93',
                  color: '#000',
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
                  backgroundColor: '#000',
                  color: '#90EA93',
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
        {values.length === 0 && <span>Closed All day</span>}
      </Grid>
      <Grid item lg={3} md={3}>
        {values.length > 0 ? (
          <Button
            onClick={e => {
              e.preventDefault()
              onChange([])
            }}
            className={globalClasses.closeBtn}>
            Closed all Day
          </Button>
        ) : null}
        {values.length === 0 ? (
          <Button
            onClick={e => {
              e.preventDefault()
              onChange([['00:00', '23:59']])
            }}
            className={globalClasses.openBtn}>
            Open
          </Button>
        ) : null}
      </Grid>
    </Grid>
  )
}
