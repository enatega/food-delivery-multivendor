import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import CheckComponent from '../../components/CustomizeComponents/CheckComponent/CheckComponent'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import RadioComponent from '../../components/CustomizeComponents/RadioComponent/RadioComponent'
import { useTranslation } from 'react-i18next'
import useMultivendorTheme from '../../ui/designSystem/useMultivendorTheme'

export default function Options({ addon, onSelectOption, addonRefs, selectedAddons }) {
  const ref = useRef(null)
  const { t } = useTranslation()
  const { tokens } = useMultivendorTheme()

  useEffect(() => {
    if (addon.error && ref.current && addon._id) {
      addonRefs.current[addon._id] = ref.current
    }
  }, [addon.error])

  const selectedAddon = selectedAddons?.find((selected) => selected._id === addon._id)

  if (addon?.quantityMinimum === 1 && addon?.quantityMaximum === 1) {
    return (
            <View
                ref={ref}
                onLayout={() => addon.error}
            >
                <RadioComponent
                    options={addon?.options}
                    onPress={onSelectOption.bind(this, addon)}
                    selected={selectedAddon?.options?.[0]}
                />
                {addon.error && (
                    <TextDefault small textColor={tokens.colors.danger} isRTL>
                        {t('selectOptionforAddon')}
                    </TextDefault>
                )}
            </View>
    )
  } else {
    return (
            <View
                ref={ref}
                onLayout={() => addon.error}
            >
                <CheckComponent
                    options={addon?.options}
                    onPress={onSelectOption.bind(this, addon)}
                    selected={selectedAddon?.options}
                />
                {addon.error && (
                    <TextDefault small textColor={tokens.colors.danger} isRTL>
                        {t('selectOptionforAddon')}
                    </TextDefault>
                )}
            </View>
    )
  }
}
