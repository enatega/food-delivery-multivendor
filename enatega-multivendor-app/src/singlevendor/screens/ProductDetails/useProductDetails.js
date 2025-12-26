import { useQuery } from '@apollo/client'
import { GET_FOOD_DETAILS } from '../../apollo/queries'
import { useContext } from 'react'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'

const useProductDetails = ({ foodId }) => {
  // Todo: need to fix variations related data.
  const { data, loading, error } = useQuery(GET_FOOD_DETAILS, {
    variables: { foodId }
  })
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const productInfoData = {
    image: data?.getFoodDetails?.image,
    title: data?.getFoodDetails?.title,
    description: data?.getFoodDetails?.description,
    isPopular: data?.getFoodDetails?.isPopular,
    // Todo: need to change this price, according to variations.
    price: data?.getFoodDetails?.variations[0].price
  }

  const productOtherDetails = {
    description: data?.getFoodDetails?.description,
  }
  return { data, loading, error, currentTheme, t, productInfoData, productOtherDetails }
}

export default useProductDetails
