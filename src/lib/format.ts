export const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const discountPercent = (price: number, discountPrice: number) =>
  Math.round(((price - discountPrice) / price) * 100);
