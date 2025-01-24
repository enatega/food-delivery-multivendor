'use client';

// Core imports
import {
  ApolloCache,
  ApolloError,
  useMutation,
  useQuery,
} from '@apollo/client';
import { throttle } from 'lodash';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// API and GraphQL
import {
  GET_RESTAURANT_DELIVERY_ZONE_INFO,
  GET_RESTAURANT_PROFILE,
  UPDATE_DELIVERY_BOUNDS_AND_LOCATION,
} from '@/lib/api/graphql';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';

// Interfaces
import {
  ICustomGoogleMapsLocationBoundsComponentProps,
  ILocation,
  ILocationPoint,
  IPlaceSelectedOption,
  IRestaurantDeliveryZoneInfo,
  IRestaurantProfile,
  IRestaurantProfileResponse,
  IUpdateRestaurantDeliveryZoneVariables,
} from '@/lib/utils/interfaces';

// Utilities
import { transformPath, transformPolygon } from '@/lib/utils/methods';

// Third-party libraries
import {
  faChevronDown,
  faMapMarker,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Circle, GoogleMap, Marker, Polygon } from '@react-google-maps/api';
import parse from 'autosuggest-highlight/parse';
import { AutoComplete, AutoCompleteSelectEvent } from 'primereact/autocomplete';

// Components
import CustomButton from '../../button';
import CustomRadiusInputField from '../../custom-radius-input';
import CustomShape from '../shapes';
import useLocation from '@/lib/hooks/useLocation';
import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';
import calculateZoom from '@/lib/utils/methods/zoom-calculator';
import { useTranslations } from 'next-intl';

const autocompleteService: {
  current: google.maps.places.AutocompleteService | null;
} = { current: null };

const CustomGoogleMapsLocationBounds: React.FC<
  ICustomGoogleMapsLocationBoundsComponentProps
