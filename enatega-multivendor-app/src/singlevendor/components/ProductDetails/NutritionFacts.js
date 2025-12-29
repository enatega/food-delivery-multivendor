import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const NutritionFacts = ({ t, title, currentTheme, productOtherDetails }) => {
  return (
    <View style={{ gap: 5, paddingVertical: 12, paddingHorizontal: 15 }}>
      <TextDefault bolder H4>
        {t(title)}
      </TextDefault>

      <View style={{ gap: 8 }}>
        <TextDefault H5 bold textColor={currentTheme.colorRextMuted}>
          {productOtherDetails.size}
        </TextDefault>

        <View style={[styles.flex]}>
          <TextDefault H5 bold>
            {t('Energy')}
          </TextDefault>
          <TextDefault H5 bold textColor={currentTheme.colorRextMuted}>
            {productOtherDetails.energy}
          </TextDefault>
        </View>

        <View style={[styles.flex]}>
          <TextDefault H5 bold>
            {t('Fat')}
          </TextDefault>
          <TextDefault H5 bold textColor={currentTheme.colorRextMuted}>
            {productOtherDetails.fat}
          </TextDefault>
        </View>

        <View style={[styles.flex]}>
          <TextDefault H5 bold>
            {t('Carbohydrates')}
          </TextDefault>
          <TextDefault H5 bold textColor={currentTheme.colorRextMuted}>
            {productOtherDetails.carbohydrates}
          </TextDefault>
        </View>

        <View style={[styles.flex]}>
          <TextDefault H5 bold>
            {t('Protein')}
          </TextDefault>
          <TextDefault H5 bold textColor={currentTheme.colorRextMuted}>
            {productOtherDetails.protein}
          </TextDefault>
        </View>

        <View style={[styles.flex]}>
          <TextDefault H5 bold>
            {t('Sugar')}
          </TextDefault>
          <TextDefault H5 bold textColor={currentTheme.colorRextMuted}>
            {productOtherDetails.sugar}
          </TextDefault>
        </View>
      </View>
    </View>
  )
}

export default NutritionFacts

const styles = StyleSheet.create({
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  }
})
