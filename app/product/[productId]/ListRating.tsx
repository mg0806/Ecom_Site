"use client";

import Avatar from "@/components/universal/Avatar";
import Heading from "@/components/universal/Heading";
import { Rating } from "@mui/material";
import moment from "moment";
import React from "react";

interface ListRatingProps {
  product: any;
}

const Listrating: React.FC<ListRatingProps> = ({ product }) => {
  if (product.reviews.length === 0) {
    return null;
  }
  return (
    <div className="w-full mt-12 px-4 sm:px-6 lg:px-0">
      <Heading title="Product Review" />

      <div className="mt-4 flex flex-col gap-6">
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review: any) => (
            <div
              key={review.id}
              className="w-full max-w-xl bg-white rounded-lg shadow-sm p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <Avatar src={review.user.image} />
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm">
                  <span className="font-semibold text-gray-800">
                    {review?.user.name}
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    {moment(review.createDate).fromNow()}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <Rating value={review.rating} readOnly size="small" />
                <p className="mt-1 whitespace-pre-wrap break-words">
                  {review.comment}
                </p>
              </div>

              <hr className="mt-4" />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Listrating;
