export const BUSINESS = {
  name: "car2scrap",
  phone: "+919808903131",
  phoneDisplay: "+91 98089 03131",
  whatsapp: "919808903131",
  email: "turbo.rony@yahoo.com",
  address:
    "Gata No.142, Near Testify Rice Mill, Rajarampur, Sikandarabad Industrial Area, Bulandshahar – 203205",
  mapsEmbed:
    "https://www.google.com/maps?q=Sikandarabad+Industrial+Area,+Bulandshahar&output=embed",
} as const;

export function whatsappLink(message?: string): string {
  const text = message ?? "Hi, I want a scrap price quote for my car";
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}
