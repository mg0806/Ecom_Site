"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { CiShoppingCart } from "react-icons/ci";

const CartCount = () => {
  const { cartTotalQty } = useCart();
  const router = useRouter();

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => router.push("/cart")}
    >
      <div className="text-2xl sm:text-3xl">
        <CiShoppingCart />
      </div>

      {cartTotalQty > 0 && (
        <span className="absolute -top-2 -right-2 bg-slate-700 text-white h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-xs sm:text-sm">
          {cartTotalQty}
        </span>
      )}
    </div>
  );
};

export default CartCount;
