import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform
} from 'react-native'
import { NetworkStatus, useMutation } from '@apollo/client'
import {
  AntDesign,
  EvilIcons,
  SimpleLineIcons,
  MaterialIcons,
  MaterialCommunityIcons
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
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import navigationService from '../../routes/navigationService'
import { HeaderBackButton } from '@react-navigation/elements'
import CustomHomeIcon from '../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomWorkIcon from '../../assets/SVG/imageComponents/CustomWorkIcon'
import CustomOtherIcon from '../../assets/SVG/imageComponents/CustomOtherIcon'
import CustomApartmentIcon from '../../assets/SVG/imageComponents/CustomApartmentIcon'
import { useTranslation } from 'react-i18next'
import CheckboxBtn from '../../ui/FdCheckbox/CheckboxBtn'

const DELETE_ADDRESS = gql`
  ${deleteAddress}
`

function Addresses() {
  const Analytics = analytics()

  const navigation = useNavigation()
  const [mutate, { loading: loadingMutation }] = useMutation(DELETE_ADDRESS, {
    onCompleted
  })
  const { profile, refetchProfile, networkStatus } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedAddresses, setSelectedAddresses] = useState([])

  function onCompleted() {
    FlashMessage({ message: t('addressDeletedMessage') })
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_ADDRESS)
    }
    Track()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('savedAddresses'),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        elevation: 0
      },
      headerLeft: () => {
        if (isEditMode) {
          return (
            <TouchableOpacity
              disabled={loadingMutation}
              style={{ marginLeft: scale(10) }}
              onPress={() => handleDeleteSelectedAddresses()}
            >
              <TextDefault textColor={currentTheme.red600} H5 bolder>
                {t('delete')}
              </TextDefault>
            </TouchableOpacity>
          )
        } else {
          return (
            <HeaderBackButton
              truncatedLabel=''
              backImage={() => (
                <View>
                  <MaterialIcons
                    name='arrow-back'
                    size={30}
                    color={currentTheme.newIconColor}
                  />
                </View>
              )}
              onPress={() => navigationService.goBack()}
            />
          )
        }
      },
      headerRight: () => (
        <View style={{ ...alignment.MRmedium }}>
          <TouchableOpacity onPress={() => setIsEditMode((prev) => !prev)}>
            <TextDefault textColor={currentTheme.linkColor} H5 bolder>
              {isEditMode ? t('cancel') : t('edit')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      )
    })
  }, [navigation, isEditMode, t, currentTheme])

  const addressIcons = {
    House: CustomHomeIcon,
    Office: CustomWorkIcon,
    Apartment: CustomApartmentIcon,
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
                {t('emptyHere')}
              </TextDefault>
            </View>
            <View>
              <TextDefault textColor={currentTheme.fontMainColor} bold>
                {t('addressNotSaved')}
                {'\n'}
                {t('addNewAddress')}
              </TextDefault>
            </View>
          </View>
        </View>
      </View>
    )
  }

  // useEffect here with dependency array
