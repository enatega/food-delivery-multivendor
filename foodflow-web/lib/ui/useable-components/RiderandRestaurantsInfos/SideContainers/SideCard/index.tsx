import React from 'react'
import SideCard from '../card'
import { sideCardList } from '@/lib/utils/interfaces/Rider-restaurant.interface'

const SideContainers:React.FC<sideCardList> = ({sideCards}) => {
  return (
    <div className='w-[90%] mx-auto my-[30px]'>

      {sideCards?.map((item)=>
      {
       return <SideCard key={item.heading} image={item.image} heading={item.heading} subHeading={item.subHeading} right={item.right}/>
      })}
      
    </div>
  )
}

export default SideContainers
