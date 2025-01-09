'use client';

// Core imports
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GoogleMap, Polygon } from '@react-google-maps/api';
import parse from 'autosuggest-highlight/parse';
import { throttle } from 'lodash';

// Interfaces
import {
  ILocationPoint,
  IPlaceSelectedOption,
  IZoneCustomGoogleMapsBoundComponentProps,
} from '@/lib/utils/interfaces';

// Utilities
import {
  calculatePolygonCentroid,
  calculateZoomBasedOnCoordinates,
  transformPath,
  transformPolygon,
} from '@/lib/utils/methods';

// Third-party libraries
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faMapMarker,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

// Prime React
import { AutoComplete, AutoCompleteSelectEvent } from 'primereact/autocomplete';
import { GoogleMapsContext } from '@/lib/context/global/google-maps.context';
import CustomShape from '../shapes';
import { DEFAULT_CENTER } from '@/lib/utils/constants';

// CSS
import '../index.css';

const autocompleteService: {
  current: google.maps.places.AutocompleteService | null;
} = { current: null };

const CustomGoogleMapsLocationZoneBounds: React.FC<
  IZoneCustomGoogleMapsBoundComponentProps
> = ({ _path, onSetZoneCoordinates, coordinates }) => {
  // Context
  const googleMapsContext = useContext(GoogleMapsContext);

  // States
  const [isMounted, setIsMounted] = useState(false);
  const [deliveryZoneType, setDeliveryZoneType] = useState('polygon');
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [path, setPath] = useState<ILocationPoint[]>([]);
  const [zoom, setZoom] = useState<number>(12);

  // Auto complete
  const [options, setOptions] = useState<IPlaceSelectedOption[]>([]);

  const [inputValue, setInputValue] = useState<string>('');
  const [selectedPlaceObject, setSelectedPlaceObject] =
    useState<IPlaceSelectedOption | null>(null);
  const [search, setSearch] = useState<string>('');

  // Ref
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService?.current?.getPlacePredictions(request, callback);
      }, 1500),
    []
  );

  // Handlers
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

            setCenter({
              lat: location?.lat() ?? 0,
              lng: location?.lng() ?? 0,
            });

            setInputValue(selectedOption.description);
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

  const onSetCenterAndPolygon = () => {
    setIsMounted(true);

    if (
      Array.isArray(_path) &&
      _path.length > 0 &&
      Array.isArray(_path[0]) &&
      _path[0].length > 0 &&
      _path[0][0].length > 0
    ) {
      setPath(transformPolygon(_path[0]));
      setCenter(calculatePolygonCentroid(_path[0]));
    }
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
    }
  }, [setPath, setCenter]);

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

  // Use Effects
  useEffect(() => {
    if (!isMounted) return;
    onSetZoneCoordinates(transformPath(path ?? []));
    const zoomVal = calculateZoomBasedOnCoordinates(coordinates);
    setZoom(zoomVal);
  }, [path]);

  useEffect(() => {
    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return;
    }

    if (search === '') {
      setOptions(selectedPlaceObject ? [selectedPlaceObject] : []);
      return;
    }

    fetch({ input: search }, (results: IPlaceSelectedOption[]) => {
      let newOptions: IPlaceSelectedOption[] = [];
      if (selectedPlaceObject) {
        newOptions = [selectedPlaceObject];
      }
      if (results) {
        newOptions = [...newOptions, ...results];
      }
      setOptions(newOptions);
    });

    return () => {
      autocompleteService.current = null;
    };
  }, [selectedPlaceObject, search, fetch]);

  useEffect(() => {
    onSetCenterAndPolygon();
  }, []);

  return (
    <div>
      <div className="relative overflow-hidden">
        <div className="h-[600px] w-full object-cover">
          <div className="absolute left-0 right-0 top-0 z-10">
            <div className={`flex w-full flex-col justify-center gap-y-1 p-2`}>
              <div className="relative">
                <AutoComplete
                  id="google-map"
                  disabled={false}
                  className={`p h-11 w-full border border-gray-300 px-2 text-sm focus:shadow-none focus:outline-none`}
                  value={inputValue}
                  completeMethod={(event) => {
                    setSearch(event.query);
                  }}
                  onChange={(e) => {
                    if (typeof e.value === 'string') handleInputChange(e.value);
                  }}
                  dropdownIcon={() => <div className="hidden"></div>}
                  onSelect={onHandlerAutoCompleteSelectionChange}
                  suggestions={options}
                  forceSelection={false}
                  dropdown={true}
                  multiple={false}
                  loadingIcon={null}
                  placeholder="Enter your full address"
                  style={{ width: '100%' }}
                  itemTemplate={(item) => {
                    const matches =
                      item.structured_formatting?.main_text_matched_substrings;
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

          {googleMapsContext?.isLoaded && (
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
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onClick={onClickGoogleMaps}
            >
              {path.length > 0 && (
                <Polygon
                  key={'google-map-polygon'}
                  editable
                  draggable
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
              )}
            </GoogleMap>
          )}
        </div>
      </div>

      <CustomShape
        selected={deliveryZoneType}
        hidenNames={['radius']}
        onClick={(val: string) => {
          switch (val) {
            case 'polygon':
              // setPath(DEFAULT_POLYGON);
              setPath([]);
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
    </div>
  );
};

export default CustomGoogleMapsLocationZoneBounds;
