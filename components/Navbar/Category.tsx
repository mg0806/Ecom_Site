"use client";

import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useCallback } from "react";
import { IconType } from "react-icons";
import { Suspense } from "react";

interface CategoryProps {
  label: string;
  icon: IconType;
  selected?: boolean;
}

const CategoryComponent: React.FC<CategoryProps> = ({
  label,
  icon: Icon,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const handelClick = useCallback(() => {
    if (label === "All") {
      router.push("/");
    } else {
      let currentQuery = {};

      if (params) {
        currentQuery = queryString.parse(params.toString());
      }

      const updatedQuery: any = {
        ...currentQuery,
        category: label,
      };

      const url = queryString.stringifyUrl(
        {
          url: "/",
          query: updatedQuery,
        },
        {
          skipNull: true,
        }
      );
      router.push(url);
    }
  }, [label, params, router]);

  return (
    <div
      onClick={handelClick}
      className={`
      flex items-center justify-center text-center gap-1 px-3 py-2
      border-b-2 transition cursor-pointer
      hover:text-slate-800
      ${
        selected
          ? "border-b-sky-800 text-slate-800"
          : "border-transparent text-slate-500"
      }
    `}
    >
      <Icon size={18} className="sm:size-5" />
      <div className="font-medium text-xs sm:text-sm whitespace-nowrap">
        {label}
      </div>
    </div>
  );
};

const Category: React.FC<CategoryProps> = (props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <CategoryComponent {...props} />
  </Suspense>
);
export default Category;
