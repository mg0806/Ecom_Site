"use client";

import { formatPrice } from "@/Utils/formatPrice";
import { truncateText } from "@/Utils/truncateText";
import { CartProductType } from "../../product/[productId]/ProductDetails";
import Image from "next/image";

interface OrderItemProps {
  item: CartProductType;
}
const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  // console.log("item", item);
  return (
    <div className="grid grid-cols-5 text-xs md:text-sm gap-4 py-4 items-center border-b border-slate-200">
      {/* Product Image */}
      <div className="justify-self-start">
        <div className="relative w-[90px] md:w-[110px] aspect-square">
          <Image
            src={item.selectedImg.images[0]}
            alt={item.name}
            fill
            className="object-contain rounded"
          />
        </div>
      </div>

      {/* Product Name */}
      <div className="justify-self-center">{item.name}</div>

      {/* Color */}
      <div className="justify-self-center text-gray-500">
        {item.selectedImg.color}
      </div>

      {/* Price */}
      <div className="justify-self-center">{formatPrice(item.price)}</div>

      {/* Quantity */}
      <div className="justify-self-center">{item.quantity}</div>
    </div>
  );
};

export default OrderItem;
