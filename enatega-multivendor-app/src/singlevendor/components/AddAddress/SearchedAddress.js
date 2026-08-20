import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native'
import React from 'react'
import { Feather, FontAwesome6 } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'

const SearchedAddress = ({
  currentTheme,
  t,
  addressDetail,
  selectedType,
  setSelectedType,
  otherAddressDetails,
  setOtherAddressDetails,
  doorBell,
  setDoorBell,
  setactiveState,
  bottomInset
}) => {
  const accent = currentTheme.singleVendorBrandForeground
  const primaryText = currentTheme.colorTextPrimary || currentTheme.fontMainColor
  const mutedText = currentTheme.colorTextMuted || currentTheme.fontSecondColor
  const divider = currentTheme.newBorderColor2 || currentTheme.borderColor

  const locationTypes = [
    { id: 'apartment', label: t('Apartment'), icon: 'building', library: 'fontAwesome' },
    { id: 'home', label: t('Home'), icon: 'home' },
    { id: 'office', label: t('Office'), icon: 'briefcase' },
    { id: 'other', label: t('Other'), icon: 'map-pin' }
  ]

  const renderLocationIcon = (type, color) => {
    if (type.library === 'fontAwesome') {
      return <FontAwesome6 name={type.icon} size={17} color={color} />
    }
    return <Feather name={type.icon} size={18} color={color} />
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentTheme.themeBackground }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomInset + 118 }
        ]}
      >
        <View style={[styles.locationSection, { borderBottomColor: divider }]}>
          <TextDefault small bold uppercase textColor={mutedText} style={styles.eyebrow}>
            Selected location
          </TextDefault>
          <View style={styles.locationRow}>
            <View style={[styles.locationIcon, { backgroundColor: currentTheme.singleVendorBrandSubtle }]}> 
              <Feather name='map-pin' size={20} color={accent} />
            </View>
            <TextDefault
              H5
              bolder
              numberOfLines={3}
              textColor={primaryText}
              style={styles.addressText}
            >
              {addressDetail}
            </TextDefault>
            <Pressable
              accessibilityRole='button'
              onPress={() => setactiveState('searching')}
              hitSlop={8}
              style={({ pressed }) => [styles.changeButton, { opacity: pressed ? 0.55 : 1 }]}
            >
              <TextDefault H5 bolder textColor={accent}>
                Change
              </TextDefault>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.labelRow}>
            <TextDefault H4 bolder textColor={primaryText}>
              {t('Address details')}
            </TextDefault>
            <TextDefault textColor={mutedText} style={styles.optionalText}>
              {t('optional')}
            </TextDefault>
          </View>
          <TextDefault textColor={mutedText} style={styles.supportingText}>
            Add information that helps your courier find the entrance.
          </TextDefault>
        </View>

        <View style={[styles.detailGroup, { backgroundColor: currentTheme.colorBgTertiary }]}>
          <View style={styles.inputRow}>
            <Feather name='navigation' size={18} color={mutedText} />
            <View style={styles.inputCopy}>
              <TextDefault small bold textColor={mutedText}>
                Street, floor or landmark
              </TextDefault>
              <TextInput
                value={otherAddressDetails || ''}
                onChangeText={setOtherAddressDetails}
                placeholder={t('Street name and number')}
                placeholderTextColor={currentTheme.gray400 || mutedText}
                selectionColor={accent}
                returnKeyType='next'
                style={[styles.input, { color: primaryText }]}
              />
            </View>
          </View>
          <View style={[styles.inputDivider, { backgroundColor: divider }]} />
          <View style={styles.inputRow}>
            <Feather name='bell' size={18} color={mutedText} />
            <View style={styles.inputCopy}>
              <TextDefault small bold textColor={mutedText}>
                {t('Doorbell name')}
              </TextDefault>
              <TextInput
                value={doorBell || ''}
                onChangeText={setDoorBell}
                placeholder={t('Enter doorbell name')}
                placeholderTextColor={currentTheme.gray400 || mutedText}
                selectionColor={accent}
                returnKeyType='done'
                style={[styles.input, { color: primaryText }]}
              />
            </View>
          </View>
        </View>

        <View style={styles.typeSection}>
          <View style={styles.labelRow}>
            <TextDefault H4 bolder textColor={primaryText}>
              {t('locationType')}
            </TextDefault>
            <View style={[styles.requiredDot, { backgroundColor: accent }]} />
          </View>
          <TextDefault textColor={mutedText} style={styles.supportingText}>
            {t('locationTypeDetails')}
          </TextDefault>

          <View style={[styles.typeSelector, { borderBottomColor: divider }]}>
            {locationTypes.map((type) => {
              const selected = selectedType === type.id
              const iconColor = selected ? accent : mutedText

              return (
                <Pressable
                  key={type.id}
                  accessibilityRole='radio'
                  accessibilityState={{ selected }}
                  onPress={() => setSelectedType(type.id)}
                  style={({ pressed }) => [
                    styles.typeOption,
                    { opacity: pressed ? 0.6 : 1 }
                  ]}
                >
                  <View
                    style={[
                      styles.typeIcon,
                      {
                        backgroundColor: selected
                          ? currentTheme.singleVendorBrandSubtle
                          : currentTheme.colorBgTertiary
                      }
                    ]}
                  >
                    {renderLocationIcon(type, iconColor)}
                  </View>
                  <TextDefault
                    small
                    bolder={selected}
                    textColor={selected ? accent : primaryText}
                    numberOfLines={1}
                  >
                    {type.label}
                  </TextDefault>
                  <View
                    style={[
                      styles.selectionLine,
                      { backgroundColor: selected ? accent : 'transparent' }
                    ]}
                  />
                </Pressable>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SearchedAddress

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 6
  },
  locationSection: {
    paddingTop: 18,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  eyebrow: {
    letterSpacing: 0.85,
    marginBottom: 11
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addressText: {
    flex: 1,
    marginHorizontal: 12,
    lineHeight: scale(19)
  },
  changeButton: {
    minHeight: 36,
    justifyContent: 'center'
  },
  sectionHeader: {
    paddingTop: 25,
    paddingBottom: 13
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionalText: {
    marginLeft: 8
  },
  supportingText: {
    marginTop: 5,
    lineHeight: scale(17)
  },
  detailGroup: {
    borderRadius: 18,
    paddingHorizontal: 16
  },
  inputRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputCopy: {
    flex: 1,
    marginLeft: 13,
    paddingTop: 11
  },
  input: {
    minHeight: 38,
    paddingVertical: 5,
    paddingHorizontal: 0,
    fontSize: scale(14)
  },
  inputDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 31
  },
  typeSection: {
    paddingTop: 27
  },
  requiredDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8
  },
  typeSelector: {
    flexDirection: 'row',
    marginTop: 17,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  typeOption: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    paddingBottom: 12
  },
  typeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7
  },
  selectionLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: -1,
    height: 2,
    borderRadius: 1
  }
})
