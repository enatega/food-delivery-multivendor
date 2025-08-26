"use client"
import React from 'react'
import OrderTrackingScreen from '@/lib/ui/screens/protected/order/tracking'
import { useParams } from 'next/navigation'
function Page() {
    const { id } = useParams();
    return (
        <OrderTrackingScreen orderId={id as string} />
    )
}

export default Page