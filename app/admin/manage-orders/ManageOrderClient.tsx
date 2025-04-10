"use client";

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/Utils/formatPrice";
import Heading from "@/components/universal/Heading";
import Status from "@/components/Status";
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/components/ActionBtn";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import moment from "moment";
import { products } from "../../../Utils/products";
import Loader from "@/components/universal/Loader";

interface ManageOrderClientProps {
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};

const ManageOrderClient: React.FC<ManageOrderClientProps> = ({ orders }) => {
  const router = useRouter();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  let rows: any = [];
  if (orders) {
    // console.log(orders);
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount / 100),
        paymentStatus: order.status,
        date: moment(order.createdDate).fromNow(),
        deliverySatus: order.deliveryStatus,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "customer", headerName: "Customer Name", width: 130 },
    {
      field: "amount",
      headerName: "Amount(INR)",
      width: 130,
      renderCell: (params) => {
        return (
          <div className=" font-bold text-slate-800">{params.row.amount}</div>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params.row.paymentStatus === "pending" ? (
              <Status
                text="Pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color=" text-slate-700"
              />
            ) : params.row.paymentStatus === "complete" ? (
              <Status
                text="Completed"
                icon={MdDone}
                bg="bg-green-200"
                color=" text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: "deliverySatus",
      headerName: "Delivery Satus",
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            {params.row.deliverySatus === "pending" ? (
              <Status
                text="Pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color=" text-slate-700"
              />
            ) : params.row.deliverySatus === "dispatched" ? (
              <Status
                text="Dispatched"
                icon={MdDeliveryDining}
                bg="bg-purple-200"
                color=" text-purple-700"
              />
            ) : params.row.deliverySatus === "delivered" ? (
              <Status
                text="Delivered"
                icon={MdDone}
                bg="bg-green-200"
                color=" text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },

    { field: "date", headerName: "Date", width: 130 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const isLoading = loadingOrderId === params.row.id;
        return (
          <div className=" flex justify-between gap-4 w-full">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {" "}
                <ActionBtn
                  icon={MdDeliveryDining}
                  onClick={() => {
                    handelDispatch(params.row.id);
                  }}
                />
                <ActionBtn
                  icon={MdDone}
                  onClick={() => {
                    handelDeliver(params.row.id);
                  }}
                />
                <ActionBtn
                  icon={MdRemoveRedEye}
                  onClick={() => {
                    setLoading(true);
                    router.push(`/order/${params.row.id}`);
                  }}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  const handelDispatch = useCallback(
    (id: string) => {
      setLoadingOrderId(id);
      axios
        .put("/api/order", {
          id,
          deliveryStatus: "dispatched",
        })
        .then((res) => {
          toast.success("Order Dispatched");
          router.refresh();
          setLoadingOrderId(null);
        })
        .catch((err) => {
          toast.error("Something went wrong");
          // console.log(err);
        });
    },
    [router]
  );

  const handelDeliver = useCallback(
    (id: string) => {
      setLoadingOrderId(id);

      axios
        .put("/api/order", {
          id,
          deliveryStatus: "delivered",
        })
        .then((res) => {
          toast.success("Order Delivered");
          router.refresh();
          setLoadingOrderId(null);
        })
        .catch((err) => {
          toast.error("Something went wrong");
          // console.log(err);
        });
    },
    [router]
  );
  if (loading) {
    return <Loader />;
  }
  return (
    <div className=" max-w-[1150px] m-auto text-xl">
      <div className=" mb-4 mt-8">
        <Heading title="Manage Orders" center />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageOrderClient;
