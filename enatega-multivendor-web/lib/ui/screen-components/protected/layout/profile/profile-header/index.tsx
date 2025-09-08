"use client"
import CustomButton from '@/lib/ui/useable-components/button'
import TextComponent from '@/lib/ui/useable-components/text-field'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ProfileHeader() {
  const router = useRouter();
  const t = useTranslations()
  return (
  <div className='w-full flex justify-between'>
     <TextComponent text={t("ProfileSection.profile_label")} className='font-semibold md:text-3xl text-xl'/>
     <CustomButton onClick={()=>router.push("/profile/getHelp")} label={t('ProfileSection.gethelp')} type='button' className='text-base font-light bg-[#F3FFEE] dark:bg-gray-800 px-[16px] py-[8px] text-[#63C43B]'/>
  </div>
  )
}
