import { useContext, useEffect, useRef } from "react"
import { View } from "react-native"
import CheckComponent from "../../components/CustomizeComponents/CheckComponent/CheckComponent"
import TextDefault from "../../components/Text/TextDefault/TextDefault"
import RadioComponent from "../../components/CustomizeComponents/RadioComponent/RadioComponent"
import ThemeContext from "../../ui/ThemeContext/ThemeContext"
import { useTranslation } from "react-i18next"
import { theme } from "../../utils/themeColors"

export default function Options({ addon, onSelectOption, addonRefs }) {
    const ref = useRef(null)
    const { t, i18n } = useTranslation()
    const themeContext = useContext(ThemeContext)
    const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

    useEffect(() => {
        if (addon.error && ref.current && addon._id) {
            addonRefs.current[addon._id] = ref.current
        }
    }, [addon.error])


    if (addon?.quantityMinimum === 1 && addon?.quantityMaximum === 1) {
        return (
            <View
                ref={ref}
                onLayout={() => addon.error}
            >
                <RadioComponent
                    options={addon?.options}
                    onPress={onSelectOption.bind(this, addon)}
                />
                {addon.error && (
                    <TextDefault small textColor={currentTheme?.textErrorColor} isRTL>
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
                />
                {addon.error && (
                    <TextDefault small textColor={currentTheme.textErrorColor} isRTL>
                        {t('selectOptionforAddon')}
                    </TextDefault>
                )}
            </View>
        )
    }
}