"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import firebaseApp from "@/libs/firebase";
import { categories } from "@/Utils/Categories";
import { colors } from "@/Utils/Colors";
import CategoryInput from "@/components/inputs/CategoriesInput";
import CustomCheckBox from "@/components/inputs/CustomCheckBox";
import SelectColors from "@/components/inputs/SelectColor";
import TextArea from "@/components/inputs/TextArea";
import Input from "@/components/inputs/input";
import Button from "@/components/universal/Button";
import Heading from "@/components/universal/Heading";
import Loader from "@/components/universal/Loader"; // Import Loader

export type ImageType = {
  color: string;
  colorCode: string;
  images: File[] | null;
};
export type UploadedImageType = {
  color: string;
  colorCode: string;
  images: string[];
};

const AddProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[]>([]);
  const [isProductCreated, setIsProductCreated] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: "",
      weight: "",
    },
  });

  useEffect(() => {
    setCustomValue("images", images);
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages([]);
      setIsProductCreated(false);
    }
  }, [isProductCreated, reset]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      return toast.error("Category is not selected");
    }

    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error("No image is selected");
    }

    // Upload images to Firebase
    const handleImageUploads = async () => {
      toast("Uploading images, please wait...");
      try {
        for (const item of data.images) {
          if (item.images && item.images.length > 0) {
            const uploadedUrls: string[] = [];

            for (const image of item.images) {
              const fileName = `${new Date().getTime()}-${image.name}`;
              const storage = getStorage(firebaseApp);
              const storageRef = ref(storage, `products/${fileName}`);
              const uploadTask = uploadBytesResumable(storageRef, image);

              await new Promise<void>((resolve, reject) => {
                uploadTask.on(
                  "state_changed",
                  null,
                  (error) => reject(error),
                  async () => {
                    const downloadURL = await getDownloadURL(
                      uploadTask.snapshot.ref
                    );
                    uploadedUrls.push(downloadURL);
                    resolve();
                  }
                );
              });
            }

            uploadedImages.push({
              color: item.color,
              colorCode: item.colorCode,
              images: uploadedUrls,
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error uploading images", error);
        return toast.error("Error uploading images");
      }
    };

    await handleImageUploads();

    const productData = { ...data, images: uploadedImages };

    // Add product to the database
    axios
      .post("/api/product", productData)
      .then(() => {
        toast.success("Product Created");
        setIsProductCreated(true);
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong while saving product");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const category = watch("category");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev = []) => {
      return prev.some((item) => item.color === value.color)
        ? prev.map((item) =>
            item.color === value.color
              ? {
                  ...item,
                  images: [...(item.images || []), ...(value.images || [])],
                }
              : item
          )
        : [...prev, { ...value, images: value.images || [] }];
    });
  }, []);

  const removeImageFromState = useCallback(
    (color: string, imageToRemove: File) => {
      setImages((prev) =>
        prev.map((item) =>
          item.color === color
            ? {
                ...item,
                images:
                  item.images?.filter((img) => img !== imageToRemove) || [],
              }
            : item
        )
      );
    },
    []
  );

  return (
    <>
      <Heading title="Add Product" center />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="Price"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="number"
        required
      />

      <Input
        id="brand"
        label="Brand"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="weight"
        label="Weight (gram)"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="number"
        // step="0.01" // ✅ allows decimal input
        required
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckBox
        id="inStock"
        register={register}
        label="Product is in stock"
      />

      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 max-h-[50vh] gap-3 overflow-y-auto">
          {categories.map((item) =>
            item.label === "All" ? null : (
              <CategoryInput
                key={item.label}
                onClick={() => setCustomValue("category", item.label)}
                selected={category === item.label}
                label={item.label}
                icon={item.icon}
              />
            )
          )}
        </div>
      </div>

      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
            Select available product colors and upload images.
          </div>
          <div className="text-sm">
            Each selected color must have an image uploaded.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((item, index) => (
            <SelectColors
              key={index}
              item={item}
              addImageToState={addImageToState}
              removeImageFromState={removeImageFromState}
              isProductCreated={isProductCreated}
            />
          ))}
        </div>
      </div>

      <Button
        lable={isLoading ? "Processing..." : "Add Product"}
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
      />

      {/* Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
    </>
  );
};

export default AddProductForm;
