"use client";

import { formatPrice } from "@/Utils/formatPrice";
import { truncateText } from "@/Utils/truncateText";
import { Rating } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "../universal/Loader";

interface ProductsCardProps {
  data: any;
}

const ProductCard: React.FC<ProductsCardProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const productRating =
    data.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    data.reviews.length;

  const handleClick = () => {
    setLoading(true);

    // Wait a bit to let loader appear before navigation
    setTimeout(() => {
      router.push(`/product/${data.id}`);
    }, 500); // Slightly increased delay for smoother transition
  };

  return (
    <div
      onClick={!loading ? handleClick : undefined}
      className={`relative col-span-1 cursor-pointer border border-slate-200 bg-slate-50 p-4 sm:p-6 rounded-xl transition-transform hover:scale-105 text-center text-sm
      ${loading ? "pointer-events-none opacity-70" : ""}
    `}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <Loader />
        </div>
      )}

      <div className="flex flex-col items-center w-full gap-2 sm:gap-3">
        <div className="aspect-square relative w-full overflow-hidden">
          <Image
            src={data.images[0].images[0]}
            alt={data.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            className="object-contain"
          />
        </div>

        <div className="mt-3 sm:mt-4 font-medium text-sm sm:text-base">
          {truncateText(data.name)}
        </div>

        <div className="text-xs sm:text-sm">
          <Rating value={productRating} readOnly />
        </div>

        <div className="text-xs sm:text-sm text-gray-600">
          {data.reviews.length} reviews
        </div>

        <div className="text-base sm:text-lg font-semibold">
          {data.finalPrice ? (
            <>
              Price:{" "}
              <span className="line-through text-gray-500">₹{data.price}</span>
              <span className="text-red-500 ml-1">
                ₹{data.finalPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <>Price: ₹{data.price}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
