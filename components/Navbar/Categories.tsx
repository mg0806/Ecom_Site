"use client";

import { useState, useEffect } from "react";
import { categories } from "@/Utils/Categories";
import Container from "../universal/Container";
import Category from "./Category";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loader from "@/components/universal/Loader"; // Import Loader

const Categories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500); // Simulate loading delay
    return () => clearTimeout(timer);
  }, [category]);

  if (!isMainPage) {
    return null;
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="bg-white w-full">
        <Container>
          <div className="pt-4 pb-2 px-2 sm:px-0">
            <div
              className="
            flex flex-row items-center 
            gap-4 sm:gap-6 lg:gap-10
            overflow-x-auto scrollbar-hide 
            sm:flex-wrap sm:justify-center sm:overflow-x-visible
          "
            >
              {isLoading ? (
                <Loader />
              ) : (
                categories.map((item) => (
                  <Category
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    selected={
                      category === item.label ||
                      (category === null && item.label === "All")
                    }
                  />
                ))
              )}
            </div>
          </div>
        </Container>
      </div>
    </Suspense>
  );
};

export default Categories;
