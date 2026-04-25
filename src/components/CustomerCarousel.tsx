import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

const images = import.meta.glob("/src/assets/customers/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

const customerImages = Object.values(images);

export default function CustomerCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);

  if (customerImages.length === 0) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <style>{`
        .car2scrap-swiper .swiper-pagination-bullet {
          background: #ffffff;
          opacity: 0.5;
          width: 8px;
          height: 8px;
        }
        .car2scrap-swiper .swiper-pagination-bullet-active {
          background: #1db954;
          opacity: 1;
          width: 22px;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      `}</style>

      <Swiper
        className="car2scrap-swiper"
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 1500, disableOnInteraction: false }}
        speed={1000}
        loop={true}
        navigation={false}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        style={{ width: "100%", height: "100%" }}
      >
        {customerImages.map((img: any, index: number) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Customer car ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Prev button */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="Next slide"
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}