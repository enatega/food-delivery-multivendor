import React from 'react'
import { View, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons
} from '@expo/vector-icons'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { scale } from '../../utils/scaling'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import Spinner from '../../components/Spinner/Spinner'

export function LoadingComponent({ currentTheme }) {
  return (
    <SafeAreaView style={styles(currentTheme).screenBackground}>
      <Placeholder
        Animation={props => (
          <Fade
            {...props}
            style={styles(currentTheme).placeHolderFadeColor}
            duration={600}
          />
        )}
        style={styles(currentTheme).placeHolderContainer}>
        <PlaceholderLine style={styles().height200} />
        <PlaceholderLine />
      </Placeholder>
      <Placeholder
        Animation={props => (
          <Fade
            {...props}
            style={styles(currentTheme).placeHolderFadeColor}
            duration={600}
          />
        )}
        style={styles(currentTheme).placeHolderContainer}>
        <PlaceholderLine style={styles().height200} />
        <PlaceholderLine />
      </Placeholder>
      <Placeholder
        Animation={props => (
          <Fade
            {...props}
            style={styles(currentTheme).placeHolderFadeColor}
            duration={600}
          />
        )}
        style={styles(currentTheme).placeHolderContainer}>
        <PlaceholderLine style={styles().height200} />
        <PlaceholderLine />
      </Placeholder>
    </SafeAreaView>
  )
}

export function EmptyComponent({ currentTheme }) {
  return (
    <View
      style={{
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Image source={require('../../assets/images/search.png')} />
      <TextDefault
        center
        bolder
        textColor={currentTheme.fontMainColor}
        style={{ fontSize: 20, ...alignment.MTsmall }}>
        {"That's not in the list yet"}
      </TextDefault>
      <TextDefault
        center
        bold
        textColor={currentTheme.fontMainColor}
        style={{ fontSize: 15, ...alignment.MTxSmall }}>
        Try different search
      </TextDefault>
    </View>
  )
}

export function ModalHeader({
  currentTheme,
  setCurrentLocation,
  location,
  busy
}) {
  return (
    <View style={[styles().content, styles().addressbtn]}>
      <TouchableOpacity
        style={[styles(currentTheme).addressContainer]}
        activeOpacity={0.7}
        onPress={setCurrentLocation}>
        <View style={styles().addressSubContainer}>
          <MaterialCommunityIcons
            name="target"
            size={scale(15)}
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
}

export function ModalFooter({
  currentTheme,
  isLoggedIn,
  navigation,
  modalRef
}) {
  return (
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
}
