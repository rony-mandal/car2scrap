import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const images = import.meta.glob("/src/assets/customers/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

const customerImages = Object.values(images);

export default function CustomerCarousel() {
  if (customerImages.length === 0) return null;

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 1500, disableOnInteraction: false }}
      speed={1000}
      loop={true}
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
  );
}