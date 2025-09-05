import React from 'react'

interface HeadingProps {
  heading: string,
  subHeading?: string,
}

const Heading: React.FC<HeadingProps> = ({ heading, subHeading }) => {
  return (
    <div className='flex justify-center items-center p-5 w-full flex-col my-[30px] '>
      <h1 className='text-[36px] md:text-[48px] font-bold text-center text-[#5AC12F] leading-tight md:w-[60%] w-[100%] mx-auto'>{heading}</h1>
      <h3 className='text-[#556273] text-[22px] text-center my-[10px] dark:text-gray-200'>{subHeading}</h3>
    </div>
  )
}

export default Heading
