"use client";

import { useCallback } from "react";

import { useConfig } from "@/lib/context/configuration/configuration.context";

export function formatCurrencyValue(
  value: number | string | null | undefined,
  currencySymbol = "",
  currency = "",
) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";

  const currencyLabel = currencySymbol || currency;
  const separator = currencyLabel.length > 2 ? " " : "";
  const sign = amount < 0 ? "-" : "";

  return `${sign}${currencyLabel}${separator}${Math.abs(amount).toFixed(2)}`;
}

export default function useCurrencyFormatter() {
  const { CURRENCY, CURRENCY_SYMBOL } = useConfig();

  const formatCurrency = useCallback(
    (value: number | string | null | undefined) =>
      formatCurrencyValue(value, CURRENCY_SYMBOL, CURRENCY),
    [CURRENCY, CURRENCY_SYMBOL],
  );

  return {
    currency: CURRENCY,
    currencySymbol: CURRENCY_SYMBOL,
    formatCurrency,
  };
}
