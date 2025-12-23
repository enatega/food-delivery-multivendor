'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface TilesData {
  image: string,
  heading: string,
  buttonText: string,
  backColor: string,
  link: string

}


const TinyTiles: React.FC<TilesData> = ({ image, heading, buttonText, backColor, link }) => {
  const Router = useRouter()

  function Navigate() {
    Router.push(link)
  }

  // get theme from local storage
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  return (
    <div className='p-4 w-[95%] mx-auto flex justify-between items-center rounded-3xl transform hover:scale-105 cursor-pointer transition duration-300'
      style={
        theme === "dark" ? { backgroundColor: "#1e3a4a" } :
          { backgroundColor: backColor }
      }>
      <div className='flex'>
        <Image src={image} width={50} height={50} alt={"Image"} />
      </div>
      <div className='w-full justify-between flex flex-col gap-2'>
        <h1 className='text-[#009de0] font-semibold text-[18px] mx-4'>{heading}</h1>
        <div className='flex gap-2 items-center ml-auto'>
          <button className='text-[#009de0] font-medium text-[16px]' onClick={Navigate} >
            <span className='mr-2'>{buttonText}</span>
            <i className="pi pi-arrow-right" style={{ fontSize: "0.8rem", backgroundColor: "#009de0", padding: "4px", color: "white", borderRadius: "50%" }}></i>
          </button>

        </div>
      </div>
    </div>
  )
}

export default TinyTiles
