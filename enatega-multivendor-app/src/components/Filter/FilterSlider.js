import React, { useContext, useMemo } from 'react'
import { ScrollView, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FILTER_TYPE } from '../../utils/enums'
import styles from './styles'
import { useTranslation } from 'react-i18next'


const Filters = ({ filters, setFilters, applyFilters, onClose }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const safeFilters = useMemo(() => {
    return Object.keys(filters || {}).reduce((acc, key) => {
      const filter = filters?.[key] || {}
      acc[key] = {
        ...filter,
        values: Array.isArray(filter.values) ? filter.values : [],
        selected: Array.isArray(filter.selected) ? filter.selected : []
      }
      return acc
    }, {})
  }, [filters])

  const handleValueSelection = (filterTitle, filterValue) => {
    const selectedFilter = safeFilters[filterTitle]
    if (selectedFilter.type === FILTER_TYPE.RADIO) {
      selectedFilter.selected = [filterValue]
    } else {
      const index = selectedFilter.selected.indexOf(filterValue)
      if (index > -1) {
        selectedFilter.selected = selectedFilter.selected.filter(
          (a) => a !== filterValue
        )
      } else selectedFilter.selected.push(filterValue)
    }
    setFilters({ ...safeFilters, [filterTitle]: { ...selectedFilter } })
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
  <ScrollView style={styles().container}>
    <TextDefault H2 bolder style={styles().heading} isRTL>
      {t('filters')}
    </TextDefault>

    {Object.keys(safeFilters).map((filter, index) => (
      <View style={{ gap: 8 }} key={'filters-' + filter + index}>
        <TextDefault H4 bolder style={{ paddingHorizontal: 15, paddingVertical: 10 }} isRTL>
          {t(filter)}
        </TextDefault>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles().flatlist}
        >
          {safeFilters[filter].values.map((item, idx) => (
            <TouchableOpacity
              key={item + idx}
              activeOpacity={0.8}
              onPress={() => handleValueSelection(filter, item)}
              style={[
                styles().filterBtn,
                {
                  borderColor: safeFilters[filter].selected.includes(item)
                    ? currentTheme.main
                    : currentTheme.color7,
                  backgroundColor: safeFilters[filter].selected.includes(item)
                    ? currentTheme.main
                    : currentTheme.color1
                }
              ]}
            >
              <TextDefault
                Normal
                bolder
                textColor={
                  safeFilters[filter].selected.includes(item)
                    ? currentTheme.white
                    : currentTheme.fontMainColor
                }
              >
                {t(item)}
              </TextDefault>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 10 }}  />
      </View>
    ))}

    {anySelected && (
      <TouchableOpacity
        style={styles(currentTheme).clearBtn}
        activeOpacity={0.8}
        onPress={clearFilters}
      >
        <TextDefault center bold H4 textColor={currentTheme.main}>
          {t('clearAll', 'Clear all')}
        </TextDefault>
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={styles(currentTheme).applyBtn}
      activeOpacity={0.8}
      onPress={applyFilters}
    >
      <TextDefault center bold H4 textColor={currentTheme.black}>
        {t('apply')}
      </TextDefault>
    </TouchableOpacity>

    <Feather
      name="x-circle"
      size={24}
      color={currentTheme.newIconColor}
      style={styles(currentTheme).closeBtn}
      onPress={onClose}
    />
  </ScrollView>
)
}

export default Filters
