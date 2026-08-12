"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
export default function PaymentPendingPage() { const orderId = useSearchParams().get("orderId"); return <div className="mx-auto my-20 max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800"><h1 className="text-2xl font-bold dark:text-white">Payment is processing</h1><p className="mt-3 text-gray-600 dark:text-gray-300">We have not received final confirmation yet. Your order remains saved and will update automatically.</p><Link href={orderId ? `/order/${orderId}/tracking` : "/profile/order-history"} className="mt-6 inline-block rounded-full bg-primary-color px-6 py-3 font-semibold text-white">View order</Link></div>; }
