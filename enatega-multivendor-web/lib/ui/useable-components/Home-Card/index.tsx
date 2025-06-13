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
    <div>
      <MoveableCard image={image} height={"320px"}/>
      <div className='my-8'>
        <h1 className='font-extrabold text-[22px] my-2'>{heading}</h1>
        <button onClick={navigate} className='text-[#03c3e8] cursor-pointer'>{subText}</button>
      </div>
    </div>
  )
}

export default HomeCard
