import React, { useContext, useEffect, useLayoutEffect } from 'react'
import {
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation } from '@apollo/client'
import { AntDesign, EvilIcons, SimpleLineIcons } from '@expo/vector-icons'
import gql from 'graphql-tag'
import i18n from '../../../i18n'
import { scale } from '../../utils/scaling'
import { deleteAddress } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import UserContext from '../../context/User'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import EmptyAddress from '../../assets/SVG/imageComponents/EmptyAddress'
import Analytics from '../../utils/analytics'
const DELETE_ADDRESS = gql`
  ${deleteAddress}
`

function Addresses() {
  const navigation = useNavigation()
  const [mutate, { loading: loadingMutation }] = useMutation(DELETE_ADDRESS)
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })
  useEffect(async() => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_ADDRESS)
  }, [])
  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('myAddresses'),
      headerTitleAlign: 'left',
      headerRight: null,
      headerTitleContainerStyle: {
        alignItems: 'flex-start'
      }
    })
  }, [])

  const addressIcons = {
    Home: 'home',
    Work: 'briefcase',
    Other: 'location-pin'
  }
  function emptyView() {
    return (
      <View style={styles().subContainerImage}>
        <EmptyAddress width={scale(300)} height={scale(300)} />
        <View>
          <View style={styles().descriptionEmpty}>
            <View style={styles().viewTitle}>
              <TextDefault textColor={currentTheme.fontMainColor} bolder>
                It&#39;s empty here.
              </TextDefault>
            </View>
            <View>
              <TextDefault textColor={currentTheme.fontMainColor} bold>
                You haven&#39;t saved any address yet.
                {'\n'}
                Click Add New Address to get started
              </TextDefault>
            </View>
          </View>
        </View>
      </View>
    )
  }
  return (
    <>
      <View style={styles(currentTheme).containerInfo}>
        <FlatList
          data={profile.addresses}
          ListEmptyComponent={emptyView}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={() => (
            <View style={styles(currentTheme).line} />
          )}
          ListHeaderComponent={() => <View style={{ ...alignment.MTmedium }} />}
          renderItem={({ item: address }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles().width100, styles(currentTheme).containerSpace]}
              onPress={() => {
                navigation.navigate('EditAddress', { ...address })
              }}>
              <View style={styles().width100}>
                <View style={[styles().titleAddress, styles().width100]}>
                  <View style={[styles().homeIcon]}>
                    <SimpleLineIcons
                      name={addressIcons[address.label]}
                      size={scale(14)}
                      color={currentTheme.iconColorPink}
                    />
                  </View>
                  <TextDefault
                    textColor={currentTheme.fontMainColor}
                    style={{ width: '60%', textAlignVertical: 'bottom' }}>
                    {address.label}
                  </TextDefault>
                  <View style={[styles().width10, { alignItems: 'center' }]}>
                    <SimpleLineIcons
                      name="pencil"
                      size={scale(13)}
                      color={currentTheme.iconColorPink}
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={loadingMutation}
                    style={styles().width10}
                    onPress={() => {
                      mutate({ variables: { id: address._id } })
                    }}>
                    <EvilIcons
                      name="trash"
                      size={scale(20)}
                      color={currentTheme.iconColorPink}
                      style={styles().width100}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ ...alignment.MTxSmall }}></View>
                <View style={styles().addressDetail}>
                  <TextDefault textColor={currentTheme.fontSecondColor} small>
                    {address.deliveryAddress}
                  </TextDefault>
                  <TextDefault textColor={currentTheme.fontSecondColor} small>
                    {address.details}
                  </TextDefault>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <View style={styles(currentTheme).containerButton}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles().addButton}
            onPress={() => navigation.navigate('NewAddress')}>
            <AntDesign name="plus" size={scale(30)} color={'#FFF'} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default Addresses
