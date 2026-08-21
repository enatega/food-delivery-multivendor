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
    <article className="group relative h-full overflow-hidden rounded-xl border border-dispatch-line bg-dispatch-surface dark:border-gray-800 dark:bg-gray-900">
      <Link href={href} className="block h-full">
        <div className="relative aspect-[16/9] overflow-hidden bg-dispatch-map dark:bg-gray-800">
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
        <div className="p-2.5">
          <h3 className="line-clamp-1 text-[15px] font-medium leading-tight text-dispatch-ink dark:text-white sm:text-base">
            {product.title}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-dispatch-muted dark:text-gray-400">
              {product.description}
            </p>
          )}
          {typeof firstPrice === "number" && (
            <p className="mt-2 text-sm font-medium text-primary-dark">
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