> = ({ onStepChange, hideControls, height }) => {
  // Hooks
  const t = useTranslations();

  // Context
  const { restaurantsContextData, onSetRestaurantsContextData } =
    useContext(RestaurantsContext);
  const { showToast } = useContext(ToastContext);

  // States
  const [zoom, setZoom] = useState(14);
  const [deliveryZoneType, setDeliveryZoneType] = useState('radius');
  const [center, setCenter] = useState({
    lat: -25.2744, // Central latitude of Australia
    lng: 133.7751, // Central longitude of Australia
  });

  const [marker, setMarker] = useState({
    lat: -25.2744, // Marker at the same central point
    lng: 133.7751, // Marker at the same central point
  });
  const [path, setPath] = useState<ILocationPoint[]>([]);
  const [distance, setDistance] = useState(1);
  // const [isLoading, setLoading] = useState(false);
  // Auto complete
  const [options, setOptions] = useState<IPlaceSelectedOption[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedPlaceObject, setSelectedPlaceObject] =
    useState<IPlaceSelectedOption | null>(null);
  const [search, setSearch] = useState<string>('');

  // Ref
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  //Hooks
  const { getCurrentLocation } = useLocation();

  // API
  const { loading: isFetchingRestaurantProfile } = useQuery(
    GET_RESTAURANT_PROFILE,
    {
      variables: { id: restaurantsContextData?.restaurant?._id?.code ?? '' },
      fetchPolicy: 'network-only',
      skip: !restaurantsContextData?.restaurant?._id?.code,
      onCompleted: onRestaurantProfileFetchCompleted,
      onError: onErrorFetchRestaurantProfile,
    }
  );
  const { loading: isFetchingRestaurantDeliveryZoneInfo } = useQuery(
    GET_RESTAURANT_DELIVERY_ZONE_INFO,
    {
      variables: { id: restaurantsContextData?.restaurant?._id?.code ?? '' },
      fetchPolicy: 'network-only',
      skip: !restaurantsContextData?.restaurant?._id?.code,
      onCompleted: onRestaurantZoneInfoFetchCompleted,
      onError: onErrorFetchRestaurantZoneInfo,
    }
  );
  const [updateRestaurantDeliveryZone, { loading: isSubmitting }] = useMutation(
    UPDATE_DELIVERY_BOUNDS_AND_LOCATION,
    {
      update: (cache, { data }) => {
        if (data) {
          updateCache(cache, { data } as IRestaurantProfileResponse);
        }
      },

      onCompleted: onRestaurantZoneUpdateCompleted,
      onError: onErrorLocationZoneUpdate,
    }
  );

  // Memos
  const radiusInMeter = useMemo(() => {
    return distance * 1000;
  }, [distance]);
  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService?.current?.getPlacePredictions(request, callback);
      }, 1500),
    []
  );

  // API Handlers
  function updateCache(
    cache: ApolloCache<unknown>,
    { data }: IRestaurantProfileResponse
  ) {
    const cachedData: IRestaurantProfileResponse | null = cache.readQuery({
      query: GET_RESTAURANT_PROFILE,
      variables: { id: restaurantsContextData?.restaurant?._id?.code ?? '' },
    });
    cache.writeQuery({
      query: GET_RESTAURANT_PROFILE,
      variables: { id: restaurantsContextData?.restaurant?._id?.code ?? '' },
      data: {
        restaurant: {
          ...cachedData?.data?.restaurant,
          ...data?.restaurant,
        },
      },
    });
  }
  // Profile Error
  function onErrorFetchRestaurantProfile({
    graphQLErrors,
    networkError,
  }: ApolloError) {
    showToast({
      type: 'error',
      title: t('Store Profile'),
      message:
        graphQLErrors[0].message ??
        networkError?.message ??
        t('Store Profile Fetch Failed'),
      duration: 2500,
    });
  }
  // Restaurant Profile Complete
  function onRestaurantProfileFetchCompleted({
    restaurant,
  }: {
    restaurant: IRestaurantProfile;
  }) {
    const isLocationZero =
      +restaurant?.location?.coordinates[0] === 0 &&
      +restaurant?.location?.coordinates[1] === 0;
    if (!restaurant || isLocationZero) return;

    setCenter({
      lat: +restaurant?.location?.coordinates[1],
      lng: +restaurant?.location?.coordinates[0],
    });
    setMarker({
      lat: +restaurant?.location?.coordinates[1],
      lng: +restaurant?.location?.coordinates[0],
    });
    setPath(
      restaurant?.deliveryBounds
        ? transformPolygon(restaurant?.deliveryBounds?.coordinates[0])
        : path
    );
  }
  // Restaurant Zone Info Error
  function onErrorFetchRestaurantZoneInfo({
    graphQLErrors,
    networkError,
  }: ApolloError) {
    showToast({
      type: 'error',
      title: t('Store Location & Zone'),
      message:
        graphQLErrors[0].message ??
        networkError?.message ??
        t('Store Location & Zone fetch failed'),
      duration: 2500,
    });
  }
  // Restaurant Zone Info Complete
  function onRestaurantZoneInfoFetchCompleted({
    getRestaurantDeliveryZoneInfo,
  }: {
    getRestaurantDeliveryZoneInfo: IRestaurantDeliveryZoneInfo;
  }) {
    const {
      address,
      deliveryBounds: polygonBounds,
      circleBounds,
      location,
      boundType,
    } = getRestaurantDeliveryZoneInfo;

    const coordinates = {
      lng: location.coordinates[0],
      lat: location.coordinates[1],
    };

    if (!hideControls) setInputValue(address);

    const isLocationZero =
      +location?.coordinates[0] === 0 && +location?.coordinates[1] === 0;

    if (!isLocationZero) {
      setCenter(coordinates);
      setMarker(coordinates);
    }

    if (boundType) setDeliveryZoneType(boundType);
    if (circleBounds?.radius) setDistance(circleBounds?.radius);

    setPath(
      polygonBounds?.coordinates[0].map((coordinate: number[]) => {
        return { lat: coordinate[1], lng: coordinate[0] };
      }) || []
    );
  }
  // Zone Update Error
  function onErrorLocationZoneUpdate({
    graphQLErrors,
    networkError,
  }: ApolloError) {
    showToast({
      type: 'error',
      title: t('Store Location & Zone'),
      message:
        graphQLErrors[0].message ??
        networkError?.message ??
        t('Store Location & Zone update failed'),
      duration: 2500,
    });
  }
  // Zone Update Complete
  function onRestaurantZoneUpdateCompleted({
    restaurant,
  }: {
    restaurant: IRestaurantProfile;
  }) {
    if (restaurant) {
      setCenter({
        lat: +restaurant?.location?.coordinates[1],
        lng: +restaurant?.location?.coordinates[0],
      });
      setMarker({
        lat: +restaurant?.location?.coordinates[1],
        lng: +restaurant?.location?.coordinates[0],
      });
      setPath(
        restaurant?.deliveryBounds
          ? transformPolygon(restaurant?.deliveryBounds?.coordinates[0])
          : path
      );
    }

    showToast({
      type: 'success',
      title: t('Zone Update'),
      message: `${t('Store Zone has been updated successfully')}.`,
    });

    if (onStepChange) onStepChange(3);
    // onSetRestaurantsContextData({} as IRestaurantsContextPropData);
    // onSetRestaurantFormVisible(false);
  }

  // Other Handlers
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };
  const onHandlerAutoCompleteSelectionChange = (
    event: AutoCompleteSelectEvent
  ) => {
    const selectedOption = event?.value as IPlaceSelectedOption;
    if (selectedOption) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { placeId: selectedOption.place_id },
        (results: google.maps.GeocoderResult[] | null) => {
          if (
            results &&
            results[0] &&
            results[0]?.geometry &&
            results[0]?.geometry.location
          ) {
            const location = results[0]?.geometry?.location;

            onSetRestaurantsContextData({
              ...restaurantsContextData,
              restaurant: {
                ...restaurantsContextData?.restaurant,
                _id: restaurantsContextData?.restaurant?._id ?? null,
                autoCompleteAddress: selectedOption.description,
              },
            });

            setCenter({
              lat: location?.lat() ?? 0,
              lng: location?.lng() ?? 0,
            });
            setMarker({
              lat: location?.lat() ?? 0,
              lng: location?.lng() ?? 0,
            });

            setInputValue(selectedOption?.description ?? '');
          }
        }
      );
      setSelectedPlaceObject(selectedOption);
    }
  };
  const onClickGoogleMaps = (e: google.maps.MapMouseEvent) => {
    setPath([
      ...path,
      { lat: e?.latLng?.lat() ?? 0, lng: e?.latLng?.lng() ?? 0 },
    ]);
  };
  const getPolygonPathFromCircle = (center: ILocationPoint, radius: number) => {
    try {
      const points = 4;
      const angleStep = (2 * Math.PI) / points;
      const path = [];

      for (let i = 0; i < points; i++) {
        const angle = i * angleStep;
        const lat = center.lat + (radius / 111300) * Math.cos(angle);
        const lng =
          center.lng +
          (radius / (111300 * Math.cos(center.lat * (Math.PI / 180)))) *
            Math.sin(angle);
        path.push({ lat, lng });
      }

      return path;
    } catch (error) {
      return [];
    }
  };
  function getPolygonPath(
    center: ILocationPoint,
    radius: number,
    numPoints: number = 4
  ) {
    try {
      const path = [];

      for (let i = 0; i < numPoints; i++) {
        const angle = (i * 2 * Math.PI) / numPoints;
        const lat = center.lat + (radius / 111320) * Math.cos(angle);
        const lng =
          center.lng +
          (radius / (111320 * Math.cos((center.lat * Math.PI) / 180))) *
            Math.sin(angle);
        path.push([lng, lat]);
      }

      path.push(path[0]);
      return [path];
    } catch (error) {
      return [];
    }
  }
  const handleDistanceChange = (val: number) => {
    const newDistance = val || 0;
    setDistance(newDistance);
  };
  const locationCallback = (error: string | null, data?: ILocation) => {
    if (error) {
      return;
    }

    setCenter({
      lat: data?.latitude ?? 0,
      lng: data?.longitude ?? 0,
    });
    setMarker({
      lat: data?.latitude ?? 0,
      lng: data?.longitude ?? 0,
    });

    setInputValue(data?.deliveryAddress ?? '');
    setSearch(data?.deliveryAddress ?? '');
  };
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef?.current
        .getPath()
        .getArray()
        .map((latLng) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });

      setPath(nextPath);

      // Calculate new center based on polygon vertices
      const newCenter = nextPath.reduce(
        (acc, point) => ({
          lat: acc.lat + point.lat / nextPath.length,
          lng: acc.lng + point.lng / nextPath.length,
        }),
        { lat: 0, lng: 0 }
      );

      setCenter(newCenter);
      setMarker(newCenter);
    }
  }, [setPath, setCenter, setMarker]);
  const onLoadPolygon = useCallback(
    (polygon: google.maps.Polygon) => {
      if (!polygon) return;

      polygonRef.current = polygon;
      const path = polygon?.getPath();
      listenersRef?.current?.push(
        path?.addListener('set_at', onEdit),
        path?.addListener('insert_at', onEdit),
        path?.addListener('remove_at', onEdit)
      );
    },
    [onEdit]
  );
  const onUnmount = useCallback(() => {
    listenersRef?.current?.forEach((lis) => lis?.remove());
    polygonRef.current = null;
  }, []);
  const removeMarker = () => {
    setMarker({ lat: 0, lng: 0 });
  };
  const onDragEnd = (mapMouseEvent: google.maps.MapMouseEvent) => {
    const newLatLng = {
      lat: mapMouseEvent?.latLng?.lat() ?? 0,
      lng: mapMouseEvent?.latLng?.lng() ?? 0,
    };

    setMarker(newLatLng);
    setCenter(newLatLng);

    // Update polygon when marker is dragged
    if (deliveryZoneType === 'polygon') {
      const newPath = getPolygonPathFromCircle(newLatLng, radiusInMeter ?? 1);
      setPath(newPath);
    }
  };
  // Submit Handler
  const onLocationSubmitHandler = () => {
    try {
      if (!restaurantsContextData?.restaurant?._id?.code) {
        showToast({
          type: 'error',
          title: t('Location & Zone'),
          message: t('No restaurnat is selected'),
        });

        return;
      }

      const location = {
        latitude: marker?.lat ?? 0,
        longitude: marker?.lng ?? 0,
      };

      let bounds = transformPath(path);
      if (deliveryZoneType === 'radius') {
        bounds = getPolygonPath(center, radiusInMeter);
      }

      let variables: IUpdateRestaurantDeliveryZoneVariables = {
        id: restaurantsContextData?.restaurant?._id?.code ?? '',
        location,
        boundType: deliveryZoneType,
        address: restaurantsContextData?.restaurant?.autoCompleteAddress,
        bounds: [[[]]],
      };

      variables = {
        ...variables,
        bounds,
        circleBounds: {
          radius: distance, // Convert kilometers to meters
        },
      };

      updateRestaurantDeliveryZone({ variables: variables });
    } catch (error) {
      showToast({
        type: 'error',
        title: t('Location & Zone'),
        message: t('Location & Zone update failed'),
      });
    }
  };

  // Use Effects
  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (search === '') {
      setOptions(selectedPlaceObject ? [selectedPlaceObject] : []);
      return undefined;
    }

    fetch({ input: search }, (results: IPlaceSelectedOption[]) => {
      if (active) {
        let newOptions: IPlaceSelectedOption[] = [];
        if (selectedPlaceObject) {
          newOptions = [selectedPlaceObject];
        }
        if (results) {
          newOptions = [...newOptions, ...results];
        }
        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [selectedPlaceObject, search, fetch]);

  useEffect(() => {
    if (!hideControls) getCurrentLocation(locationCallback);
  }, []);

  useEffect(() => {
    const zoomVal = calculateZoom(distance);
    setZoom(zoomVal);
  }, [distance, zoom]);

  return (
    <div>
      <div className="relative overflow-hidden">
        <div
          style={{ height: height }}
          className="h-[600px] w-full object-cover"
        >
          {!hideControls && (
            <div className="absolute left-0 right-0 top-0 z-10">
              <div
                className={`flex w-full flex-col justify-center gap-y-1 p-2`}
              >
                <div className="relative">
                  <AutoComplete
                    id="google-map"
                    disabled={
                      isFetchingRestaurantDeliveryZoneInfo ||
                      isFetchingRestaurantProfile
                    }
                    className={`p h-11 w-full border border-gray-300 px-2 text-sm focus:shadow-none focus:outline-none`}
                    value={inputValue}
                    dropdownIcon={
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        style={{ fontSize: '1rem', color: 'gray' }}
                      />
                    }
                    completeMethod={(event) => {
                      setSearch(event.query);
                    }}
                    onChange={(e) => {
                      if (typeof e.value === 'string')
                        handleInputChange(e.value);
                    }}
                    onSelect={onHandlerAutoCompleteSelectionChange}
                    suggestions={options}
                    forceSelection={false}
                    dropdown={true}
                    multiple={false}
                    loadingIcon={null}
                    placeholder={t('Search Address')}
                    style={{ width: '100%' }}
                    itemTemplate={(item) => {
                      const matches =
                        item.structured_formatting
                          ?.main_text_matched_substrings;
                      let parts = null;
                      if (matches) {
                        parts = parse(
                          item.structured_formatting.main_text,
                          matches.map(
                            (match: { offset: number; length: number }) => [
                              match.offset,
                              match.offset + match.length,
                            ]
                          )
                        );
                      }

                      return (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faMapMarker}
                              className="mr-2"
                            />
                            {parts &&
                              parts.map((part, index) => (
                                <span
                                  key={index}
                                  style={{
                                    fontWeight: part.highlight ? 700 : 400,
                                    color: 'black',
                                    marginRight: '2px',
                                  }}
                                >
                                  {part.text}
                                </span>
                              ))}
                          </div>
                          <small>
                            {item.structured_formatting?.secondary_text}
                          </small>
                        </div>
                      );
                    }}
                  />
                  <div className="absolute right-8 top-0 flex h-full items-center pr-2">
                    {inputValue && (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="mr-2 cursor-pointer text-gray-400"
                        onClick={() => {
                          setInputValue('');
                          setSearch('');
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <GoogleMap
            mapContainerStyle={{
              height: '100%',
              width: '100%',
              borderRadius: 10,
              marginBottom: '20px',
            }}
            id="google-map"
            zoom={zoom}
            center={center}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: !hideControls,
              fullscreenControl: !hideControls,
              draggable: !hideControls,
            }}
            onClick={
              deliveryZoneType === 'point' ? onClickGoogleMaps : undefined
            }
          >
            <Polygon
              editable={!hideControls}
              draggable={!hideControls}
              visible={deliveryZoneType === 'polygon'}
              paths={path}
              options={{
                strokeColor: 'black',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#000000',
                fillOpacity: 0.35,
              }}
              onMouseUp={onEdit}
              onDragEnd={onEdit}
              onLoad={onLoadPolygon}
              onUnmount={onUnmount}
            />

            <Circle
              center={center}
              radius={radiusInMeter}
              visible={
                deliveryZoneType === 'radius' || deliveryZoneType === 'point'
              }
              options={{
                fillColor: 'black',
                fillOpacity: 0.2,
                strokeColor: 'black',
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />

            {marker && (
              <Marker
                position={marker}
                draggable={!hideControls}
                onRightClick={removeMarker}
                onDragEnd={onDragEnd}
              />
            )}
          </GoogleMap>
        </div>
      </div>

      {!hideControls && (
        <>
          {/* Radius Input */}
          {deliveryZoneType === 'radius' && (
            <div className="mt-2 w-[8rem]">
              <CustomRadiusInputField
                type="number"
                name="radius"
                placeholder={t('Radius')}
                maxLength={35}
                min={0}
                max={100}
                value={distance}
                onChange={handleDistanceChange}
                showLabel={true}
                loading={false}
              />
            </div>
          )}

          {/* Shapes */}
          <CustomShape
            selected={deliveryZoneType}
            onClick={(val: string) => {
              switch (val) {
                case 'polygon':
                  setPath(getPolygonPathFromCircle(center, radiusInMeter));
                  break;
                case 'point':
                  setPath([]);
                  break;
                default:
                  break;
              }

              setDeliveryZoneType(val);
            }}
          />

          <div className="mt-4 flex justify-end">
            <CustomButton
              className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
              label={t('Save')}
              type="button"
              loading={isSubmitting}
              onClick={onLocationSubmitHandler}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CustomGoogleMapsLocationBounds;
