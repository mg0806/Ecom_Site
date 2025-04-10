"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import CustomCheckBox from "@/components/inputs/CustomCheckBox";
import TextArea from "@/components/inputs/TextArea";
import Input from "@/components/inputs/input";
import Button from "@/components/universal/Button";
import Heading from "@/components/universal/Heading";
import firebaseApp from "@/libs/firebase";
import { FiTrash, FiUpload } from "react-icons/fi";
import Image from "next/image";
import { colors } from "@/Utils/Colors";
import { X } from "lucide-react";
import Loader from "@/components/universal/Loader";

interface ImageGroup {
  color: string;
  colorCode: string;
  images: string[];
}

interface EditProductModalProps {
  product: any;
  onClose: () => void;
  onUpdate: (updatedProduct: any) => void;
  isOpen: boolean;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  onClose,
  onUpdate,
  isOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [itemPrice, setItemPrice] = useState(
    Number(String(product.price).replace(/[^\d.-]/g, ""))
  );
  const [discount, setDiscount] = useState<number>(product?.discount || 0);
  const [finalPrice, setFinalPrice] = useState(product.price);

  const [imageGroups, setImageGroups] = useState<ImageGroup[]>(
    product?.imagesByColor && typeof product.imagesByColor === "object"
      ? Object.entries(product.imagesByColor).map(([colorCode, images]) => ({
          colorCode,
          color: getColorName(colorCode),
          images: Array.isArray(images) ? images : [],
        }))
      : []
  );
  const [selectedColor, setSelectedColor] = useState("");

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const priceString = product.price.replace(/[^\d.-]/g, "");
  const productPrice = Number(priceString);

  function getColorName(hex: string) {
    const colorObj = colors.find(
      (c) => c.colorCode.toLowerCase() === hex.toLowerCase()
    );
    return colorObj ? colorObj.color : hex;
  }

  useEffect(() => {
    if (isOpen && product) {
      reset({
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.category,
        inStock: product.inStock,
        price: productPrice,
        weight: product.weight * 1000,
      });
    }
  }, [product, isOpen, reset]);

  useEffect(() => {
    setValue("images", imageGroups);
  }, [imageGroups, setValue]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || !selectedColor) {
      toast.error("Please select a color before uploading.");
      return;
    }

    const selectedFiles = Array.from(event.target.files);
    const storage = getStorage(firebaseApp);
    setIsLoading(true);

    try {
      const uploadedUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;
          const storageRef = ref(storage, `products/${fileName}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          return new Promise<string>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              null,
              (error) => reject(error),
              async () => {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                resolve(downloadURL);
              }
            );
          });
        })
      );

      setImageGroups((prev) => {
        const exists = prev.some((group) => group.color === selectedColor);
        if (exists) {
          return prev.map((group) =>
            group.color === selectedColor
              ? { ...group, images: [...group.images, ...uploadedUrls] }
              : group
          );
        } else {
          return [
            ...prev,
            {
              colorCode:
                colors.find((c) => c.color === selectedColor)?.colorCode || "",
              color: selectedColor,
              images: uploadedUrls,
            },
          ];
        }
      });

      toast.success("Images uploaded successfully.");
    } catch {
      toast.error("Failed to upload images.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (color: string, index: number) => {
    setImageGroups((prev) =>
      prev.map((group) =>
        group.color === color
          ? { ...group, images: group.images.filter((_, i) => i !== index) }
          : group
      )
    );
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const updatedProduct = {
      ...product,
      ...data,
      finalPrice,
      images: imageGroups,
    };

    onUpdate(updatedProduct);
  };

  return (
    isOpen && (
      <>
        {isLoading && <Loader />}
        <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-black bg-opacity-50 p-4 pt-24 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm text-gray-500 hover:text-red-500 hover:bg-gray-100 transition-colors duration-200 z-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <Heading title="Edit Product" center />
            <form
              className="space-y-4 text-sm"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Inputs */}
              <Input
                id="name"
                label="Name"
                register={register}
                errors={errors}
                required
              />
              <Input
                id="price"
                label="Price (INR)"
                type="number"
                register={register}
                errors={errors}
                required
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setItemPrice(val);
                  const discountAmt = val * (discount / 100);
                  setFinalPrice(val - discountAmt);
                }}
              />
              <Input
                id="brand"
                label="Brand"
                register={register}
                errors={errors}
                required
              />
              <Input
                id="weight"
                label="Weight (gram)"
                type="number"
                register={register}
                errors={errors}
                required
              />
              <TextArea
                id="description"
                label="Description"
                register={register}
                errors={errors}
                required
              />
              <Input
                id="category"
                label="Category"
                register={register}
                errors={errors}
                required
              />

              <Input
                id="discount"
                label="Discount (%)"
                type="number"
                register={register}
                errors={errors}
                required
                disabled={isLoading}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDiscount(val);
                  const discountAmt = itemPrice * (val / 100);
                  setFinalPrice(itemPrice - discountAmt);
                }}
              />

              {/* Final Price */}
              <div className="text-lg font-semibold">
                Price:{" "}
                <span className="line-through text-gray-500">
                  {product.price}
                </span>{" "}
                <span className="text-red-500">₹{finalPrice}</span>
              </div>

              {/* In Stock Checkbox */}
              <CustomCheckBox
                id="inStock"
                register={register}
                label="Product is in stock"
              />

              {/* Image Section */}
              <div>
                <div className="font-semibold text-sm">
                  Product Images by Color
                </div>
                {imageGroups.map((group) => (
                  <div key={group.color} className="mt-4">
                    <div className="flex items-center font-semibold text-sm">
                      <span
                        style={{ backgroundColor: group.colorCode }}
                        className="w-4 h-4 rounded-full inline-block mr-2"
                      />
                      {group.color}
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {group.images.map((img, i) => (
                        <div
                          key={i}
                          className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={img}
                            alt="Product"
                            layout="fill"
                            objectFit="cover"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                            onClick={() => handleRemoveImage(group.color, i)}
                          >
                            <FiTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Color Picker */}
                <label className="block mt-2 text-sm font-semibold">
                  Select Color
                </label>
                <select
                  className="w-full border p-2 mt-1 rounded"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="">Choose a color</option>
                  {colors.map((color) => (
                    <option key={color.colorCode} value={color.color}>
                      {color.color}
                    </option>
                  ))}
                </select>

                {/* Image Upload */}
                <label className="mt-2 flex items-center justify-center border border-dashed p-2 cursor-pointer text-blue-500 text-sm">
                  <FiUpload size={18} />
                  <span className="ml-2">Upload Images</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-4">
                <Button lable="Cancel" onClick={onClose} />
                <Button
                  lable={isLoading ? "Updating..." : "Update Product"}
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </>
    )
  );
};

export default EditProductModal;
