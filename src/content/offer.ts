export const offer = {
  label: "Opening offer",
  price: 999,
  regularPrice: 1200,
  period: "first month",
} as const;

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
