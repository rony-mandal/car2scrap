import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// 🔥 Auto load all images from folder
const images = import.meta.glob("/src/assets/customers/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

const customerImages = Object.values(images);

export default function CustomerCarousel() {
  return (
    <div className="w-full h-full">
      <Swiper
  modules={[Autoplay]}
  autoplay={{
    delay: 1500,
    disableOnInteraction: false,
    
  }}
  speed={1000}
  loop={true}
  className="w-full h-full rounded-2xl"
>
        {customerImages.map((img: any, index: number) => (
          <SwiperSlide key={index}>
  <div className="w-full h-full rounded-2xl overflow-hidden">

    <img
      src={img}
      className="w-full h-full object-cover"
    />

  </div>
</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}