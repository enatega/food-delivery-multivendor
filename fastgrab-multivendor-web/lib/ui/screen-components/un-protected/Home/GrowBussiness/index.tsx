// libraries
import React from 'react'

// component
import MoveableCard from '@/lib/ui/useable-components/Moveable-Card'
import TranparentButton from '@/lib/ui/useable-components/Home-Buttons/TranparentButton'

//images 
import Banner3 from '@/public/assets/images/png/Banner3.png'
import { useTranslations } from 'next-intl'

const GrowBussiness:React.FC = () => {
  const t = useTranslations();
  const growButon=<TranparentButton text={t("get_started_btn")} link='restaurantInfo'/>
  return (
    <div className='w-full'>
        <MoveableCard 
        image={Banner3}
        heading={t('MoveableCardHomeScreen.title3')}
        subText={t('MoveableCardHomeScreen.subText3')}
        middle={true}
        button={growButon}
        />
    </div>
  )
}

export default GrowBussiness
