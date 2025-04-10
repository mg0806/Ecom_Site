"use client";
import { Product, Review, Order } from "@prisma/client";
import { SafeUser } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Heading from "@/components/universal/Heading";
import { Rating } from "@mui/material";
import Input from "@/components/inputs/input";
import Button from "@/components/universal/Button";
import toast from "react-hot-toast";
import axios from "axios";
import { JsonArray } from "@prisma/client/runtime/library";

interface AddRatingProps {
  product: Product & {
    reviews: Review[];
  };
  user:
    | (SafeUser & {
        orders: Order[];
      })
    | null;
}

const AddRating: React.FC<AddRatingProps> = ({ product, user }) => {
  const [isLoading, setIsLodaing] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLodaing(true);
    if (data.rating === 0) {
      setIsLodaing(false);
      return toast.error(" Please Select Rating");
    }
    const ratingData = { ...data, userId: user?.id, product: product };
    // console.log(ratingData);
    axios
      .post("/api/rating", ratingData)
      .then(() => {
        toast.success("Rating Submitted");
        router.refresh();
        reset();
      })
      .catch((error) => {
        // console.log("error", error);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLodaing(false);
      });
  };

  if (!user || !product) {
    return null;
  }

  const deliveredOrder = user?.orders.some((order) => {
    const products = order.products as JsonArray | null; // Assert products as JsonArray (or null)

    if (Array.isArray(products)) {
      // Check if each product is an object and has the 'id' property
      return products.some((item) => {
        if (item && typeof item === "object" && "id" in item) {
          return item.id === product.id && order.deliveryStatus === "delivered";
        }
        return false;
      });
    }

    return false; // If products is not an array or doesn't contain valid items, return false
  });

  const userReview = product?.reviews.find((review: Review) => {
    return review.userId === user.id;
  });

  if (userReview || !deliveredOrder) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4 sm:px-6 lg:px-0 flex flex-col gap-4">
      <Heading title="Rate this product" />

      <div className="w-full">
        <Rating
          onChange={(event, newValue) => {
            setCustomValue("rating", newValue);
          }}
        />
      </div>

      <div className="w-full">
        <Input
          id="comment"
          label="Comment"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>

      <div className="w-full">
        <Button
          lable={isLoading ? "Loading" : "Rate Product"}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};

export default AddRating;
