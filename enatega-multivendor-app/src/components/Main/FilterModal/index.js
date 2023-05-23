import React from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { MaterialIcons, SimpleLineIcons, AntDesign } from '@expo/vector-icons'
import styles from './styles'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import Spinner from '../../Spinner/Spinner'
import { scale } from '../../../utils/scaling'
const { height } = Dimensions.get('window')
export default function FilterModal({
  modalRef,
  navigation,
  isLoggedIn,
  location,
  busy,
  profile,
  currentTheme,
  addressIcons
}) {
  const modalHeader = () => (
    <View style={[styles().content, styles().headerContainer]}>
      <TouchableOpacity
        style={[styles(currentTheme).addressContainer]}
        activeOpacity={0.7}
        // onPress={setCurrentLocation}
      >
        <View style={styles().addressSubContainer}>
          <AntDesign
            name="arrowleft"
            size={15}
            color={currentTheme.iconColorPink}
          />

          <View style={styles().mL5p} />
          <TextDefault bold>Current Location</TextDefault>
        </View>
      </TouchableOpacity>
      <View style={styles().addressTick}>
        {location.label === 'Current Location' && (
          <MaterialIcons
            name="check"
            size={scale(15)}
            color={currentTheme.iconColorPink}
          />
        )}
        {busy && (
          <Spinner size={'small'} backColor={currentTheme.cartContainer} />
        )}
      </View>
    </View>
  )
  const modalFooter = () => (
    <View style={styles().addressbtn}>
      <View style={styles(currentTheme).addressContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            if (isLoggedIn) {
              navigation.navigate('NewAddress')
            } else {
              const modal = modalRef.current
              modal?.close()
              navigation.navigate({ name: 'CreateAccount' })
            }
          }}>
          <View style={styles().addressSubContainer}>
            <AntDesign
              name="pluscircleo"
              size={scale(12)}
              color={currentTheme.iconColorPink}
            />
            <View style={styles().mL5p} />
            <TextDefault bold>Add New Address</TextDefault>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles().addressTick}></View>
    </View>
  )
  return (
    <Modalize
      ref={modalRef}
      modalStyle={styles(currentTheme).modal}
      modalHeight={height * 0.85}
      overlayStyle={styles().overlay}
      withHandle={false}
      openAnimationConfig={{
        timing: { duration: 400 },
        spring: { speed: 20, bounciness: 10 }
      }}
      closeAnimationConfig={{
        timing: { duration: 400 },
        spring: { speed: 20, bounciness: 10 }
      }}
      flatListProps={{
        data: isLoggedIn && profile ? profile.addresses : '',
        ListHeaderComponent: modalHeader(),
        ListFooterComponent: modalFooter(),
        showsVerticalScrollIndicator: false,
        keyExtractor: item => item._id,
        renderItem: ({ item: address }) => (
          <View style={styles().addressbtn}>
            <TouchableOpacity
              style={styles(currentTheme).addressContainer}
              activeOpacity={0.7}
              //   onPress={() => setAddressLocation(address)}
            >
              <View style={styles().addressSubContainer}>
                <SimpleLineIcons
                  name={addressIcons[address.label]}
                  size={scale(12)}
                  color={currentTheme.iconColorPink}
                />
                <View style={styles().mL5p} />
                <TextDefault bold>{address.label}</TextDefault>
              </View>
              <View style={styles().addressTextContainer}>
                <TextDefault
                  style={{ ...alignment.PLlarge }}
                  textColor={currentTheme.fontSecondColor}
                  small>
                  {address.deliveryAddress}
                </TextDefault>
              </View>
            </TouchableOpacity>
            <View style={styles().addressTick}>
              {address.selected &&
                !['Current Location', 'Selected Location'].includes(
                  location.label
                ) && (
                <MaterialIcons
                  name="check"
                  size={scale(15)}
                  color={currentTheme.iconColorPink}
                />
              )}
            </View>
          </View>
        )
      }}></Modalize>
  )
}
