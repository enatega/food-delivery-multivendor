import React, { useContext } from 'react'
import { ScrollView, View, TouchableOpacity, FlatList } from 'react-native'
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
  const currentTheme = {isRTL : i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}

  const handleValueSelection = (filterTitle, filterValue) => {
    const selectedFilter = filters[filterTitle]
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
    setFilters({ ...filters, [filterTitle]: selectedFilter })
  }

  return (
    <View style={styles().container}>
      <TextDefault H2 bolder style={styles().heading} isRTL>
        {t('filters')}
      </TextDefault>
      {Object.keys(filters).map((filter, index) => (
        <View style={{ gap: 12 }}key={'filters-'+filter+index} >
          <TextDefault H4 bolder style={{ paddingHorizontal: 15}} isRTL>
            {t(filter)}
          </TextDefault>
          {filter === 'Cuisines' ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              directionalLockEnabled={true}
              alwaysBounceVertical={false}
            >
              <FlatList
                contentContainerStyle={styles().flatlist}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                numColumns={Math.ceil(filters[filter].values.length / 3)}
                data={filters[filter].values}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleValueSelection(filter, item)}
                      style={[
                        styles().filterBtn,
                        {
                          borderColor: filters[filter].selected.includes(item)
                            ? currentTheme.main
                            : currentTheme.color7,
  
                          backgroundColor: filters[filter].selected.includes(item)
                            ? currentTheme.main
                            : currentTheme.color1
                        }
                      ]}
                    >
                      <TextDefault
                        Normal
                        bolder
                        textColor={
                          filters[filter].selected.includes(item)
                            ? currentTheme.white
                            : currentTheme.fontMainColor
                        }
                      >
                        {item}
                      </TextDefault>
                    </TouchableOpacity>
                  )
                }}
              />
            </ScrollView>
          ) : (
            <FlatList
              contentContainerStyle={styles().flatlist}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal
              data={filters[filter].values}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleValueSelection(filter, item)}
                    style={[
                      styles().filterBtn,
                      {
                        borderColor: filters[filter].selected.includes(item)
                          ? currentTheme.main
                          : currentTheme.color7,

                        backgroundColor: filters[filter].selected.includes(item)
                          ? currentTheme.main
                          : currentTheme.color1
                      }
                    ]}
                  >
                    <TextDefault
                      Normal
                      bolder
                      textColor={
                        filters[filter].selected.includes(item)
                          ? currentTheme.white
                          : currentTheme.fontMainColor
                      }
                    >
                      {t(item)}
                    </TextDefault>
                  </TouchableOpacity>
                )
              }}
            />
          )}
          <View style={{ height: 1, backgroundColor: '#D1D5DB' }} />
        </View>
      ))}
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
        name='x-circle'
        size={24}
        color={currentTheme.newIconColor}
        style={styles(currentTheme).closeBtn}
        onPress={onClose}
      />
    </View>
  )
}

export default Filters
