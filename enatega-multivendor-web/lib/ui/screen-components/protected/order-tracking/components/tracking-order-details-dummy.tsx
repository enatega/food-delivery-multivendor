import React from 'react'

function TrackingOrderDetailsDummy() {
    return (
        <div className="mt-8 space-y-6 flex-1 max-w-2xl md:w-auto w-full md:px-0 px-4 animate-pulse">
            {/* Image and text skeleton */}
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-300 rounded-lg" />
                <div className="space-y-2 flex-1">
                    <div className="w-3/4 h-4 bg-gray-300 rounded" />
                    <div className="w-1/2 h-3 bg-gray-300 rounded" />
                </div>
            </div>

            {/* Order summary skeleton */}
            <div className="space-y-2">
                <div className="w-1/3 h-4 bg-gray-300 rounded" />
                <div className="w-full h-3 bg-gray-300 rounded" />
                <div className="w-2/3 h-3 bg-gray-300 rounded" />
                <div className="w-1/2 h-3 bg-gray-300 rounded" />
            </div>

            {/* Payment info skeleton */}
            <div className="border rounded-md p-4 space-y-2">
                <div className="w-1/4 h-4 bg-gray-300 rounded" />
                <div className="w-full h-4 bg-gray-300 rounded" />
            </div>

            {/* Button skeleton */}
            <div className="w-full h-10 bg-gray-300 rounded-full" />
        </div>
    )
}

export default TrackingOrderDetailsDummy;