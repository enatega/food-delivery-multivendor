import React, { useContext, useMemo } from 'react'
import { ScrollView, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FILTER_TYPE } from '../../utils/enums'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import useMultivendorTheme from '../../ui/designSystem/useMultivendorTheme'

const cloneFiltersState = (filters = {}) =>
  Object.keys(filters).reduce((acc, key) => {
    const filter = filters[key] || {}
    acc[key] = {
      ...filter,
      values: Array.isArray(filter.values) ? [...filter.values] : [],
      selected: Array.isArray(filter.selected) ? [...filter.selected] : []
    }
    return acc
  }, {})

const Filters = ({ filters, setFilters, applyFilters, onClose }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const { tokens } = useMultivendorTheme()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue],
    ...tokens
  }

  const safeFilters = useMemo(() => {
    return cloneFiltersState(filters)
  }, [filters])

  const handleValueSelection = (filterTitle, filterValue) => {
    const nextFilters = cloneFiltersState(safeFilters)
    const selectedFilter = nextFilters[filterTitle]
    if (selectedFilter.type === FILTER_TYPE.RADIO) {
      selectedFilter.selected = [filterValue]
    } else {
      const index = selectedFilter.selected.indexOf(filterValue)
      if (index > -1) {
        selectedFilter.selected = selectedFilter.selected.filter(
          (a) => a !== filterValue
        )
      } else selectedFilter.selected = [...selectedFilter.selected, filterValue]
    }
    setFilters(nextFilters)
  }

  const clearFilters = () => {
    const cleared = Object.keys(safeFilters).reduce((acc, key) => {
      acc[key] = { ...safeFilters[key], selected: [] }
      return acc
    }, {})
    setFilters(cleared)
    applyFilters(cleared)
  }

  const anySelected = Object.values(safeFilters).some((f) => (f.selected || []).length > 0)

  return (
    <ScrollView
      style={styles(currentTheme).container}
      contentContainerStyle={styles(currentTheme).contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles(currentTheme).headerRow}>
        <TextDefault H3 bold textColor={currentTheme.colors.textPrimary} isRTL>
          {t('filters')}
        </TextDefault>
        <TouchableOpacity
          accessibilityRole='button'
          accessibilityLabel={t('close')}
          activeOpacity={0.7}
          style={styles(currentTheme).closeBtn}
          onPress={onClose}
        >
          <Feather name='x' size={20} color={currentTheme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {Object.keys(safeFilters).map((filter, index) => (
        <View style={styles(currentTheme).filterSection} key={'filters-' + filter + index}>
          <TextDefault H5 bold textColor={currentTheme.colors.textPrimary} style={styles(currentTheme).sectionTitle} isRTL>
            {t(filter)}
          </TextDefault>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles(currentTheme).flatlist}
          >
            {safeFilters[filter].values.map((item, idx) => (
              <TouchableOpacity
                key={item + idx}
                activeOpacity={0.8}
                onPress={() => handleValueSelection(filter, item)}
                style={[
                  styles(currentTheme).filterBtn,
                  safeFilters[filter].selected.includes(item) && styles(currentTheme).filterBtnSelected
                ]}
              >
                <TextDefault
                  Normal
                  bold
                  textColor={
                    safeFilters[filter].selected.includes(item)
                      ? currentTheme.colors.accent
                      : currentTheme.colors.textSecondary
                  }
                >
                  {t(item)}
                </TextDefault>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {index < Object.keys(safeFilters).length - 1 && (
            <View style={styles(currentTheme).divider} />
          )}
        </View>
      ))}

      <View style={styles(currentTheme).actions}>
        {anySelected && (
          <TouchableOpacity
            style={styles(currentTheme).clearBtn}
            activeOpacity={0.7}
            onPress={clearFilters}
          >
            <TextDefault center bold textColor={currentTheme.colors.accent}>
              {t('clearAll', 'Clear all')}
            </TextDefault>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles(currentTheme).applyBtn}
          activeOpacity={0.8}
          onPress={() => applyFilters(safeFilters)}
        >
          <TextDefault center bold H4 textColor={currentTheme.colors.textOnAccent}>
            {t('apply')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Filters
