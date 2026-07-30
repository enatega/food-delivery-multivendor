import React, { useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

const OptionList = ({
  title,
  subtitle,
  list = [],
  isVariation = false,
  selectedIds = [],
  onChange,
  t
}) => {
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const themedStyles = styles(currentTheme)

  const onPressItem = (id) => {
    if (isVariation) {
      // Radio selection
      onChange([id], id)
    } else {
      // Checkbox selection
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter(x => x !== id), id)
      } else {
        onChange([...selectedIds, id], id)
      }
    }
  }

  const renderItem = ({ item }) => {
    const selected = selectedIds.includes(item.id)

    return (
      <TouchableOpacity
        style={themedStyles.row}
        onPress={() => onPressItem(item.id)}
        activeOpacity={0.7}
      >
        {/* Radio / Checkbox */}
        <View style={[themedStyles.selector, selected && themedStyles.selected]}>
          {isVariation && selected && <View style={themedStyles.innerDot} />}
          {!isVariation && selected && <Text style={themedStyles.check}>✓</Text>}
        </View>

        {/* Title */}
        <View style={themedStyles.textContainer}>
          <Text style={themedStyles.title}>{item.title}</Text>
          {item.isPopular && (
            <Text style={themedStyles.badge}>
              {t?.('Popular') || 'Popular'}
            </Text>
          )}
        </View>

        {/* Price */}
        {item.price !== undefined && (
          <Text style={themedStyles.price}>
            {item.price} {configuration?.currencySymbol}
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.headerTitle}>{title}</Text>
        {subtitle && <Text style={themedStyles.subtitle}>{subtitle}</Text>}
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  )
}

export default OptionList

const styles = currentTheme =>
  StyleSheet.create({
    container: {
      marginVertical: 0,
      paddingHorizontal: 15
    },
    header: {
      marginBottom: 8
    },
    headerTitle: {
      color: currentTheme.fontMainColor,
      fontSize: 18,
      fontWeight: '600'
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: currentTheme.secondaryText,
      marginTop: 12
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6
    },
    selector: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: currentTheme.secondaryText,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12
    },
    selected: {
      borderColor: currentTheme.primaryBlue || '#007AFF'
    },
    innerDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: currentTheme.primaryBlue || '#007AFF'
    },
    check: {
      color: currentTheme.primaryBlue || '#007AFF',
      fontSize: 14,
      fontWeight: '700'
    },
    textContainer: {
      flex: 1
    },
    title: {
      color: currentTheme.fontMainColor,
      fontSize: 15,
      fontWeight: '500'
    },
    badge: {
      fontSize: 12,
      color: currentTheme.primaryBlue || '#007AFF',
      marginTop: 2
    },
    price: {
      color: currentTheme.fontMainColor,
      fontWeight: '600'
    }
  })
