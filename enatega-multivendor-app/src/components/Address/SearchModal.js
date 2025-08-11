import React, { useContext, useEffect, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  StyleSheet
} from 'react-native';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useSharedValue,
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import ThemeContext from '../../ui/ThemeContext/ThemeContext';
import { alignment } from '../../utils/alignment';
import { scale } from '../../utils/scaling';
import { theme } from '../../utils/themeColors';
import TextDefault from '../Text/TextDefault/TextDefault';
import useEnvVars from '../../../environment';

const { height } = Dimensions.get('screen');

const getAutocompleteStyles = (currentTheme) => StyleSheet.create({
  listView: {
    marginLeft: -scale(50),
  },
  description: {
    fontWeight: 'bold',
    color: currentTheme.newFontcolor,
  },
  predefinedPlacesDescription: {
    color: '#1faadb'
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: currentTheme.customBorder,
    borderRadius: scale(6),
    backgroundColor: currentTheme.themeBackground
  },
  textInput: {
    ...alignment.MTxSmall,
    color: currentTheme.newFontcolor,
    backgroundColor: currentTheme.themeBackground,
    height: scale(38)
  },
  row: {
    backgroundColor: currentTheme.cardBackground,
    paddingVertical: scale(10),
  },
  poweredContainer: {
    backgroundColor: 'transparent'
  },
});

const useLocationManager = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const requestAndSetLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        console.warn('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        setLocationError('Could not get current location: ' + error.message);
        console.error('Could not get current location', error);
      }
    };

    requestAndSetLocation();
  }, []);

  return { userLocation, locationError };
};

const useKeyboardAnimation = () => {
  const animation = useSharedValue(0);

  const initialBorderRadius = scale(30);
  const marginTopHidden = height * 0.4;
  const marginTopShown = height * 0.06;

  const animateModal = (showKeyboard = false) => {
    animation.value = withTiming(
      showKeyboard ? 1 : 0,
      { duration: 300, easing: Easing.inOut(Easing.ease) }
    );
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    'worklet';
    const interpolatedMarginTop = interpolate(
      animation.value,
      [0, 1],
      [marginTopHidden, marginTopShown],
      Extrapolation.CLAMP
    );
    const interpolatedBorderRadius = interpolate(
      animation.value,
      [0, 1],
      [initialBorderRadius, 0],
      Extrapolation.CLAMP
    );

    return {
      marginTop: interpolatedMarginTop,
      borderTopLeftRadius: interpolatedBorderRadius,
      borderTopRightRadius: interpolatedBorderRadius,
    };
  });

  return { animatedContainerStyle, animateModal };
};

const useKeyboardEventHandlers = (onKeyboardShow, onKeyboardHide) => {
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [onKeyboardShow, onKeyboardHide]);
};

const getStyles = (currentTheme) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: currentTheme.themeBackground,
  },
  flex: {
    flex: 1,
    ...alignment.MTsmall
  },
  modalTextBtn: {
    marginBottom: scale(10),
    alignSelf: 'flex-start',
    zIndex: 1
  },
  locationIcon: {
    padding: scale(6),
    borderRadius: scale(100),
    backgroundColor: currentTheme.lightBackground,
  }
});

export default function SearchModal({
  visible = false,
  onClose = () => {},
  onSubmit = () => {}
}) {
  const { t } = useTranslation();
  const { GOOGLE_MAPS_KEY } = useEnvVars();

  const themeContext = useContext(ThemeContext);
  const currentTheme = theme[themeContext.ThemeValue];
  const componentStyles = getStyles(currentTheme);
  const autocompleteStyles = getAutocompleteStyles(currentTheme);

  const { userLocation } = useLocationManager();
  const { animatedContainerStyle, animateModal } = useKeyboardAnimation();

  const handleKeyboardShow = () => animateModal(true);
  const handleKeyboardHide = () => animateModal(false);

  useKeyboardEventHandlers(handleKeyboardShow, handleKeyboardHide);

  const handleCloseModal = () => {
    animateModal(false);
    onClose();
  };

  const handlePlaceSelect = (data, details) => {
    onSubmit(data.description, details?.geometry?.location);
    handleCloseModal();
  };

  const renderPlaceRow = (data) => (
    <View
      key={data.place_id || data.id}
      style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}
    >
      <View style={componentStyles.locationIcon}>
        <Ionicons name="location-outline" size={scale(16)} color={currentTheme.newIconColor} />
      </View>
      <TextDefault>{data?.description}</TextDefault>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType={'slide'}
      onRequestClose={handleCloseModal}
    >
      <Animated.View
        style={[
          componentStyles.modalContainer,
          animatedContainerStyle,
        ]}
      >
        <View style={[componentStyles.flex, alignment.MTsmall, { padding: scale(16)}]}>
          <TouchableOpacity style={componentStyles.modalTextBtn} onPress={handleCloseModal}>
            <AntDesign
              name='arrowleft'
              size={scale(24)}
              color={currentTheme.newIconColor}
            />
          </TouchableOpacity>
          <GooglePlacesAutocomplete
            placeholder={t('search')}
            autoFocus={true}
            returnKeyType={'search'}
            listViewDisplayed='auto'
            fetchDetails={true}
            renderDescription={(row) => row.description}
            renderRow={renderPlaceRow}
            onPress={handlePlaceSelect}
            getDefaultValue={() => ''}
            predefinedPlaces={[]}
            query={{
              key: GOOGLE_MAPS_KEY,
              language: 'en'
            }}
            textInputProps={{
              placeholderTextColor: currentTheme.fontMainColor
            }}
            styles={autocompleteStyles}
            nearbyPlacesAPI='GooglePlacesSearch'
            GoogleReverseGeocodingQuery={{}}
            GooglePlacesSearchQuery={userLocation ? {
              rankby: 'distance',
              location: `${userLocation.latitude},${userLocation.longitude}`,
              radius: 50000,
            } : {}}
            debounce={200}
          />
        </View>
      </Animated.View>
    </Modal>
  );
}