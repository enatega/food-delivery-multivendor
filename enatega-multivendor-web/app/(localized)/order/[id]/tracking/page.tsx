"use client"
import React from 'react'
import OrderTrackingScreen from '@/lib/ui/screens/protected/order/tracking'
import { useParams } from 'next/navigation'
import { useAppMode } from '@/lib/mode'
import SingleVendorOrderTracking from '@/lib/ui/single-vendor/OrderTracking'
function Page() {
    const { id } = useParams();
    const { isSingleVendor } = useAppMode();
    return (
        isSingleVendor ? <SingleVendorOrderTracking orderId={id as string} /> : <OrderTrackingScreen orderId={id as string} />
    )
}

export default Page