useEffect(() => {
  console.log('Updated Selected Addresses in useEffect hook:', selectedAddresses);
}, [selectedAddresses]);
  


  const handleDeleteSelectedAddresses = () => {
    console.log('Selected Addresses in handleDeleteSelectedAddresses:', selectedAddresses);

    // Iterate through selected addresses and delete them
    selectedAddresses.forEach((addressId) => {
      console.log('Deleting Address:', addressId);
      mutate({ variables: { id: addressId } })
        .then((response) => {
          console.log('Mutation success:', response);
        })
        .catch((error) => {
          console.log('Mutation error:', error);
        });
    });

    // Clear the selected addresses state
    setSelectedAddresses([]);
  };

  const handleAddressSelection = (addressId) => {
    console.log('Selected Address in handleAddressSelection:', addressId);
    console.log('Previous Selected Addresses:', selectedAddresses);

    setSelectedAddresses((prevSelected) => {
      const updatedAddresses = prevSelected.includes(addressId)
        ? prevSelected.filter((id) => id !== addressId)
        : [...prevSelected, addressId];
      return updatedAddresses;
    });
  };

  return (
    <View style={styles(currentTheme).flex}>
      <FlatList
        onRefresh={refetchProfile}
        refreshing={networkStatus === NetworkStatus.refetch}
        data={profile?.addresses}
        ListEmptyComponent={emptyView}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => (
          <View style={styles(currentTheme).line} />
        )}
        ListHeaderComponent={() => <View style={{ ...alignment.MTmedium }} />}
        renderItem={({ item: address }) => {
          // console.log('Address:', address._id)
          console.log(
            'Checkbox Checked:',
            selectedAddresses.includes(address._id)
          )

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles(currentTheme).containerSpace]}
            >
              <View style={[styles().width100, styles().rowContainer]}>
                <View style={styles().rowContainer}>
                  {isEditMode && (
                    <View style={styles().checkboxContainer}>
                      <CheckboxBtn
                        checked={selectedAddresses.includes(address._id)}
                        onPress={() => handleAddressSelection(address._id)}
                      />
                    </View>
                  )}
                  {/* location icon */}
                  <View style={[styles(currentTheme).homeIcon]}>
                    {addressIcons[address.label]
                      ? React.createElement(addressIcons[address.label], {
                          fill: currentTheme.darkBgFont
                        })
                      : React.createElement(addressIcons['Other'], {
                          fill: currentTheme.darkBgFont
                        })}
                  </View>

                  {/* addresses */}
                  <View style={styles(currentTheme).actionButton}>
                    {/* location title */}
                    <View style={[styles().titleAddress]}>
                      <TextDefault
                        textColor={currentTheme.darkBgFont}
                        style={styles(currentTheme).labelStyle}
                        H5
                        bolder
                      >
                        {t(address.label)}
                      </TextDefault>
                    </View>
                    {/* location description */}
                    <View style={styles().midContainer}>
                      <View style={styles(currentTheme).addressDetail}>
                        <TextDefault
                          numberOfLines={2}
                          textColor={currentTheme.darkBgFont}
                          style={{ ...alignment.PBxSmall }}
                        >
                          {/* {address.deliveryAddress} */}
                          {address.deliveryAddress.slice(0, 30) +
                            (address.deliveryAddress.length > 30 ? '...' : '')}
                        </TextDefault>
                      </View>
                    </View>
                  </View>
                </View>

                {!isEditMode && (
                  //  location edit and delete buttons
                  <View style={styles().buttonsAddress}>
                    <TouchableOpacity
                      disabled={loadingMutation}
                      activeOpacity={0.7}
                      onPress={() => {
                        const [longitude, latitude] =
                          address.location.coordinates
                        navigation.navigate('AddNewAddress', {
                          id: address._id,
                          longitude: +longitude,
                          latitude: +latitude,
                          prevScreen: 'Addresses'
                        })
                      }}
                    >
                      <MaterialCommunityIcons
                        name='dots-horizontal-circle-outline'
                        size={scale(24)}
                        color={currentTheme.darkBgFont}
                      />
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      activeOpacity={0.7}
                      disabled={loadingMutation}
                      onPress={() => {
                        mutate({ variables: { id: address._id } })
                      }}
                    >
                      <EvilIcons
                        name='trash'
                        size={scale(33)}
                        color={currentTheme.darkBgFont}
                      />
                    </TouchableOpacity> */}
                  </View>
                )}

                {/* <View style={{ ...alignment.MTxSmall }}></View> */}
              </View>
            </TouchableOpacity>
          )
        }}
      />
      {/* </ScrollView> */}
      <View>
        <View style={styles(currentTheme).containerButton}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles(currentTheme).addButton}
            onPress={() =>
              navigation.navigate('SelectLocation', {
                prevScreen: 'Addresses'
              })
            }
          >
            <TextDefault H5 bold>
              {t('addAddress')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Addresses
