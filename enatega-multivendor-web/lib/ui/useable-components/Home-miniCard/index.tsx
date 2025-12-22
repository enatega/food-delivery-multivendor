"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { HomeMiniCardProps } from '@/lib/utils/interfaces/Home-interfaces'



const HomeMiniCard: React.FC<HomeMiniCardProps> = ({ image, heading, subText, headingColor, backColor, darkBackColor }) => {


  // get theme from local storage
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const bgColor = theme === "dark" ? darkBackColor : backColor;

  return (
    <div className='h-[400px] flex justify-center items-center flex-col  rounded-3xl '
      style={{ backgroundColor: bgColor }}
    >
      <div className='w-[300px] mx-auto flex flex-col items-center justify-between'>
        <Image
          src={image}
          width={50}
          height={50}
          alt="Image"
        />
        <div className='text-center my-[30px] '>
          <h1 className="font-extrabold text-[25px] my-2 "
            style={{ color: headingColor }}

          >{heading}</h1>
          <p className='font-light dark:text-white'>{subText}</p>
        </div>
      </div>
    </div>
  )
}

export default HomeMiniCard
