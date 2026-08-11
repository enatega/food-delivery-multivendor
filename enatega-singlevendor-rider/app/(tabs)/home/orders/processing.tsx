// Components
import HomeProcessingOrdersMain from '@/lib/ui/screen-components/home/orders/main/processing-orders'

// Hooks
import { useTranslation } from 'react-i18next'

export default function HomeScreen() {
  // Hooks
  const { t } = useTranslation()
  return (
    <HomeProcessingOrdersMain
      route={{ key: 'processing', title: t('Processing Orders') }}
    />
  )
}
