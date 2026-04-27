import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { View, TouchableOpacity, FlatList, StatusBar, Platform, Modal } from 'react-native'
import { NetworkStatus, useMutation } from '@apollo/client'
import { AntDesign, EvilIcons, SimpleLineIcons, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons'

import gql from 'graphql-tag'

import { scale } from '../../utils/scaling'
import { deleteAddress, deleteBulkAddresses } from '../../apollo/mutations'
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
import Spinner from '../../components/Spinner/Spinner'
import DeleteEditModal from '../../components/DeleteEditModal/DeleteEditModal'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

const DELETE_ADDRESS = gql`
  ${deleteAddress}
`
const DELETE_BULK_ADDRESSES = gql`
  ${deleteBulkAddresses}
`

function Addresses() {
  const { t, i18n } = useTranslation()
  const Analytics = analytics()

  const navigation = useNavigation()
  const [mutate, { loading: loadingAddressMutation }] = useMutation(DELETE_ADDRESS, {
    onCompleted
  })
  const [mutateBulkDelete, { loading: loadingDeleteBulk }] = useMutation(DELETE_BULK_ADDRESSES, {
    onCompleted
  })
  const { profile, refetchProfile, networkStatus } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedAddresses, setSelectedAddresses] = useState([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [deleteAllModalVisible, setdeleteAllModalVisible] = useState(false)
  const [finalConfirmVisible, setFinalConfirmVisible] = useState(false)

  function onCompleted() {
    setdeleteAllModalVisible(false)
    setDeleteModalVisible(false)
    FlashMessage({ message: t('addressDeletedMessage') })
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
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
          const isDeleteDisabled = selectedAddresses.length < 1 || loadingAddressMutation
          return (
            <TouchableOpacity
              disabled={isDeleteDisabled}
              style={[{ marginLeft: scale(10) }, { opacity: isDeleteDisabled ? 0.5 : 1 }]}
              onPress={() => {
                setdeleteAllModalVisible(true)
              }}
            >
              {loadingAddressMutation ? (
                <Spinner backColor='transparent' size='small' />
              ) : (
                <TextDefault textColor={currentTheme.red600} H5 bolder>
                  {t('delete')}
                </TextDefault>
              )}
            </TouchableOpacity>
          )
        } else {
          return (
            <HeaderBackButton
              truncatedLabel=''
              backImage={() => (
                <View>
                  <MaterialIcons name='arrow-back' size={30} color={currentTheme.newIconColor} />
                </View>
              )}
              onPress={() => navigation.navigate('Main')}
            />
          )
        }
      },
      headerRight: () => {
        if (profile?.addresses?.length > 0) {
          return (
            <View style={{ ...alignment.MRmedium }}>
              <TouchableOpacity
                onPress={() => {
                  setIsEditMode((prev) => !prev)
                  setSelectedAddresses([])
                }}
              >
                <TextDefault textColor={currentTheme.linkColor} H5 bolder>
                  {isEditMode ? t('cancel') : t('edit')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          )
        }
        return null
      }
    })
  }, [navigation, isEditMode, t, currentTheme, selectedAddresses, loadingAddressMutation, profile?.Addresses])

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

  const handleAddressSelection = (addressId) => {
    setSelectedAddresses((prevSelected) => {
      const updatedAddresses = prevSelected.includes(addressId) ? prevSelected?.filter((id) => id !== addressId) : [...prevSelected, addressId]
      return updatedAddresses
    })
  }

  const handleDeleteSelectedAddresses = () => {
    setdeleteAllModalVisible(false)
    setFinalConfirmVisible(true)
  }

  const confirmBulkDelete = async () => {
    mutateBulkDelete({
      variables: { ids: selectedAddresses }
    })
    setSelectedAddresses([])
    setFinalConfirmVisible(false)
  }

  const editMyAddress = (address) => {
    const [longitude, latitude] = address.location.coordinates
    setDeleteModalVisible(false)
    navigation.navigate('AddNewAddress', {
      id: address._id,
      longitude: +longitude, // Convert string to number
      latitude: +latitude,
      prevScreen: 'Addresses'
    })

    // setSelectedAddressId(null)
  }

  const deleteMyAddress = () => {
    setDeleteModalVisible(false)
    setFinalConfirmVisible(true)
  }

  const confirmSingleDelete = async () => {
    await mutate({ variables: { id: selectedAddressId._id } })
      .then((response) => {
        console.log('Mutation success:', response)
      })
      .catch((error) => {
        console.log('Mutation error:', error)
      })
    setSelectedAddressId(null)
    setFinalConfirmVisible(false)
  }

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[refetchProfile]} />

  return (
    <View style={styles(currentTheme).flex}>
      <FlatList
        onRefresh={refetchProfile}
        refreshing={networkStatus === NetworkStatus.refetch}
        data={profile?.addresses}
        ListEmptyComponent={emptyView}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <View style={styles(currentTheme).line} />}
        ListHeaderComponent={() => <View style={{ ...alignment.MTmedium }} />}
        renderItem={({ item: address }) => {
          return (
            <TouchableOpacity activeOpacity={0.7} style={[styles(currentTheme).containerSpace]} onPress={() => handleAddressSelection(address._id)} disabled={!isEditMode}>
              <View style={[styles().width100, styles(currentTheme).rowContainer]}>
                <View style={styles(currentTheme).rowContainer}>
                  {isEditMode && (
                    <View style={styles().checkboxContainer}>
                      <CheckboxBtn checked={selectedAddresses.includes(address._id)} onPress={() => handleAddressSelection(address._id)} />
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
                      <TextDefault textColor={currentTheme.darkBgFont} style={styles(currentTheme).labelStyle} H5 bolder isRTL>
                        {t(address.label)}
                      </TextDefault>
                    </View>
                    {/* location description */}
                    <View style={styles(currentTheme).midContainer}>
                      <View style={styles(currentTheme).addressDetail}>
                        <TextDefault numberOfLines={1} textColor={currentTheme.darkBgFont} style={{ ...alignment.PBxSmall }} isRTL>
                          {/* {address.deliveryAddress} */}
                          {address.deliveryAddress.slice(0, 35) + (address.deliveryAddress.length > 35 ? '...' : '')}
                        </TextDefault>
                      </View>
                    </View>
                  </View>
                </View>

                {!isEditMode && (
                  //  location edit and delete buttons
                  <View style={styles(currentTheme).buttonsAddress}>
                    <TouchableOpacity
                      disabled={loadingAddressMutation || loadingDeleteBulk}
                      activeOpacity={0.7}
                      // onPress={() => {
                      //   const [longitude, latitude] =
                      //     address.location.coordinates
                      //   navigation.navigate('AddNewAddress', {
                      //     id: address._id,
                      //     longitude: +longitude,
                      //     latitude: +latitude,
                      //     prevScreen: 'Addresses'
                      //   })
                      // }}
                      onPress={() => {
                        setSelectedAddressId(address)
                        setDeleteModalVisible(true)
                      }}
                    >
                      <MaterialCommunityIcons name='dots-horizontal-circle-outline' size={scale(24)} color={currentTheme.darkBgFont} />
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      activeOpacity={0.7}
                      disabled={loadingAddressMutation}
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
              </View>
            </TouchableOpacity>
          )
        }}
      />
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

      <DeleteEditModal modalVisible={deleteModalVisible} setModalVisible={setDeleteModalVisible} currentTheme={currentTheme} selectedAddress={selectedAddressId} loading={loadingAddressMutation} onDelete={deleteMyAddress} onEdit={editMyAddress} t={t} editButton />

      <DeleteEditModal
        modalVisible={deleteAllModalVisible}
        setModalVisible={setdeleteAllModalVisible}
        currentTheme={currentTheme}
        loading={loadingDeleteBulk}
        onDelete={handleDeleteSelectedAddresses}
        t={t}
        deleteAllButton
      />

      <DeleteEditModal
        modalVisible={finalConfirmVisible}
        setModalVisible={setFinalConfirmVisible}
        currentTheme={currentTheme}
        selectedAddress={{ deliveryAddress: t('confirmDelete') }}
        loading={loadingAddressMutation || loadingDeleteBulk}
        onDelete={selectedAddresses.length > 0 ? confirmBulkDelete : confirmSingleDelete}
        t={t}
      />
    </View>
  )
}

export default Addresses
