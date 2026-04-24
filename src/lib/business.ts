export const BUSINESS = {
  name: "car2scrap",
  phone: "+919808903131",
  phoneDisplay: "+91 98089 03131",
  whatsapp: "919808903131",
  email: "car2scrap01@gmail.com",
  address:
    "Gate No.142, Near Testify Rice Mill, Rajarampur, Sikandarabad Industrial Area, Bulandshahar – 203205",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d224423.30900155852!2d77.660334!3d28.491163000000004!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c976969c55465%3A0xdb1c8da4d55fcc5f!2sBharat%20Scrap%20Facilities!5e0!3m2!1sen!2sin!4v1777031500894!5m2!1sen!2sin",
} as const;

export function whatsappLink(message?: string): string {
  const text = message ?? "Hi, I want a scrap price quote for my car";
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}
