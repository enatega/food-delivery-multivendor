import React from 'react'

interface WhyChooseProps {
  heading: string,
  subHeading: string,
}

const WhyChoose: React.FC<WhyChooseProps> = ({ heading, subHeading }) => {
  return (
    <div className='flex justify-center items-center flex-col md:w-[75%] w-[85%] mx-auto my-[80px] dark:text-gray-200'>
      <h1 className='md:text-4xl text-2xl font-semibold  leading-tight mb-[40px] text-center '>{heading}</h1>
      <h2 className='md:text-xl text-lg text-[#717173] w-[100%] md:w-[80%] font-normal text-center'>{subHeading}</h2>
    </div>
  )
}

export default WhyChoose
