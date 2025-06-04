

import { StaticImageData } from 'next/image'
import React from 'react'
interface StratingImageProps {
image:string | StaticImageData
}

import  Image  from 'next/image'

const StartingImage:React.FC<StratingImageProps> = ({image}) => {
  return (
    <div className='w-full h-[200px] md:h-[500px]'>
      <Image src={image} alt={"banner Image"}  className='w-full h-full  object-cover md:object-contain' />
    </div>
  )
}

export default StartingImage
