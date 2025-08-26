"use client"

import type React from "react"
import { useState } from "react"
import CustomInputSwitch from "@/lib/ui/useable-components/custom-input-switch";
import TextComponent from "@/lib/ui/useable-components/text-field";
import { useTranslations } from "next-intl";

export default function NotificationSection() {
  // States for notification preferences
  const [pushNotifications, setPushNotifications] = useState<boolean>(false)
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false)

  // Handle push notifications toggle
  const handlePushNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    setPushNotifications(newValue)
  }

  // Handle email notifications toggle
  const handleEmailNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    setEmailNotifications(newValue)
  }
  const t = useTranslations()

  return (
    <div className="w-full mx-auto">
      <TextComponent text={t('NotificationSection_title')} className=" font-semibold text-gray-700 text-xl md:text-2xl   mb-4" />

      {/* Push Notifications */}
      <div className="py-4 border-b">
        <div className="flex justify-between items-center">
          <TextComponent text={t('NotificationSection_push')} className="font-normal text-gray-700 text-base md:text-lg " />
          <CustomInputSwitch
            loading={false}
            isActive={pushNotifications}
            onChange={handlePushNotificationsChange}
          />
        </div>
      </div>

      {/* Email Notifications */}
      <div className="py-4 border-b">
        <div className="flex justify-between items-center">
        <TextComponent text={t('NotificationSection_email')} className="font-normal text-gray-700 text-base md:text-lg   " />
          <CustomInputSwitch
            loading={false}
            isActive={emailNotifications}
            onChange={handleEmailNotificationsChange}
          />
        </div>
      </div>
    </div>
  )
}