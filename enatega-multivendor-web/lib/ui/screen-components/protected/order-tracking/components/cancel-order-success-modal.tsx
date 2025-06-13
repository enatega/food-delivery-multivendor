"use client"
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'

interface CancelOrderSuccessModalProps {
    visible: boolean;
    onHide: () => void;
}

function CancelOrderSuccessModal({ visible, onHide }: CancelOrderSuccessModalProps) {
    const router = useRouter();
    // create a function when user onHide then it will redirect to discover screen
    const handleOnHide = () => {
        onHide();
        router.push('/discovery');
    }

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                handleOnHide();
            }, 7000);
        }
    }, [visible]);

    return (
        <Dialog
            visible={visible}
            onHide={handleOnHide}
            modal
            className="w-full max-w-xs mx-4 relative"
            contentClassName="p-6"
            showHeader={false}
            closable={true}
            dismissableMask
            style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '15px',
                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
            }}
        >
            <button
                onClick={handleOnHide}
                className="p-1 absolute top-2 right-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold mb-2">Your order is Cancelled</h2>
                <p className="text-gray-600 text-sm text-center">
                    {"If you have any questions, feel free to reach  out to our support team."}
                </p>
            </div>
        </Dialog>
    )
}

export default CancelOrderSuccessModal