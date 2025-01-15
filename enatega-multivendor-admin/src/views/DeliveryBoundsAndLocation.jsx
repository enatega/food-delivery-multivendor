import React, { useCallback, useRef, useState } from 'react'
import { GoogleMap, Marker, Polygon } from '@react-google-maps/api'
import { useMutation, useQuery, gql } from '@apollo/client'
import Header from '../components/Headers/Header'
import { transformPolygon, transformPath } from '../utils/coordinates'
import {
  updateDeliveryBoundsAndLocation,
  getRestaurantProfile
} from '../apollo'
import useGlobalStyles from '../utils/globalStyles'
import useStyles from '../components/styles'
import CustomLoader from '../components/Loader/CustomLoader'
import {
  Container,
  Box,
  Button,
  Typography,
  Alert,
  useTheme
} from '@mui/material'
import { useTranslation, withTranslation } from 'react-i18next'

const UPDATE_DELIVERY_BOUNDS_AND_LOCATION = gql`
  ${updateDeliveryBoundsAndLocation}
`
const GET_RESTAURANT_PROFILE = gql`
  ${getRestaurantProfile}
`

function DeliveryBoundsAndLocation() {
  const { t } = useTranslation()
  const theme = useTheme()
  const restaurantId = localStorage.getItem('restaurantId')

  const [drawBoundsOrMarker, setDrawBoundsOrMarker] = useState('marker') // polygon
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [center, setCenter] = useState({ lat: 33.684422, lng: 73.047882 })
  const [marker, setMarker] = useState({ lat: 33.684422, lng: 73.047882 })
  const [path, setPath] = useState([
    {
      lat: 33.6981335731709,
      lng: 73.036895671875
    },
    {
      lat: 33.684779099960515,
      lng: 73.04650870898438
    },
    {
      lat: 33.693206228391965,
      lng: 73.06461898425293
    },
    {
      lat: 33.706880699271096,
      lng: 73.05410472491455
    }
  ])
  const polygonRef = useRef()
  const listenersRef = useRef([])
  const { error: errorQuery, loading: loadingQuery } = useQuery(
    GET_RESTAURANT_PROFILE,
    {
      variables: { id: restaurantId },
      fetchPolicy: 'network-only',
      onCompleted,
      onError
    }
  )
  const [mutate, { loading }] = useMutation(
    UPDATE_DELIVERY_BOUNDS_AND_LOCATION,
    {
      update: updateCache,
      onError,
      onCompleted
    }
  )
  // Call setPath with new edited path
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() }
        })
      setPath(nextPath)
    }
  }, [setPath])

  const onLoadPolygon = useCallback(
    polygon => {
      polygonRef.current = polygon
      const path = polygon.getPath()
      listenersRef.current.push(
        path.addListener('set_at', onEdit),
        path.addListener('insert_at', onEdit),
        path.addListener('remove_at', onEdit)
      )
    },
    [onEdit]
  )

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach(lis => lis.remove())
    polygonRef.current = null
  }, [])

  const onClick = e => {
    if (drawBoundsOrMarker === 'marker') {
      setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() })
    } else {
      setPath([...path, { lat: e.latLng.lat(), lng: e.latLng.lng() }])
    }
  }

  const removePolygon = () => {
    setPath([])
  }
  const removeMarker = () => {
    setMarker(null)
  }
  const toggleDrawingMode = mode => {
    setDrawBoundsOrMarker(mode)
  }

  function updateCache(cache, { data: { result } }) {
    const { restaurant } = cache.readQuery({
      query: GET_RESTAURANT_PROFILE,
      variables: { id: restaurantId }
    })
    cache.writeQuery({
      query: GET_RESTAURANT_PROFILE,
      variables: { id: restaurantId },
      data: {
        restaurant: {
          ...restaurant,
          ...result
        }
      }
    })
  }

  function onCompleted({ restaurant }) {
    if (restaurant) {
      setCenter({
        lat: +restaurant.location.coordinates[1],
        lng: +restaurant.location.coordinates[0]
      })
      setMarker({
        lat: +restaurant.location.coordinates[1],
        lng: +restaurant.location.coordinates[0]
      })
      setPath(
        restaurant.deliveryBounds
          ? transformPolygon(restaurant.deliveryBounds.coordinates[0])
          : path
      )
    }
  }

  function onError({ networkError, graphqlErrors }) {
    setErrorMessage(t('UpdatingLocationError'))
    setTimeout(() => setErrorMessage(''), 5000) // Clear error message after 5 seconds
  }

  const validate = () => {
    if (!marker) {
      setErrorMessage(t('LocationMarkerRequired'))
      setTimeout(() => setErrorMessage(''), 5000) // Clear success message after 5 seconds
      return false
    }
    if (path.length < 3) {
      setErrorMessage(t('DeliveryAreaRequired'))
      setTimeout(() => setErrorMessage(''), 5000) // Clear success message after 5 seconds
      return false
    }
    setSuccessMessage(t('LocationUpdatedSuccessfully'))
    setTimeout(() => setSuccessMessage(''), 5000) // Clear success message after 5 seconds
    setErrorMessage('')
    return true
  }

  const onDragEnd = mapMouseEvent => {
    setMarker({
      lat: mapMouseEvent.latLng.lat(),
      lng: mapMouseEvent.latLng.lng()
    })
  }
  const globalClasses = useGlobalStyles()
  const classes = useStyles()

  return (
    <>
      <Header />
      <Container className={globalClasses.flex} fluid>
        <Box container className={classes.container}>
          <Box className={classes.flexRow}>
            <Box item className={classes.heading2}>
              <Typography variant="h6" className={classes.textWhite}>
                {t('SetLocation')}
              </Typography>
            </Box>
          </Box>
          {loadingQuery && <CustomLoader />}
          {errorQuery && <p className="text-danger">{errorQuery.message}</p>}
          <Box className={classes.form}>
            <GoogleMap
              mapContainerStyle={{
                height: '500px',
                width: '100%',
                borderRadius: 30
              }}
              id="google-map"
              zoom={14}
              center={center}
              onClick={onClick}>
              {
                <Polygon
                  editable
                  draggable
                  onMouseUp={onEdit}
                  onDragEnd={onEdit}
                  onLoad={onLoadPolygon}
                  onUnmount={onUnmount}
                  onRightClick={removePolygon}
                  paths={path}
                />
              }
              {marker && (
                <Marker
                  position={marker}
                  draggable
                  onRightClick={removeMarker}
                  onDragEnd={onDragEnd}
                />
              )}
            </GoogleMap>
          </Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 30px'
            }}>
            <Button
              style={{
                color: theme.palette.warning.dark,
                backgroundColor: theme.palette.common.black
              }}
              className={globalClasses.button}
              onClick={() => toggleDrawingMode('polygon')}>
              {t('DrawDeliveryBounds')}
            </Button>
            <Button
              style={{
                color: theme.palette.warning.dark,
                backgroundColor: theme.palette.common.black
              }}
              className={globalClasses.button}
              onClick={() => toggleDrawingMode('marker')}>
              {t('SetRestaurantLocation')}
            </Button>
          </Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '0 30px'
            }}>
            <Button
              style={{
                color: theme.palette.common.black,
                backgroundColor: theme.palette.grey[300],
                marginRight: 20
              }}
              className={globalClasses.button}
              onClick={removePolygon}>
              {t('RemoveDeliveryBounds')}
            </Button>
            <Button
              style={{
                color: theme.palette.common.black,
                backgroundColor: theme.palette.grey[300]
              }}
              className={globalClasses.button}
              onClick={removeMarker}>
              {t('RemoveRestaurantLocation')}
            </Button>
          </Box>
          <Box mt={5} mb={3}>
            <Button
              disabled={loading}
              className={globalClasses.button}
              onClick={() => {
                const result = validate()
                if (result) {
                  const location = {
                    latitude: marker.lat,
                    longitude: marker.lng
                  }
                  const bounds = transformPath(path)
                  let variables = {
                    id: restaurantId,
                    location,
                    boundType: "Polygon",
                    address: "nil",
                    location, bounds
                  };
          
                  variables = {
                    ...variables,
                    circleBounds: {
                      radius: 0.0, // Convert kilometers to meters
                    },
                  };
                  mutate({variables})
                }
              }}>
              {t('Save')}
            </Button>
          </Box>
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
      </Container>
    </>
  )
}

export default withTranslation()(DeliveryBoundsAndLocation)
