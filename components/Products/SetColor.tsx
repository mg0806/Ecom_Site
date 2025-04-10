/* eslint-disable react/jsx-key */
"use client";

import {
  CartProductType,
  SelectedImgType,
} from "@/app/product/[productId]/ProductDetails";

interface SetColorProps {
  images: SelectedImgType[];
  cartProduct: CartProductType;
  handleColorSelect: (value: SelectedImgType) => void;
}

const SetColor: React.FC<SetColorProps> = ({
  images,
  cartProduct,
  handleColorSelect,
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-sm sm:text-base font-semibold">COLOR:</span>
        <div className="flex gap-2 flex-wrap">
          {images.map((image) => (
            <div
              key={image.color}
              onClick={() => handleColorSelect(image)}
              className={`h-8 w-8 border-teal-300 rounded-full flex items-center justify-center transition ${
                cartProduct.selectedImg.color === image.color
                  ? "border-[1.5px]"
                  : "border-none"
              }`}
            >
              <div
                style={{ background: image.colorCode }}
                className="h-6 w-6 rounded-full border border-slate-300 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetColor;
