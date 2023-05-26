import React, { useContext, useEffect, useLayoutEffect } from 'react'
import {
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  ImageBackground
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation } from '@apollo/client'
import { AntDesign, FontAwesome, Entypo } from '@expo/vector-icons'
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
          contentContainerStyle={{ height: '100%', ...alignment.Mmedium }}
          ListHeaderComponent={() => (
            <View style={styles(currentTheme).upperContainer}>
              <ImageBackground
                source={require('../../assets/images/address.png')}
                style={styles().backgroundImage}
                resizeMode="contain"
              />
            </View>
          )}
          ListFooterComponent={() => {
            return (
              <View style={styles(currentTheme).containerButton}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles().addButton}
                  onPress={() => navigation.navigate('NewAddress')}>
                  <AntDesign
                    name="plus"
                    size={scale(30)}
                    color={currentTheme.tagColor}
                  />
                </TouchableOpacity>
              </View>
            )
          }}
          renderItem={({ item: address }) => (
            <View style={styles(currentTheme).lower}>
              <TouchableOpacity
                style={styles(currentTheme).containerHeading}
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('EditAddress', { ...address })
                }}>
                <View style={[styles().titleAddress, styles().width100]}>
                  <View style={[styles().homeIcon]}>
                    <FontAwesome name="home" size={20} color="black" />
                  </View>
                  <View
                    style={{
                      width: '80%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      ...alignment.PLxSmall
                    }}>
                    <View>
                      <TextDefault
                        bolder
                        textColor={currentTheme.fontMainColor}>
                        {address.label}
                      </TextDefault>

                      <View style={styles().addressDetail}>
                        <TextDefault
                          textColor={currentTheme.fontMainColor}
                          small>
                          {address.deliveryAddress}
                        </TextDefault>
                      </View>
                    </View>

                    <View
                      style={[
                        styles().width10,
                        { alignItems: 'center', ...alignment.MRsmall }
                      ]}>
                      <Entypo
                        name="edit"
                        size={scale(18)}
                        color={currentTheme.fontMainColor}
                      />
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      disabled={loadingMutation}
                      style={styles().width10}
                      onPress={() => {
                        mutate({ variables: { id: address._id } })
                      }}>
                      <FontAwesome
                        name="trash"
                        size={scale(20)}
                        color={currentTheme.fontMainColor}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
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
