"use client"
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

function TrackingHelpCard() {
    const t = useTranslations()
    return (
        <div className="h-max shadow-md bg-white p-4 rounded-xl flex items-center gap-4 max-w-xs md:mt-4 mt-0">
            <span className="text-2xl">💬</span>
            <div>
                <p className="text-sm font-medium text-gray-700">{t("need_help_with_order_text")}</p>
                <Link href={"/profile/getHelp"} className="text-blue-600 text-sm hover:underline">{t("get_help_link_text")}</Link>
            </div>
        </div>
    )
}

export default TrackingHelpCard