import React from 'react'
import Image from 'next/image'
import { sideCardProps } from '@/lib/utils/interfaces/Rider-restaurant.interface'

const SideCard:React.FC<sideCardProps> = ({image,heading,subHeading,right=true}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 p-2 justify-center items-center gap-6'>
      <div className={`h-100% ${right== true ? 'order-2' : 'order-1'} `}>
        <h1 className='text-[40px] font-bold my-6 leading-tight'>{heading}</h1>
        <p className='font-medium text-[#717173] text-justify'>{subHeading} </p>
      </div>
      <div className='order-1 md:p-4 w-full h-[400px]'>
      <div className='h-[400px] relative '>
          <Image src={image} alt={"image"} fill className='object-cover rounded-lg'/>
      </div>
      </div>
    </div>
  )
}

export default SideCard
