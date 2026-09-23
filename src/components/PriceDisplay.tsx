import React from 'react';

type PriceValue = string | number | undefined;

const toNumber = (value: PriceValue) => {
  const numberValue = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(numberValue) ? numberValue : null;
};

export const formatPrice = (price: PriceValue, currency = 'INR') => {
  const numericValue = toNumber(price);
  if (numericValue === null) return price || 'Price unavailable';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

interface PriceDisplayProps {
  price: PriceValue;
  compareAtPrice?: PriceValue;
  currency?: string;
  className?: string;
  currentClassName?: string;
  compareClassName?: string;
  badgeClassName?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  compareAtPrice,
  currency = 'INR',
  className = '',
  currentClassName = '',
  compareClassName = 'text-xs font-medium text-[#747783] line-through',
  badgeClassName = 'text-[10px] font-bold text-[#9e825d]',
}) => {
  const currentValue = toNumber(price);
  const compareValue = toNumber(compareAtPrice);
  const hasDiscount = currentValue !== null && compareValue !== null && compareValue > currentValue;
  const discountPercent = hasDiscount && compareValue > 0
    ? Math.round((1 - currentValue / compareValue) * 100)
    : 0;

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      {hasDiscount && <span className={compareClassName}>{formatPrice(compareValue, currency)}</span>}
      <span className={currentClassName}>{formatPrice(price, currency)}</span>
      {hasDiscount && <span className={badgeClassName}>-{discountPercent}%</span>}
    </span>
  );
};
