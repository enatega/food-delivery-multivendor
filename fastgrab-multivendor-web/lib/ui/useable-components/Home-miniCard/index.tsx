import React from 'react'
import Image from 'next/image'
import { HomeMiniCardProps } from '@/lib/utils/interfaces/Home-interfaces'


const HomeMiniCard:React.FC<HomeMiniCardProps> = ({image,heading,subText,headingColor,backColor}) => {
  return (
    <div className='h-[400px] flex justify-center items-center flex-col bg-green-100 rounded-3xl '
    style={{backgroundColor:backColor}}
    >
      <div className='w-[300px] mx-auto flex flex-col items-center justify-between'>
      <Image
      src={image}
      width={200}
      height={200}
      alt="Image"
      />
      <div className='text-center my-[30px] '>
        <h1 className="font-extrabold text-[25px] my-2 "
        style={{color:headingColor}}
        
        >{heading}</h1>
        <p className='font-light'>{subText}</p>
      </div>
      </div>
    </div>
  )
}

export default HomeMiniCard
