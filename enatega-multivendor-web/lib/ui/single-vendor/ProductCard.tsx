"use client";

import Link from "next/link";
import type { ModeProduct } from "@/lib/mode/types";
import Image from "@/lib/ui/useable-components/safe-image";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import CartQuantityController from "./CartQuantityController";

export default function SingleVendorProductCard({
  product,
}: {
  product: ModeProduct;
}) {
  const { formatCurrency } = useCurrencyFormatter();
  const firstPrice = product.variations?.[0]?.price;
  const variation = product.variations?.[0];
  const href = `/product/${product.id}${product.categoryId ? `?categoryId=${product.categoryId}` : ""}`;
  return (
    <article className="group relative h-full overflow-hidden rounded-md bg-white shadow-md transition duration-500 hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800">
      <Link href={href} className="block h-full">
        <div className="relative h-[150px] overflow-hidden bg-gray-100 dark:bg-gray-700">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 font-semibold text-gray-900 dark:text-white">
            {product.title}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
              {product.description}
            </p>
          )}
          {typeof firstPrice === "number" && (
            <p className="mt-3 font-semibold text-primary-color">
              {formatCurrency(firstPrice)}
            </p>
          )}
        </div>
      </Link>
      <CartQuantityController
        foodId={product.id}
        categoryId={product.categoryId}
        variationId={variation?.id}
        foodTitle={product.title}
        variationTitle={variation?.title || variation?.name}
        image={product.image}
        unitPrice={variation?.price}
      />
    </article>
  );
}
