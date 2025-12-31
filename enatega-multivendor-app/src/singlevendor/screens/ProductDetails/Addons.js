import { View, Text } from 'react-native'
import React from 'react'
import OptionList from './OptionsList'

const Addons = ({ selectedVariation ,selectedAddonIds, setSelectedAddonIds}) => {
  return selectedVariation?.addons?.map((addon) => <OptionList key={addon.id} title={addon.title} subtitle='Optional' list={addon.options} selectedIds={selectedAddonIds} onChange={setSelectedAddonIds} />)
}

export default Addons
