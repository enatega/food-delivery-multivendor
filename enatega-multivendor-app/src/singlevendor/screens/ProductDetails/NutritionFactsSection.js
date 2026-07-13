import React from 'react'
import { View, StyleSheet } from 'react-native'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const NutritionFactsSection = ({
  t,
  currentTheme,
  nutritionDetail,
  nutritions = [],
  usage,
  ingredients
}) => {
  const hasNutritionDetail = nutritionDetail != null && String(nutritionDetail).trim() !== ''
  const hasNutritions = Array.isArray(nutritions) && nutritions.length > 0
  const hasUsage = usage != null && (typeof usage === 'string' ? usage.trim() !== '' : (Array.isArray(usage) && usage.length > 0))
  const usageText = typeof usage === 'string' ? usage : (Array.isArray(usage) ? usage.join(', ') : '')
  const hasIngredients = ingredients != null && (typeof ingredients === 'string' ? ingredients.trim() !== '' : (Array.isArray(ingredients) && ingredients.length > 0))
  const ingredientsText = typeof ingredients === 'string' ? ingredients : (Array.isArray(ingredients) ? ingredients.join(', ') : '')

  const hasAny = hasNutritionDetail || hasNutritions || hasUsage || hasIngredients
  if (!hasAny) return null

  const borderStyle = {
    borderWidth: 1,
    borderColor: currentTheme?.borderColor ?? '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  }

  return (
    <View style={[styles.container, { paddingHorizontal: 15 }]}>
      <TextDefault bold H4 style={styles.title}>
        {t('Nutrition facts')}
      </TextDefault>

      {(hasNutritionDetail || hasNutritions) && (
        <View style={styles.section}>
          {hasNutritionDetail && (
            <View style={[styles.detailBox, borderStyle]}>
              <TextDefault H5 textColor={currentTheme?.colorTextMuted ?? '#666'}>
                {nutritionDetail}
              </TextDefault>
            </View>
          )}

          {hasNutritions && (
            <View style={styles.nutritionList}>
              {nutritions.map((item, index) => {
                const name = item?.name != null ? String(item.name) : ''
                const quantity = item?.quantity != null ? String(item.quantity) : ''
                if (name === '' && quantity === '') return null
                return (
                  <View key={`nutrition-${index}`} style={[styles.nutritionRow, { marginTop: index === 0 ? 0 : 10 }]}>
                    <View style={[styles.nutritionInputBox, borderStyle, styles.nameBox]}>
                      <TextDefault H5 numberOfLines={1}>
                        {name}
                      </TextDefault>
                    </View>
                    <View style={[styles.nutritionInputBox, borderStyle, styles.quantityBox]}>
                      <TextDefault H5 textColor={currentTheme?.colorTextMuted ?? '#666'} numberOfLines={1}>
                        {quantity}
                      </TextDefault>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      )}

      {hasUsage && (
        <View style={[styles.extraSection, { marginTop: 16 }]}>
          <TextDefault bold H5 style={styles.subTitle}>
            {t('Usage')}
          </TextDefault>
          <View style={[styles.detailBox, borderStyle, { marginTop: 8 }]}>
            <TextDefault H5 textColor={currentTheme?.colorTextMuted ?? '#666'}>
              {usageText}
            </TextDefault>
          </View>
        </View>
      )}

      {hasIngredients && (
        <View style={[styles.extraSection, { marginTop: 16 }]}>
          <TextDefault bold H5 style={styles.subTitle}>
            {t('Ingredients')}
          </TextDefault>
          <View style={[styles.detailBox, borderStyle, { marginTop: 8 }]}>
            <TextDefault H5 textColor={currentTheme?.colorTextMuted ?? '#666'}>
              {ingredientsText}
            </TextDefault>
          </View>
        </View>
      )}

      <View style={{ borderWidth: 1, borderColor: currentTheme?.borderColor ?? '#E0E0E0', marginTop: 16 }} />
    </View>
  )
}

export default NutritionFactsSection

const styles = StyleSheet.create({
  container: {
    gap: 5,
    paddingVertical: 4
  },
  title: {
    marginBottom: 4
  },
  section: {
    marginTop: 12
  },
  detailBox: {
    minHeight: 40,
    justifyContent: 'center'
  },
  nutritionList: {
    marginTop: 12
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  nutritionInputBox: {
    minHeight: 40,
    justifyContent: 'center'
  },
  nameBox: {
    flex: 1
  },
  quantityBox: {
    flex: 1
  },
  extraSection: {},
  subTitle: {
    marginBottom: 0
  }
})
