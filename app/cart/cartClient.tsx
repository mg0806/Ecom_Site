"use client";

import Heading from "@/components/universal/Heading";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/universal/Button";
import ItemContent from "./itemContent";
import { formatPrice } from "@/Utils/formatPrice";
import { SafeUser } from "@/types";
import { useRouter } from "next/navigation";
import { product } from "../../Utils/product";
import { useEffect, useState } from "react";

interface CartClientProps {
  currentUser: SafeUser | null;
}

const CartClient: React.FC<CartClientProps> = ({ currentUser }) => {
  const {
    cartProducts,
    handleClearCart,
    cartTotalAmount,
    shippingCharges,
    totalWeight,
    grandTotalAmount,
  } = useCart();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Optional: Stop loading after a delay to simulate transition
    if (loading) {
      const timeout = setTimeout(() => {
        setLoading(false); // fallback safety
      }, 4000); // 4s max wait

      return () => clearTimeout(timeout);
    }
  }, [loading]);
  const router = useRouter();
  // const shippingRules = [
  //   { condition: (weight: number) => weight < 0.5, rate: 50 },
  //   { condition: (weight: number) => weight === 0.5, rate: 80 },
  //   { condition: (weight: number) => weight > 0.5 && weight < 1, rate: 100 },
  //   { condition: (weight: number) => weight >= 1 && weight <= 2, rate: 150 },
  //   { condition: (weight: number) => weight > 2, rate: 200 },
  // ];

  // const calculateShipping = (weight: number): number => {
  //   const rule = shippingRules.find((rule) => rule.condition(weight));
  //   return rule ? rule.rate : 0;
  // };

  // const totalWeight =
  //   cartProducts?.reduce((acc, product) => {
  //     console.log(product);
  //     return acc + (product.weight || 0) * (product.quantity || 1);
  //   }, 0) || 0;

  // const shippingCharges = calculateShipping(totalWeight);
  // const grandTotalAmount = shippingCharges + cartTotalAmount;

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="flex flex-col items-center  ">
        <div className="text-2xl text-center">Your cart is empty</div>
        <div>
          <Link
            href={"/"}
            className="text-slate-500 flex items-center gap-1 mt-2 "
          >
            <MdArrowBack />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 sm:px-6 lg:px-0 mt-10">
      <Heading title="Shopping Cart" center />

      {/* Table Headers */}
      <div className="grid grid-cols-5 text-xs pb-2 mt-8 gap-4 font-medium text-slate-600 max-md:hidden">
        <div className="col-span-2 ml-4">PRODUCT</div>
        <div className="text-center">PRICE</div>
        <div className="text-center">QUANTITY</div>
        <div className="text-right mr-4">TOTAL</div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartProducts &&
          cartProducts.map((item) => <ItemContent key={item.id} item={item} />)}
      </div>

      {/* Cart Footer Summary */}
      <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Clear Cart Button */}
        <div className="w-full md:w-auto">
          <Button lable="Clear Cart" onClick={handleClearCart} small outline />
        </div>

        {/* Summary Section */}
        <div className="w-full max-w-sm text-sm flex flex-col gap-2 text-slate-700">
          <div className="flex justify-between font-semibold text-base">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotalAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Charges </span>
            <span>{formatPrice(shippingCharges)}</span>
          </div>

          <div className="text-xs text-slate-500">
            Weight: ({totalWeight.toFixed(2)} kg)
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>{formatPrice(grandTotalAmount)}</span>
          </div>

          <p className="text-slate-500 text-xs">
            Taxes and shipping calculated at checkout.
          </p>

          {/* Checkout Button */}
          <Button
            lable={currentUser ? "Checkout" : "Login to Checkout"}
            outline={!currentUser}
            onClick={() => {
              if (currentUser) {
                setLoading(true);
                router.push("/checkout");
                setTimeout(() => router.push("/checkout"), 200);
              } else {
                router.push("/Login");
              }
            }}
          />

          {/* Continue Shopping Link */}
          <Link
            href="/"
            className="text-slate-500 flex items-center gap-1 mt-4 text-sm hover:underline"
          >
            <MdArrowBack />
            <span>Continue Shopping</span>
          </Link>

          <div className="mb-24" />
        </div>
      </div>
    </div>
  );
};

export default CartClient;
