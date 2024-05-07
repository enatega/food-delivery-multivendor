/* eslint-disable react/display-name */
import React from 'react'
import SelectedLocation from '../../components/Main/Location/Location'
import { alignment } from '../../utils/alignment'
import FiltersIcon from '../../assets/SVG/filter'
import MapIcon from '../../assets/SVG/map'
import { View } from 'react-native'

const navigationOptions = (props) => ({
  headerStyle: {
    shadowColor: 'transparent',
    shadowRadius: 0,
  },
  headerTitleStyle: {
    color: props.fontMainColor,
    ...alignment.PTlarge
  },
  headerTitleContainerStyle: {
    alignItems: 'flex-start',
    ...alignment.MLxSmall
  },
  headerTitleAlign: 'left',
  headerRight: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, ...alignment.MRsmall }}>
      <FiltersIcon onPress={props.onPressFilter} />
      <MapIcon onPress={props.onPressMap} />
    </View>
  ),
  headerTitle: (headerProp) => (
    <SelectedLocation
      {...headerProp}
      modalOn={() => props.open()}
      linkColor={props.fontMainColor}
      navigation={props.navigation}
    />
  )
})
export default navigationOptions
