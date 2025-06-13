"use client"

import type React from "react"
import { useState } from "react"
import CustomInputSwitch from "@/lib/ui/useable-components/custom-input-switch";
import TextComponent from "@/lib/ui/useable-components/text-field";

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

  return (
    <div className="w-full mx-auto">
      <TextComponent text="Notifications" className=" font-semibold text-gray-700 text-xl md:text-2xl   mb-4" />

      {/* Push Notifications */}
      <div className="py-4 border-b">
        <div className="flex justify-between items-center">
          <TextComponent text="I want to receive special offers and promotions from us via push-messages" className="font-normal text-gray-700 text-base md:text-lg " />
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
        <TextComponent text="I want to receive special offers and promotions from us via email" className="font-normal text-gray-700 text-base md:text-lg   " />
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