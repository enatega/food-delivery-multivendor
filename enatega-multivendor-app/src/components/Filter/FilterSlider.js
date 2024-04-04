import React, { useState, useContext } from 'react'
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Modal,
  SafeAreaView
} from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import CheckboxBtn from '../../ui/FdCheckbox/CheckboxBtn'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'
import TextDefault from '../Text/TextDefault/TextDefault'
import styles from './styles'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FILTER_TYPE } from '../../utils/enums'
import { useTranslation } from 'react-i18next'

const Filters = ({ filters, setFilters, applyFilters }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const { t } = useTranslation()
  const result =
    filters &&
    Object.keys(filters).filter((k) =>
      selectedFilter === 'all'
        ? filters[k]
        : selectedFilter === k
          ? filters[k]
          : null
    )

  const handleOptionsClick = () => {
    setSelectedFilter('all')
    setModalVisible(true)
  }

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter)
    setModalVisible(true)
  }

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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles(currentTheme).container}
    >
      <TouchableOpacity
        style={styles(currentTheme).filterButton}
        onPress={handleOptionsClick}
      >
        <Ionicons name='options' size={24} color={currentTheme.black} />
      </TouchableOpacity>

      {filters &&
        Object.keys(filters)?.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles(currentTheme).filterButton,
              selectedFilter === filter &&
                styles(currentTheme).selectedFilterButton
            ]}
            onPress={() => handleFilterClick(filter)}
          >
            <SafeAreaView style={styles(currentTheme).itemContainer}>
              <TextDefault textColor={currentTheme.black} style={styles(currentTheme).filterButtonText}>
                {t(filter)}
              </TextDefault>
              <AntDesign name='down' size={14} color={currentTheme.black}/>
            </SafeAreaView>
          </TouchableOpacity>
        ))}

      <Modal visible={modalVisible} adjustToContentHeight animationType='slide'>
        <View style={styles(currentTheme).modalHeader}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <AntDesign name='arrowleft' size={24} color={currentTheme.newIconColor} />
          </TouchableOpacity>
          <Text style={styles(currentTheme).filterText}> {t('filters')}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <AntDesign name='closecircleo' size={24} color={currentTheme.newIconColor}  />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles(currentTheme).modalContainer}>
          {result?.map((filterValue) => (
            <View key={filterValue}>
              <TextDefault style={styles(currentTheme).modalTitle} textColor={currentTheme.newFontcolor}>
                {t(filterValue)}
              </TextDefault>
              <View>
                {filters &&
                  filters[filterValue]?.values?.map((value, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        {
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        },
                        styles(currentTheme).modalItem,
                        filters[filterValue].selected === value &&
                          styles(currentTheme).selectedModalItem
                      ]}
                      onPress={() => handleValueSelection(filterValue, value)}
                    >
                      <TextDefault style={styles(currentTheme).modalItemText} textColor={currentTheme.newFontcolor}>
                        {t(value)}
                      </TextDefault>
                      {filters &&
                      filters[filterValue].type === FILTER_TYPE.CHECKBOX ? (
                        <CheckboxBtn
                          checked={filters[filterValue].selected.includes(
                            value
                          )}
                          onPress={() =>
                            handleValueSelection(filterValue, value)
                          }
                        />
                      ) : (
                        <RadioButton
                          size={12}
                          innerColor={currentTheme.main}
                          outerColor={currentTheme.iconColorDark}
                          isSelected={filters[filterValue].selected.includes(
                            value
                          )}
                          onPress={() =>
                            handleValueSelection(filterValue, value)
                          }
                        />
                      )}
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false)
              applyFilters && applyFilters()
            }}
            activeOpacity={0.5}
            style={styles(currentTheme).saveBtnContainer}
          >
            <TextDefault textColor={'black'} H4 bold>
              {t('apply')}
            </TextDefault>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  )
}

export default Filters
