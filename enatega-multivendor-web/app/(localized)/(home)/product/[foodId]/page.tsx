import SingleVendorProductDetails from "@/lib/ui/single-vendor/ProductDetails";
export default async function ProductPage({ params, searchParams }: { params: Promise<{ foodId: string }>; searchParams: Promise<{ categoryId?: string }> }) { const [{ foodId }, { categoryId }] = await Promise.all([params, searchParams]); return <SingleVendorProductDetails foodId={foodId} categoryId={categoryId} />; }

