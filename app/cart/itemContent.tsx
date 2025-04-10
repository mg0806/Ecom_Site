import React from "react";
import { CartProductType } from "../product/[productId]/ProductDetails";
import { formatPrice } from "@/Utils/formatPrice";
import Link from "next/link";
import { truncateText } from "@/Utils/truncateText";
import Image from "next/image";
import SetQuantity from "@/components/Products/SetQuantity";
import { useCart } from "@/hooks/useCart";

interface itemContentProps {
  item: CartProductType;
}

const ItemContent: React.FC<itemContentProps> = ({ item }) => {
  const {
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
  } = useCart();

  return (
    <div className="w-full">
      <div className="border border-slate-300 rounded-lg px-2 py-4 grid grid-cols-1 md:grid-cols-5 text-sm m-2 gap-y-4 items-center">
        {/* Product & Image */}
        <div className="md:col-span-2 flex items-start gap-4">
          <Link href={`/product/${item.id}`}>
            <div className="relative w-[70px] aspect-square shrink-0">
              <Image
                src={item.selectedImg.images[0]} // ✅ Fixed: Use first image from array
                alt={item.name}
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <div className="flex flex-col justify-between">
            <Link
              href={`/product/${item.id}`}
              className="font-medium hover:underline text-slate-700"
            >
              {truncateText(item.name)}
            </Link>
            <div className="text-slate-500 text-xs">
              Color: {item.selectedImg.color}
            </div>
            <button
              className="text-red-500 text-xs underline w-fit mt-1"
              onClick={() => handleRemoveProductFromCart(item)}
            >
              Remove
            </button>
          </div>
        </div>

        {/* Price - only on medium screens */}
        <div className="hidden md:block text-center text-slate-700">
          {formatPrice(item.price)}
        </div>

        {/* Quantity control */}
        <div className="hidden md:block justify-self-center">
          <SetQuantity
            cartCounter
            cartProduct={item}
            handleQtyIncrease={() => handleCartQtyIncrease(item)}
            handleQtyDecrease={() => handleCartQtyDecrease(item)}
          />
        </div>

        {/* Total Price */}
        <div className="hidden md:block text-right font-semibold text-slate-800">
          {formatPrice(item.price * item.quantity)}
        </div>

        {/* Mobile-specific info block */}
        <div className="block md:hidden w-full flex flex-col gap-2 text-xs text-slate-600 px-2">
          <div className="flex justify-between">
            <span>Price:</span>
            <span>{formatPrice(item.price)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Quantity:</span>
            <div className="max-w-[120px]">
              <SetQuantity
                cartCounter
                cartProduct={item}
                handleQtyIncrease={() => handleCartQtyIncrease(item)}
                handleQtyDecrease={() => handleCartQtyDecrease(item)}
              />
            </div>
          </div>
          <div className="flex justify-between font-semibold text-sm text-slate-800">
            <span>Total:</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemContent;
