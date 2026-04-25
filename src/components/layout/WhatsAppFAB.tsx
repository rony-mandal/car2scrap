import { whatsappLink } from "@/lib/business";

export function WhatsAppFAB() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-4 md:right-6 md:bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-elegant hover:scale-105 transition-base"
    >
      {/* Official WhatsApp logo SVG from Meta */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 175.216 175.552"
        width="30"
        height="30"
        fill="white"
        aria-hidden="true"
      >
        <path d="M87.6 0C39.3 0 0 39.3 0 87.6c0 15.3 4 29.7 11 42.2L0 175.6l47.2-10.8C59.2 171.5 73 175.6 87.6 175.6c48.3 0 87.6-39.3 87.6-87.6C175.2 39.3 135.9 0 87.6 0zm0 160.8c-13.4 0-26-3.6-36.9-9.9l-2.6-1.6-27.4 6.3 6.5-26.5-1.7-2.7c-6.9-11.2-10.6-24.2-10.6-37.7C14.9 47.6 47.6 14.9 87.6 14.9c19.4 0 37.6 7.5 51.3 21.2 13.7 13.7 21.2 31.9 21.2 51.3 0 40.1-32.7 72.4-72.5 72.4zm39.9-54.3c-2.2-1.1-13-6.4-15-7.1-2-.7-3.5-1.1-4.9 1.1-1.5 2.2-5.7 7.1-7 8.6-1.3 1.5-2.5 1.7-4.7.6-2.2-1.1-9.2-3.4-17.5-10.8-6.5-5.8-10.8-12.9-12.1-15.1-1.3-2.2-.1-3.4 1-4.5.9-.9 2.2-2.5 3.2-3.7 1.1-1.3 1.5-2.2.2-4.4-1.3-2.2-4.9-11.8-6.7-16.2-1.8-4.2-3.6-3.6-4.9-3.7h-4.2c-1.5 0-3.8.6-5.8 2.7-2 2.2-7.6 7.4-7.6 18s7.8 20.9 8.9 22.3c1.1 1.5 15.3 23.3 37.1 32.7 5.2 2.2 9.2 3.6 12.4 4.6 5.2 1.6 9.9 1.4 13.7.8 4.2-.6 13-5.3 14.8-10.4 1.8-5.1 1.8-9.5.1-10.4-.9-.6-2.3-1.1-4.5-2.2z" />
      </svg>
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}