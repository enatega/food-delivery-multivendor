import Link from 'next/link'
import React from 'react'

function TrackingHelpCard() {
    return (
        <div className="h-max shadow-md bg-white p-4 rounded-xl flex items-center gap-4 max-w-xs md:mt-4 mt-0">
            <span className="text-2xl">💬</span>
            <div>
                <p className="text-sm font-medium text-gray-700">Need help with your order?</p>
                <Link href={"/profile/getHelp"} className="text-blue-600 text-sm hover:underline">Get Help</Link>
            </div>
        </div>
    )
}

export default TrackingHelpCard