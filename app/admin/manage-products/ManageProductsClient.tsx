"use client";

import { useState, useCallback } from "react";
import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/Utils/formatPrice";
import Heading from "@/components/universal/Heading";
import Status from "@/components/Status";
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/components/ActionBtn";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/libs/firebase";
import EditProductModal from "./editModal";
import Loader from "@/components/universal/Loader";

interface ManageProductClientProps {
  products: Product[];
}

const ManageProductsClient: React.FC<ManageProductClientProps> = ({
  products,
}) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openModal, setOpenModal] = useState(false);

  let rows = products.map((product) => {
    // Ensure images is an array before accessing it
    const parsedImages = Array.isArray(product.images)
      ? (product.images as Array<{
          color: string;
          colorCode: string;
          images: string[];
        }>)
      : [];

    return {
      id: product.id,
      name: product.name,
      price: formatPrice(product.price),
      category: product.category,
      brand: product.brand,
      description: product.description,
      inStock: product.inStock,
      weight: product.weight,
      finalPrice: product.finalPrice,
      // Store images grouped by colorCode
      imagesByColor: parsedImages.reduce((acc, variant) => {
        acc[variant.colorCode] = variant.images;
        return acc;
      }, {} as Record<string, string[]>), // Object where keys are color codes
    };
  });

  const handleToggleStock = useCallback(
    (id: string, inStock: boolean) => {
      setLoading(true);
      axios
        .put("/api/product", { id, inStock: !inStock })
        .then(() => {
          toast.success("Product Status updated");
          router.refresh();
          setLoading(false);
        })
        .catch(() => toast.error("Something went wrong"));
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string, images: any[]) => {
      setLoading(true);
      toast("Deleting product, please wait");

      for (const item of images) {
        if (item.image) {
          const imageRef = ref(storage, item.image);
          await deleteObject(imageRef);
        }
      }

      axios
        .delete(`/api/product/${id}`)
        .then(() => {
          toast.success("Product Deleted");
          router.refresh();
          setLoading(false);
        })
        .catch((err) => console.log("Error deleting product", err));
    },
    [router, storage]
  );

  // ✅ Fix: Ensure selectedProduct is fully populated
  const handleEdit = (product: Product) => {
    // console.log("handel edit", product);
    setSelectedProduct({ ...product }); // Use a shallow copy to avoid unintended state mutations
    setOpenModal(true);
  };

  // ✅ Fix: Ensure updatedProduct updates the state correctly
  const handleUpdate = async (updatedProduct: Product) => {
    // console.log(updatedProduct);
    setLoading(true);
    if (!updatedProduct) return;
    axios
      .put(`/api/product/${updatedProduct.id}`, updatedProduct)
      .then(() => {
        toast.success("Product updated successfully");
        setOpenModal(false);
        setLoading(false);
        router.refresh();
      })
      .catch(() => toast.error("Failed to update product"));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "price",
      headerName: "Price(INR)",
      width: 100,
      renderCell: (params) => (
        <div className="font-bold text-slate-800">{params.row.price}</div>
      ),
    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "brand", headerName: "Brand", width: 100 },
    {
      field: "inStock",
      headerName: "Stock Status",
      width: 120,
      renderCell: (params) => (
        <Status
          text={params.row.inStock ? "In Stock" : "Out of Stock"}
          icon={params.row.inStock ? MdDone : MdClose}
          bg={params.row.inStock ? "bg-teal-200" : "bg-rose-200"}
          color={params.row.inStock ? "text-teal-700" : "text-rose-700"}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-between gap-4 w-full">
          <ActionBtn
            icon={MdCached}
            onClick={() => handleToggleStock(params.row.id, params.row.inStock)}
          />
          <ActionBtn
            icon={MdDelete}
            onClick={() => handleDelete(params.row.id, params.row.images ?? [])}
          />
          <ActionBtn
            icon={MdRemoveRedEye}
            onClick={() => handleEdit(params.row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      {loading && <Loader />}

      <Heading title="Manage Products" center />
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>

      {openModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ManageProductsClient;
