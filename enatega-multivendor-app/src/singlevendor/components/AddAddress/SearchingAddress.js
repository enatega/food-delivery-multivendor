import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import Spinner from '../../../components/Spinner/Spinner'

const SearchingAddress = ({
  currentTheme,
  t,
  setactiveState,
  loading,
  searchText,
  predictions,
  searchError,
  handleTextChange,
  handlePlaceSelect,
  handleClearSearch,
  isSearched,
  bottomInset
}) => {
  const accent = currentTheme.singleVendorBrandForeground
  const primaryText = currentTheme.colorTextPrimary || currentTheme.fontMainColor
  const mutedText = currentTheme.colorTextMuted || currentTheme.fontSecondColor
  const borderColor = currentTheme.newBorderColor2 || currentTheme.borderColor

  const renderPrediction = ({ item }) => (
    <Pressable
      accessibilityRole='button'
      onPress={() => handlePlaceSelect(item)}
      style={({ pressed }) => [styles.resultRow, { opacity: pressed ? 0.58 : 1 }]}
    >
      <View style={[styles.resultIcon, { backgroundColor: currentTheme.singleVendorBrandSubtle }]}> 
        <Feather name='map-pin' size={17} color={accent} />
      </View>
      <View style={styles.resultCopy}>
        <TextDefault H5 bolder numberOfLines={1} textColor={primaryText}>
          {item.mainText}
        </TextDefault>
        <TextDefault numberOfLines={2} textColor={mutedText} style={styles.resultDescription}>
          {item.description}
        </TextDefault>
      </View>
      <Feather name='chevron-right' size={18} color={currentTheme.gray400 || mutedText} />
    </Pressable>
  )

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.themeBackground }]}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: currentTheme.colorBgTertiary,
            borderColor: searchText ? accent : borderColor
          }
        ]}
      >
        <Ionicons name='search' size={21} color={searchText ? accent : mutedText} />
        <TextInput
          value={searchText}
          onChangeText={handleTextChange}
          placeholder={t('Your location')}
          placeholderTextColor={currentTheme.gray400 || mutedText}
          autoCapitalize='words'
          autoCorrect={false}
          returnKeyType='search'
          selectionColor={accent}
          style={[styles.searchInput, { color: primaryText }]}
        />
        {loading && isSearched
          ? (
          <Spinner size='small' spinnerColor={accent} />
            )
          : searchText
            ? (
          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Clear search'
            onPress={handleClearSearch}
            hitSlop={10}
            style={[styles.clearButton, { backgroundColor: currentTheme.gray300 }]}
          >
            <Feather name='x' size={14} color={currentTheme.colorTextPrimary || '#111827'} />
          </Pressable>
              )
            : null}
      </View>

      <Pressable
        accessibilityRole='button'
        onPress={() => setactiveState('map')}
        style={({ pressed }) => [
          styles.mapAction,
          { borderBottomColor: borderColor, opacity: pressed ? 0.62 : 1 }
        ]}
      >
        <View style={[styles.mapIcon, { backgroundColor: currentTheme.singleVendorBrandSubtle }]}> 
          <Feather name='map' size={20} color={accent} />
        </View>
        <View style={styles.mapCopy}>
          <TextDefault H5 bolder textColor={primaryText}>
            {t('Choose on Map')}
          </TextDefault>
          <TextDefault textColor={mutedText} style={styles.mapDescription}>
            Pin your entrance for a more accurate delivery
          </TextDefault>
        </View>
        <View style={[styles.arrowButton, { borderColor }]}>
          <Feather name='arrow-up-right' size={17} color={accent} />
        </View>
      </Pressable>

      {searchError && (
        <View style={styles.errorRow}>
          <Feather name='alert-circle' size={18} color={currentTheme.red600} />
          <TextDefault H5 textColor={currentTheme.red600} style={styles.errorText}>
            {t('Something went wrong, please try again!')}
          </TextDefault>
        </View>
      )}

      {isSearched
        ? (
        <View style={styles.resultsSection}>
          <TextDefault small bold uppercase textColor={mutedText} style={styles.sectionLabel}>
            Search results
          </TextDefault>
          <FlatList
            data={predictions}
            renderItem={renderPrediction}
            keyExtractor={(item, index) => item?.id || item?.placeId || `${index}`}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: borderColor }]} />}
            contentContainerStyle={{ paddingBottom: bottomInset + 24, flexGrow: 1 }}
            ListEmptyComponent={
              !loading
                ? (
                <View style={styles.emptyState}>
                  <View style={[styles.emptyIcon, { backgroundColor: currentTheme.colorBgTertiary }]}>
                    <Feather name='search' size={24} color={mutedText} />
                  </View>
                  <TextDefault H5 bolder textColor={primaryText}>
                    {t('noResults')}
                  </TextDefault>
                  <TextDefault center textColor={mutedText} style={styles.emptyDescription}>
                    Try a street name, building, or nearby landmark.
                  </TextDefault>
                </View>
                  )
                : null
            }
          />
        </View>
          )
        : (
        <View style={styles.idleState}>
          <View style={[styles.orbit, { borderColor }]}>
            <View style={[styles.orbitDot, { backgroundColor: accent }]} />
            <Feather name='navigation' size={24} color={accent} />
          </View>
          <TextDefault H5 bolder center textColor={primaryText}>
            Find your delivery spot
          </TextDefault>
          <TextDefault center textColor={mutedText} style={styles.idleDescription}>
            Search for an address above, or place the pin exactly where you want your order delivered.
          </TextDefault>
        </View>
          )}
    </View>
  )
}

export default SearchingAddress

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  searchContainer: {
    minHeight: 54,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 11,
    paddingVertical: 0,
    fontSize: scale(14)
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapAction: {
    minHeight: 82,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  mapIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapCopy: {
    flex: 1,
    paddingHorizontal: 13
  },
  mapDescription: {
    marginTop: 3,
    lineHeight: scale(16)
  },
  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorRow: {
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  errorText: {
    flex: 1,
    marginLeft: 9
  },
  resultsSection: {
    flex: 1,
    paddingTop: 18
  },
  sectionLabel: {
    marginBottom: 8,
    letterSpacing: 0.9
  },
  resultRow: {
    minHeight: 70,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  resultIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultCopy: {
    flex: 1,
    paddingHorizontal: 12
  },
  resultDescription: {
    marginTop: 3,
    lineHeight: scale(16)
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 50
  },
  emptyState: {
    flex: 1,
    minHeight: 230,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  emptyDescription: {
    marginTop: 6,
    lineHeight: scale(17)
  },
  idleState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
    paddingBottom: 70
  },
  orbit: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    transform: [{ rotate: '-8deg' }]
  },
  orbitDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 3,
    right: 9
  },
  idleDescription: {
    marginTop: 7,
    lineHeight: scale(18)
  }
})
