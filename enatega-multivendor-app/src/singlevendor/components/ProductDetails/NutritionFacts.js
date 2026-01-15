import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const NutritionFacts = ({ t, title, currentTheme, productOtherDetails }) => {
  return (
    <View style={{ gap: 5, paddingVertical: 4, paddingHorizontal: 15 }}>
      <TextDefault bold H4>
        {t(title)}
      </TextDefault>

      <View style={{ gap: 16, marginTop:4 }}>
        <TextDefault H5 bold textColor={currentTheme.colorTextMuted}>
          {productOtherDetails.size}
        </TextDefault>

        <View style={[styles.flex]}>
          <TextDefault H5 bold>
            {t('Energy')}
          </TextDefault>
          <TextDefault H5 bold textColor={currentTheme.colorTextMuted}>
            {productOtherDetails.energy}
          </TextDefault>
        </View>

        <View style={[styles.flex]}>
          <TextDefault H5 bold>
            {t('Fat')}
          </TextDefault>
          <TextDefault H5 bold textColor={currentTheme.colorTextMuted}>
            {productOtherDetails.fat}
          </TextDefault>
        </View>

        <View style={[styles.flex]}>
          <TextDefault H5 bold>
            {t('Carbohydrates')}
          </TextDefault>
          <TextDefault H5 bold textColor={currentTheme.colorTextMuted}>
            {productOtherDetails.carbohydrates}
          </TextDefault>
        </View>

        <View style={[styles.flex]}>
          <TextDefault H5 bold>
            {t('Protein')}
          </TextDefault>
          <TextDefault H5 bold textColor={currentTheme.colorTextMuted}>
            {productOtherDetails.protein}
          </TextDefault>
        </View>

        <View style={[styles.flex]}>
          <TextDefault H5 bold>
            {t('Sugar')}
          </TextDefault>
          <TextDefault H5 bold textColor={currentTheme.colorTextMuted}>
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
