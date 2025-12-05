    "use client";
    import dynamic from 'next/dynamic';

    const ShopTypeScreen = dynamic(
    () => import('@/lib/ui/screens/protected/home').then(mod => mod.ShopTypeScreen),
    { ssr: false }
    );

    export default function ShopTypePage() {
    return <ShopTypeScreen />;
    }
