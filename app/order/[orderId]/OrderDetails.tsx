"use client";

import { formatPrice } from "@/Utils/formatPrice";
import Status from "@/components/Status";
import Heading from "@/components/universal/Heading";
import { Order } from "@prisma/client";
import moment from "moment";
import { useRouter } from "next/navigation";
import { MdAccessTimeFilled, MdDeliveryDining, MdDone } from "react-icons/md";
import OrderItem from "./OrderItem";

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const router = useRouter();

  // Parse the products field if it's a stringified JSON
  const parsedProducts =
    typeof order.products === "string"
      ? JSON.parse(order.products)
      : order.products;

  // console.log(parsedProducts);
  // console.log("order", order);
  return (
    <div className="max-w-[1150px] w-full mx-auto px-4 flex flex-col gap-4">
      <div className="mt-8">
        <Heading title="Order Details" />
      </div>

      <div className="text-sm sm:text-base">Order ID: {order.id}</div>

      <div className="text-sm sm:text-base">
        Total Amount:{" "}
        <span className="font-bold">{formatPrice(order.amount / 100)}</span>
        <br />
        <span className="font-bold"> ( Shipping Charges Included)</span>
      </div>

      {/* Payment Status */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base">
        <span className="font-medium">Payment Status : </span>
        {order.status === "pending" ? (
          <Status
            text="Pending"
            icon={MdAccessTimeFilled}
            bg="bg-slate-200"
            color="text-slate-700"
          />
        ) : order.status === "complete" ? (
          <Status
            text="Completed"
            icon={MdDone}
            bg="bg-green-200"
            color="text-green-700"
          />
        ) : null}
      </div>

      {/* Delivery Status */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base">
        <span className="font-medium">Delivery Status : </span>
        {order.deliveryStatus === "pending" ? (
          <Status
            text="Pending"
            icon={MdAccessTimeFilled}
            bg="bg-slate-200"
            color="text-slate-700"
          />
        ) : order.deliveryStatus === "dispatched" ? (
          <Status
            text="Dispatched"
            icon={MdDeliveryDining}
            bg="bg-purple-200"
            color="text-purple-700"
          />
        ) : order.deliveryStatus === "delivered" ? (
          <Status
            text="Delivered"
            icon={MdDone}
            bg="bg-green-200"
            color="text-green-700"
          />
        ) : null}
      </div>

      <div className="text-sm sm:text-base">
        Date: {moment(order.createdDate).fromNow()}
      </div>

      <div>
        <h2 className="font-semibold mt-6 mb-3 text-base sm:text-lg">
          Products Ordered
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-5 text-sm font-medium text-gray-700 gap-4 pb-2 border-b">
              <div className="justify-self-start">Product Image</div>
              <div className="justify-self-center">Product Name</div>
              <div className="justify-self-center">Color</div>
              <div className="justify-self-center">Price</div>
              <div className="justify-self-center">QTY</div>
            </div>

            {/* Table Rows */}
            {Array.isArray(parsedProducts) &&
              parsedProducts.map((item: any) => (
                <OrderItem key={item.id} item={item} />
              ))}
          </div>
        </div>

        {/* Track Button */}
        <div className="mt-6">
          <button
            onClick={() =>
              router.push(`/order/${order.id}/track?awb=1234567890`)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full sm:w-fit"
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
