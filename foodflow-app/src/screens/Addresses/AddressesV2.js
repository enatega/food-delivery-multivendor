import React, { useContext, useEffect, useLayoutEffect } from 'react'
import {
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  Text,
  ScrollView
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation } from '@apollo/client'
import {
  AntDesign,
  EvilIcons,
  SimpleLineIcons,
  MaterialIcons
} from '@expo/vector-icons'

import gql from 'graphql-tag'

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
import analytics from '../../utils/analytics'
import navigationService from '../../routes/navigationService'
import { HeaderBackButton } from '@react-navigation/elements'
import CustomHomeIcon from '../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomWorkIcon from '../../assets/SVG/imageComponents/CustomWorkIcon'
import CustomOtherIcon from '../../assets/SVG/imageComponents/CustomOtherIcon'
import { useTranslation } from 'react-i18next'

const DELETE_ADDRESS = gql`
  ${deleteAddress}
`

function Addresses() {
  const Analytics = analytics()

  const navigation = useNavigation()
  const [mutate, { loading: loadingMutation }] = useMutation(DELETE_ADDRESS)
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()
  const { t } = useTranslation()
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_ADDRESS)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('myAddresses'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        backgroundColor: currentTheme.black,
        borderRadius: scale(10),
        borderColor: currentTheme.white,
        borderWidth: 1
      },
      headerStyle: {
        backgroundColor: currentTheme.headerBackground,
        shadowColor: 'transparent',
        shadowRadius: 0
      },
      headerTitleAlign: 'center',
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 50,
                marginLeft: 10,
                width: 55,
                alignItems: 'center'
              }}>
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [])

  const addressIcons = {
    Home: CustomHomeIcon,
    Work: CustomWorkIcon,
    Other: CustomOtherIcon
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
    <View style={styles(currentTheme).flex}>
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles().mainView}> */}
      <FlatList
        data={profile?.addresses}
        ListEmptyComponent={emptyView}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => (
          <View style={styles(currentTheme).line} />
        )}
        ListHeaderComponent={() => <View style={{ ...alignment.MTmedium }} />}
        renderItem={({ item: address }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles(currentTheme).containerSpace]}>
            <View style={[styles().width100]}>
              <View style={[styles().titleAddress, styles().width100]}>
                <TextDefault
                  textColor={currentTheme.darkBgFont}
                  style={styles(currentTheme).labelStyle}>
                  {address.label}
                </TextDefault>
              </View>
              <View style={{ ...alignment.MTxSmall }}></View>

              <View style={styles().midContainer}>
                <View style={[styles().homeIcon]}>
                  {addressIcons[address.label] ? (
                    React.createElement(addressIcons[address.label], {
                      fill: currentTheme.iconColorPink
                    })
                  ) : (
                    <AntDesign name="question" size={20} color="black" />
                  )}
                </View>

                <View style={styles(currentTheme).addressDetail}>
                  <TextDefault textColor={currentTheme.darkBgFont}>
                    {address.deliveryAddress}
                  </TextDefault>
                  <TextDefault textColor={currentTheme.darkBgFont}>
                    {address.details}
                  </TextDefault>
                </View>
                <View style={styles().buttonsAddress}>
                  <TouchableOpacity
                    disabled={loadingMutation}
                    activeOpacity={0.7}
                    onPress={() => {
                      navigation.navigate('EditAddress', { ...address })
                    }}>
                    <SimpleLineIcons
                      name="pencil"
                      size={scale(20)}
                      color={currentTheme.tagColor}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={loadingMutation}
                    onPress={() => {
                      mutate({ variables: { id: address._id } })
                    }}>
                    <EvilIcons
                      name="trash"
                      size={scale(33)}
                      color={currentTheme.tagColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* </ScrollView> */}
      <View style={styles(currentTheme).containerButton}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles().addButton}
          onPress={() => navigation.navigate('NewAddress')}>
          <AntDesign name="plus" size={scale(30)} color={currentTheme.black} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </View>
  )
}

export default Addresses
