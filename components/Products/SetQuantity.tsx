"use client";

import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import Button from "../universal/Button";

interface SetQtyProps {
  cartCounter?: boolean;
  cartProduct: CartProductType;
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}

const btnStyles = "border-[1.2px] border-slate-300 px-2 rounded";

const SetQuantity: React.FC<SetQtyProps> = ({
  cartCounter,
  cartProduct,
  handleQtyIncrease,
  handleQtyDecrease,
}) => {
  return (
    <div className="flex flex-wrap gap-4 sm:gap-8 items-center">
      {!cartCounter && (
        <div className="text-sm sm:text-base font-semibold">QUANTITY:</div>
      )}

      <div className="flex gap-4 items-center text-base">
        <button onClick={handleQtyDecrease} className={btnStyles}>
          -
        </button>

        <div className="min-w-[24px] text-center">{cartProduct.quantity}</div>

        <button onClick={handleQtyIncrease} className={btnStyles}>
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;
