"use client";

import { useEffect, useState } from "react";
import {
  CartProductType,
  SelectedImgType,
} from "@/app/product/[productId]/ProductDetails";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRef } from "react";
import SwiperCore from "swiper";
interface ProductImageProps {
  cartProduct: CartProductType;
  product: {
    images: SelectedImgType[];
  };
  handleColorSelect: (value: SelectedImgType) => void;
}

const ProductImage: React.FC<ProductImageProps> = ({
  cartProduct,
  product,
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const swiperRef = useRef<SwiperCore>();
  useEffect(() => {
    const selectedColorObject = product.images.find(
      (item) => item.color === cartProduct.selectedImg.color
    );

    const images = selectedColorObject?.images ?? [];
    if (images.length > 0) {
      setSelectedImages(images);
      setMainImage(images[0]);
    } else {
      setSelectedImages([]);
      setMainImage("");
    }
  }, [cartProduct.selectedImg, product.images]);

  return (
    <div className="w-full">
      {/* ✅ MOBILE: Swiper Carousel */}
      <div className="block sm:hidden w-full">
        {selectedImages.length > 0 ? (
          <Swiper
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            className="w-full h-[300px]"
          >
            {selectedImages.map((imgUrl, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-[300px]">
                  <Image
                    src={imgUrl}
                    alt={`Image ${idx + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-gray-500 text-sm p-4">No Images Available</div>
        )}
      </div>

      {/* ✅ DESKTOP: Thumbnail Sidebar + Main Image as Swiper */}
      <div className="hidden sm:grid grid-cols-6 gap-4 max-h-[500px] min-h-[400px]">
        {/* Sidebar Thumbnails */}
        <div className="flex flex-col items-center justify-start gap-2 overflow-y-auto border sm:h-full w-full">
          {selectedImages.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => {
                setMainImage(imgUrl);
                swiperRef.current?.slideTo(idx);
              }}
              className={`relative aspect-square w-[70px] rounded cursor-pointer ${
                mainImage === imgUrl
                  ? "border-2 border-teal-300"
                  : "border-2 border-transparent"
              }`}
            >
              <Image
                src={imgUrl}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1"
              />
            </div>
          ))}
        </div>

        {/* Main Image Swiper */}
        <div className="col-span-5 relative w-full h-full">
          {selectedImages.length > 0 ? (
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                const currentIndex = selectedImages.indexOf(mainImage);
                if (currentIndex >= 0) swiper.slideTo(currentIndex);
              }}
              onSlideChange={(swiper) => {
                setMainImage(selectedImages[swiper.realIndex]);
              }}
              modules={[Autoplay]}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              loop
              className="w-full h-full"
            >
              {selectedImages.map((imgUrl, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative w-full h-full">
                    <Image
                      src={imgUrl}
                      alt={`Slide ${idx + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImage;
