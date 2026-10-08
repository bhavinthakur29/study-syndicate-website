export function studentWhatsApp(phone: string, message: string) {
  return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
}

export function receiptText(r: {
  receiptNo: string;
  name: string;
  cabin: number;
  amount: number;
  method: string;
  date: string;
}) {
  return [
    `Receipt ${r.receiptNo}`,
    "The Study Syndicate Library",
    `${r.name}, Cabin ${r.cabin}`,
    `Amount: ₹${r.amount.toLocaleString("en-IN")} (${r.method.toUpperCase()})`,
    `Date: ${r.date}`,
    "Thank you!",
  ].join("\n");
}
