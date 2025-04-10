"use client";

import { Rating } from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import SetColor from "@/components/Products/SetColor";
import SetQuantity from "@/components/Products/SetQuantity";
import Button from "@/components/universal/Button";
import ProductImage from "@/components/Products/ProductImage";
import { useCart } from "@/hooks/useCart";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";
import Loader from "@/components/universal/Loader";

interface ProductDetailsProps {
  product: any;
}

export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImgType;
  quantity: number;
  price: number;
  weight?: number;
};

export type SelectedImgType = {
  color: string;
  colorCode: string;
  images: string[];
};

const HorizontalLine = () => {
  return <hr className="w-[30%] my-2" />;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { handleAddProductToCart, cartProducts } = useCart();
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: {
      color: product.images[0].color,
      colorCode: product.images[0].colorCode,
      images: product.images[0].images, // ✅ Store the whole array of images
    },
    quantity: 1,
    price: product.price,
    weight: product.weight,
  });
  const [loading, setLoading] = useState(false); // State to manage loading for "View Cart"
  const router = useRouter();

  useEffect(() => {
    setIsProductInCart(false);

    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts, product.id]);

  const productRating =
    product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    product.reviews.length;

  const handleColorSelect = useCallback((value: SelectedImgType) => {
    setCartProduct((prev) => ({
      ...prev,
      selectedImg: value,
    }));
  }, []);

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity === 20) {
      return;
    }
    setCartProduct((prev) => ({
      ...prev,
      quantity: prev.quantity + 1,
    }));
  }, [cartProduct]);

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity === 1) {
      return;
    }
    setCartProduct((prev) => ({
      ...prev,
      quantity: prev.quantity - 1,
    }));
  }, [cartProduct]);

  const handleViewCartClick = () => {
    setLoading(true); // Set loading to true when the button is clicked
    setTimeout(() => {
      router.push("/cart");
      setLoading(false); // Reset loading state after navigation
    }, 500); // Optional: Adjust delay as needed
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImage
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-2 text-slate-500 text-sm">
        <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} readOnly />
          <div>{product.reviews.length} reviews</div>
        </div>
        <HorizontalLine />

        <div className="text-justify">{product.description}</div>
        <HorizontalLine />
        <div>
          <span className="font-semibold">CATEGORY: </span>
          {product.category}
        </div>
        <div>
          <span className="font-semibold">BRAND: </span>
          {product.brand}
        </div>
        <div className=" font-semibold">
          {product.finalPrice ? (
            <>
              Price:{" "}
              <span className="line-through text-gray-500">
                ₹{product.price}
              </span>
              <span className="text-red-500">
                {" "}
                ₹{product.finalPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <>Price: ₹{product.price}</>
          )}
        </div>
        <div className={product.inStock ? "text-teal-400" : "text-red-400"}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </div>
        <HorizontalLine />
        {isProductInCart ? (
          <>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdCheckCircle size={20} className="text-teal-400" />
              <span>Product added to cart</span>
            </p>
            <div className="relative max-w-[300px]">
              <Button lable="View Cart" outline onClick={handleViewCartClick} />
              {loading && <Loader />} {/* Use Loader component */}
            </div>
          </>
        ) : (
          <>
            <SetColor
              cartProduct={cartProduct}
              images={product.images}
              handleColorSelect={handleColorSelect}
            />
            <HorizontalLine />
            <SetQuantity
              cartProduct={cartProduct}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />
            <HorizontalLine />
            <div className="max-w-[300px]">
              <Button
                lable="Add to Cart"
                onClick={() => handleAddProductToCart(cartProduct)}
                disabled={!product.inStock} // ✅ Disable if out of stock
              />
              {!product.inStock && (
                <p className="text-red-500 mt-2 text-sm">
                  Product is out of stock
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
