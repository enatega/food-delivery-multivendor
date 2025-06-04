"use client"
import CustomButton from '@/lib/ui/useable-components/button'
import TextComponent from '@/lib/ui/useable-components/text-field'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ProfileHeader() {
  const router = useRouter();
  return (
  <div className='w-full flex justify-between'>
     <TextComponent text="Profile" className='font-semibold md:text-3xl text-xl'/>
     <CustomButton onClick={()=>router.push("/profile/getHelp")} label='Get help' type='button' className='text-base font-light bg-[#F3FFEE] px-[16px] py-[8px] text-[#63C43B]'/>
  </div>
  )
}
