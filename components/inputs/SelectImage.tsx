"use client";

import { ImageType } from "@/app/admin/add-products/AddProductForm";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface SelectImageProps {
  item?: ImageType;
  handleFileChange: (files: FileList | null) => void; // ✅ Accept multiple files
}

const SelectImage: React.FC<SelectImageProps> = ({
  item,
  handleFileChange,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        acceptedFiles.forEach((file) => dataTransfer.items.add(file));
        handleFileChange(dataTransfer.files); // ✅ Pass all selected images
      }
    },
    [handleFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, // ✅ Allow multiple image selection
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-slate-400 p-3 border-dashed cursor-pointer text-sm font-normal text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-all"
    >
      <input {...getInputProps()} multiple />
      {isDragActive ? (
        <p className="text-blue-500">Drop Images Here...</p>
      ) : (
        <p className="text-slate-600">Upload {item?.color} Images</p>
      )}
    </div>
  );
};

export default SelectImage;
