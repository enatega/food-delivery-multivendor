import React, { useContext, useRef } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { MaterialIcons, AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import TextDefault from '../../Text/TextDefault/TextDefault';
import { alignment } from '../../../utils/alignment';
import { scale } from '../../../utils/scaling';
import styles from './styles';
import { useTranslation } from'react-i18next';

const { height: HEIGHT } = Dimensions.get('window')


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
  const { t} = useTranslation()
  return (
    <Modalize
      ref={modalRef}
      adjustToContentHeight
      disableScrollIfPossible={false}
      modalStyle={styles(currentTheme).modal}
      overlayStyle={styles(currentTheme).overlay}
      handleStyle={styles(currentTheme).handle}
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
      flatListProps={{
        data: isLoggedIn && profile ? profile.addresses : '',
        ListHeaderComponent: modalHeader(),
        ListFooterComponent: modalFooter(),
        keyExtractor: (item) => item._id,
        renderItem: ({ item: address }) => (
          <View style={styles(currentTheme).addressbtn}>
            <TouchableOpacity
              style={styles(currentTheme).addressContainer}
              activeOpacity={0.7}
              onPress={() => setAddressLocation(address)}
            >
              <View style={styles(currentTheme).addressSubContainer}>
                <View style={[styles(currentTheme).homeIcon]}>
                  {addressIcons[address.label]
                    ? React.createElement(addressIcons[address.label], {
                        fill: currentTheme.darkBgFont,
                      })
                    : React.createElement(addressIcons['Other'], {
                        fill: currentTheme.darkBgFont,
                      })}
                </View>
                <View style={[styles().titleAddress]}>
                  <TextDefault
                    textColor={currentTheme.darkBgFont}
                    style={styles(currentTheme).labelStyle}
                  >
                    {t(address.label)}
                  </TextDefault>
                </View>
              </View>
              
              <View style={styles(currentTheme).addressTextContainer}>
                  <TextDefault
                    // style={{ ...alignment.PLlarge }}
                    textColor={currentTheme.fontSecondColor}
                    small
                  >
                    {address?.deliveryAddress}
                  </TextDefault>
              </View>
            </TouchableOpacity>
            <View style={styles().addressTick}>
              {address?._id === location?._id &&
                ![t('currentLocation'), t('selectedLocation')].includes(
                  location.label
                ) && (
                  <MaterialIcons
                    name='check'
                    size={scale(25)}
                    color={currentTheme.iconColorPink}
                  />
                )}
            </View>
          </View>
        ),
      }}
    ></Modalize>
  );
};

export default MainModalize;