/* eslint-disable react/display-name */
import React from 'react'
import SelectedLocation from '../../components/Main/Location/Location'
import { alignment } from '../../utils/alignment'
import FiltersIcon from '../../assets/SVG/filter'
import MapIcon from '../../assets/SVG/map'
import { TouchableOpacity, View, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const navigationOptions = (props) => ({
  headerStyle: {
    shadowColor: 'transparent',
    shadowRadius: 0,
    backgroundColor: props?.headerMenuBackground
  },
  headerTitleStyle: {
    color: props?.fontMainColor,
    ...alignment.PTlarge
  },
  headerTitleContainerStyle: {
    alignItems: 'flex-start',
    // Give the custom headerTitle a definite width so the selected address
    // doesn't collapse to just the icon. Narrower than Discovery because this
    // header has two right-side icons (and an optional back button).
    width: SCREEN_WIDTH * 0.6,
    ...alignment.MLxSmall
  },
  headerTitleAlign: 'left',
  headerRight: () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        ...alignment.MRsmall
      }}
    >
      <FiltersIcon onPress={props?.onPressFilter} />
      <MapIcon onPress={props?.onPressMap} />
    </View>
  ),
  headerTitle: (headerProp) => (
    <SelectedLocation
      {...headerProp}
      modalOn={() => props?.open()}
      linkColor={props?.fontMainColor}
      navigation={props?.navigation}
    />
  ),
  headerLeft: props?.haveBackBtn ? () => (
    <TouchableOpacity onPress={props?.onPressBack} style={{...alignment.MLsmall}}>
          <Ionicons name="arrow-back" size={24} color={props?.iconColorPink} />
        </TouchableOpacity>
  ) : null
})
export default navigationOptions
