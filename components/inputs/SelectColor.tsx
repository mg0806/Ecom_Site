"use client";

import { ImageType } from "@/app/admin/add-products/AddProductForm";
import { useCallback, useEffect, useState } from "react";
import SelectImage from "./SelectImage";
import Button from "../universal/Button";

interface SelectedColorProps {
  item: ImageType;
  addImageToState: (value: ImageType) => void;
  removeImageFromState: (color: string, imageToRemove: File) => void;
  isProductCreated: boolean;
}

const SelectColors: React.FC<SelectedColorProps> = ({
  item,
  addImageToState,
  removeImageFromState,
  isProductCreated,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false);
      setFiles([]);
    }
  }, [isProductCreated]);

  // Handle multiple image selection
  const handleFileChange = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;
      const fileArray = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...fileArray]);

      addImageToState({
        ...item,
        images: [...files, ...fileArray], // ✅ Allow multiple images per color
      });
    },
    [addImageToState, item, files]
  );

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSelected(e.target.checked);
      if (!e.target.checked) {
        setFiles([]);
        addImageToState({ ...item, images: [] });
      }
    },
    [item, addImageToState]
  );

  const handleRemoveImage = (imageToRemove: File) => {
    const updatedFiles = files.filter((file) => file !== imageToRemove);
    setFiles(updatedFiles);
    removeImageFromState(item.color, imageToRemove);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto border-b-[1.2px] border-slate-200 items-start p-2 sm:p-4">
      <div className="flex flex-row gap-2 items-center h-[60px]">
        <input
          id={item.color}
          type="checkbox"
          checked={isSelected}
          onChange={handleCheck}
          className="cursor-pointer"
        />
        <label
          htmlFor={item.color}
          className="font-medium cursor-pointer text-sm sm:text-base"
        >
          {item.color}
        </label>
      </div>

      {isSelected && (
        <div className="sm:col-span-2 w-full">
          <SelectImage item={item} handleFileChange={handleFileChange} />
        </div>
      )}

      {files.length > 0 && (
        <div className="sm:col-span-2 flex flex-col gap-2 mt-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex flex-wrap gap-2 text-sm items-center justify-between"
            >
              <p className="truncate max-w-[200px]">{file.name}</p>
              <Button
                lable="Remove"
                small
                outline
                onClick={() => handleRemoveImage(file)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectColors;
