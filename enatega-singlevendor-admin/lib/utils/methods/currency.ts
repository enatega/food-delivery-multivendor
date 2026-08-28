export const formatNumber = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumberWithCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
) => {
  const _locale = locale || 'en-US';
  const _currency = currency || 'USD';

  return new Intl.NumberFormat(_locale, {
    style: 'currency',
    currency: _currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
