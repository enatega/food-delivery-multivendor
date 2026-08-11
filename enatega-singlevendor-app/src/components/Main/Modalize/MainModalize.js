import React, { useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { MaterialIcons } from '@expo/vector-icons';
import TextDefault from '../../Text/TextDefault/TextDefault';
import { scale } from '../../../utils/scaling';
import styles from './styles';
import { useTranslation } from'react-i18next';


const MainModalize = ({
  modalRef,
  currentTheme,
  isLoggedIn,
  addressIcons,
  modalHeader,
  modalFooter,
  setAddressLocation,
  profile,
  location,
}) => {
  const { t } = useTranslation()

  // `styles(currentTheme)` builds a fresh StyleSheet on every call. Compute it
  // once per render instead of ~15 times per row, which was a big chunk of the
  // list's jank when scrolling / re-rendering the address sheet.
  const themedStyles = useMemo(() => styles(currentTheme), [currentTheme])

  const renderItem = useCallback(
    ({ item: address }) => {
      const IconComponent = addressIcons[address.label] || addressIcons['Other']
      const isSelected =
        address?._id === location?._id &&
        ![t('currentLocation'), t('selectedLocation')].includes(location?.label)

      return (
        <View style={themedStyles.addressbtn}>
          <TouchableOpacity
            style={themedStyles.addressContainer}
            activeOpacity={0.7}
            onPress={() => setAddressLocation(address)}
          >
            <View style={themedStyles.addressSubContainer}>
              <View style={themedStyles.homeIcon}>
                {React.createElement(IconComponent, {
                  fill: currentTheme.darkBgFont,
                })}
              </View>
              <View style={themedStyles.titleAddress}>
                <TextDefault
                  textColor={currentTheme.darkBgFont}
                  style={themedStyles.labelStyle}
                >
                  {t(address.label)}
                </TextDefault>
              </View>
            </View>

            <View style={themedStyles.addressTextContainer}>
              <TextDefault textColor={currentTheme.fontSecondColor} small>
                {address?.deliveryAddress}
              </TextDefault>
            </View>
          </TouchableOpacity>
          <View style={themedStyles.addressTick}>
            {isSelected && (
              <MaterialIcons
                name='check'
                size={scale(25)}
                color={currentTheme.iconColorPink}
              />
            )}
          </View>
        </View>
      )
    },
    [themedStyles, addressIcons, currentTheme, location, setAddressLocation, t]
  )

  const flatListProps = useMemo(
    () => ({
      data: isLoggedIn && profile ? profile.addresses : [],
      ListHeaderComponent: modalHeader(),
      ListFooterComponent: modalFooter(),
      keyExtractor: (item) => item._id,
      renderItem,
      removeClippedSubviews: true,
      initialNumToRender: 6,
      maxToRenderPerBatch: 8,
      windowSize: 7,
    }),
    [isLoggedIn, profile, modalHeader, modalFooter, renderItem]
  )

  return (
    <Modalize
      ref={modalRef}
      adjustToContentHeight
      disableScrollIfPossible={false}
      modalStyle={themedStyles.modal}
      overlayStyle={themedStyles.overlay}
      handleStyle={themedStyles.handle}
      handlePosition='inside'
      modalPosition='top'
      openAnimationConfig={{
        timing: { duration: 400 },
        spring: { speed: 20, bounciness: 10 },
      }}
      closeAnimationConfig={{
        timing: { duration: 400 },
        spring: { speed: 20, bounciness: 10 },
      }}
      flatListProps={flatListProps}
    ></Modalize>
  );
};

export default React.memo(MainModalize);
