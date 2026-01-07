import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import { Entypo, AntDesign, FontAwesome6, Feather, Octicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'

const SearchedAddress = ({ currentTheme, t, addressDetail, selectedType, setSelectedType, otherAddressDetails, setOtherAddressDetails }) => {
  const [isModalVisible, setisModalVisible] = useState(false)

  const locationTypes = [
    {
      id: 'apartment',
      label: 'Apartment',
      icon: <FontAwesome6 name='building' size={18} color={currentTheme.iconColor} />
    },
    {
      id: 'home',
      label: 'Home',
      icon: <Feather name='home' size={18} color={currentTheme.iconColor} />
    },
    {
      id: 'office',
      label: 'Office',
      icon: <Feather name='briefcase' size={18} color={currentTheme.iconColor} />
    },
    {
      id: 'other',
      label: 'Other',
      icon: <Octicons name='location' size={18} color={currentTheme.iconColor} />
    }
  ]

  const handleTypeSelection = (type) => {
    setSelectedType(type.id)
    setisModalVisible(false)
  }

  const getSelectedIcon = () => {
    const selected = locationTypes.find((e) => {
      return e.id === selectedType
    })
    return selected ? selected.icon : <AntDesign name='menu-unfold' size={18} color={currentTheme.colorTextMuted} />
  }

  const getSelectedLabel = () => {
    const selected = locationTypes.find((e) => {
      return e.id === selectedType
    })
    return selected ? selected.label : 'Select location type'
  }

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.themeBackground, paddingHorizontal: 15 }}>
      <View style={{ gap: scale(25) }}>
        <View style={[styles(currentTheme).inputContainer, styles(currentTheme).border]}>
          <TextDefault H5 bold numberOfLines={1}>
            {addressDetail}
          </TextDefault>
        </View>

        <View style={{ gap: 4 }}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <TextDefault H5 bold>
              {t('Address details')}
            </TextDefault>
            <View style={{ borderWidth: 1.5, borderColor: currentTheme.borderColor, paddingHorizontal: 4, paddingVertical: 2, borderRadius: scale(8) }}>
              <TextDefault textColor={currentTheme.colorTextMuted} H5 bold>
                {t('optional')}
              </TextDefault>
            </View>
          </View>
          <View style={[styles(currentTheme).inputContainer, styles(currentTheme).border]}>
            <TextInput value={otherAddressDetails} onChangeText={setOtherAddressDetails} placeholder={t('Street name and number')} placeholderTextColor='#999' style={{ flex: 1, color: currentTheme.fontMainColor || '#000' }} />
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <TextDefault H5 bold>
              {t('locationType')}
            </TextDefault>
            <TextDefault textColor={currentTheme.red600} H5>
              *
            </TextDefault>
          </View>
          <TextDefault H5 textColor={currentTheme.colorTextMuted}>
            {t('locationTypeDetails')}
          </TextDefault>
          <Pressable onPress={() => setisModalVisible(!isModalVisible)} style={[styles(currentTheme).inputContainer, styles(currentTheme).border]}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
              {getSelectedIcon()}

              <TextDefault H5 bold>
                {getSelectedLabel()}
              </TextDefault>
            </View>
            {isModalVisible ? <Entypo name='chevron-up' size={18} color={currentTheme.colorTextMuted} /> : <Entypo name='chevron-down' size={18} color={currentTheme.colorTextMuted} />}
          </Pressable>
          {isModalVisible && (
            <FlatList
              data={locationTypes}
              contentContainerStyle={[styles(currentTheme).border]}
              renderItem={(item) => {
                return (
                  <Pressable onPress={() => handleTypeSelection(item?.item)} style={styles(currentTheme).renderItem}>
                    <View style={{ width: scale(20), alignItems: 'center' }}>{item.item.icon}</View>
                    <Text>{item?.item.label}</Text>
                  </Pressable>
                )
              }}
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default SearchedAddress

const styles = (currentTheme) =>
  StyleSheet.create({
    border: {
      borderRadius: 12,
      borderWidth: 2,
      borderColor: currentTheme?.borderColor
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      height: 40,
      gap: 6
    },
    renderItem: {
      display: 'flex',
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: scale(6),
      paddingVertical: scale(12),
      borderWidth: 0.6,
      borderColor: currentTheme.borderColor
    }
  })
