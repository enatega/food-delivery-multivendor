"use client";
import { useAppMode } from "@/lib/mode";
import SingleVendorCheckout from "@/lib/ui/single-vendor/Checkout";
import MultiVendorCheckout from "./index";
export default function ModeCheckout() { const { isSingleVendor } = useAppMode(); return isSingleVendor ? <SingleVendorCheckout /> : <MultiVendorCheckout />; }

