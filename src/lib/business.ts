export const BUSINESS = {
  name: "car2scrap",
  phone: "+919808903131",
  phoneDisplay: "+91 98089 03131",
  whatsapp: "919808903131",
  email: "car2scrap01@gmail.com",
  address:
    "Gate No.142, Near Testify Rice Mill, Rajarampur, Sikandarabad Industrial Area, Bulandshahar – 203205",
  mapsEmbed:
    "https://www.google.com/maps/place/Bharat+Scrap+Facilities/@28.4911672,77.6554634,17z/data=!3m1!4b1!4m6!3m5!1s0x390c976969c55465:0xdb1c8da4d55fcc5f!8m2!3d28.4911626!4d77.6603343!16s%2Fg%2F11n4mv674j?entry=ttu&g_ep=EgoyMDI2MDQyMS4wIKXMDSoASAFQAw%3D%3D",
} as const;

export function whatsappLink(message?: string): string {
  const text = message ?? "Hi, I want a scrap price quote for my car";
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}
