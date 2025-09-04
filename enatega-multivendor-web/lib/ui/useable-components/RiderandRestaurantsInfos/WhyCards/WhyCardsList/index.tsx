import React from 'react'
import Card from '../Card'
import { Cards, WhyCardsListProps } from '@/lib/utils/interfaces/Rider-restaurant.interface'
import { useTranslations } from 'next-intl'



const WhyCardsList: React.FC<WhyCardsListProps> = ({ cards }) => {
  const t = useTranslations()
  return (
    <>
      <h1 className='w-full text-center md:text-4xl text-2xl font-semibold  my-[25px] dark:text-gray-200'>{t('why_partner_with_us')}</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-[90%] mx-auto my-1 gap-6 '>
        {cards.map((item: Cards) => {
          return <Card key={item.heading} image={item.image} heading={item.heading} text={item.text} color={item.color} />
        })}
      </div>
    </>
  )
}

export default WhyCardsList
