'use client'

import React from 'react'
import MoveableCard from '../Moveable-Card'
import { StaticImageData } from 'next/image'

interface HomeCardProps{
image:string | StaticImageData,
heading?:string,
subText?:string,
link?:string,
}


const HomeCard:React.FC<HomeCardProps> = ({image,heading,subText,link}) => {

   function navigate()
   {
    window.open(link, "_blank");
   }

  return (
    <div className="flex h-full flex-col">
      <MoveableCard image={image} height={"320px"} imageFit="contain" />
      <div className='my-8'>
        <h1 className='font-extrabold text-[22px] my-2 dark:text-white'>{heading}</h1>
        <button onClick={navigate} className='text-secondary-color hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color focus-visible:ring-offset-2 dark:text-primary-color cursor-pointer'>{subText}</button>
      </div>
    </div>
  )
}

export default HomeCard
