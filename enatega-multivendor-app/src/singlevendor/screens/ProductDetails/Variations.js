import { View, Text } from 'react-native'
import React from 'react'
import OptionList from './OptionsList'

const Variations = ({ variations ,selectedVariationId,setSelectedVariationId,setSelectedAddonIds, t}) => {
  return (
    variations &&
    variations.length > 1 && (
      <OptionList
        t={t}
        title='Choose Your Variation'
        subtitle='Select one'
        list={variations}
        isVariation
        selectedIds={selectedVariationId}
        onChange={(ids) => {
          setSelectedVariationId(ids)
          setSelectedAddonIds([])
        }}
      />
    )
  )
}

export default Variations
