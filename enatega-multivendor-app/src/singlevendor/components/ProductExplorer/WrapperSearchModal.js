import { View, Text } from 'react-native'
import React from 'react'
import SearchModal from './SearchModal'

const WrapperSearchModal = ({ visible, onClose, items = [],  categoryId = null }) => {

    console.log("wrapper Search Modal:",visible)

  return visible ? <SearchModal visible={visible} onClose={onClose} items={items} isPaginated={true} categoryId={categoryId}/> : <></>
}

export default WrapperSearchModal
