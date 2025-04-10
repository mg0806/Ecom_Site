"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Container from "../universal/Container";
import AdminNavitem from "./adminNavItem";
import {
  MdDashboard,
  MdDns,
  MdFormatListBulleted,
  MdLibraryAdd,
} from "react-icons/md";
import Loader from "@/components/universal/Loader"; // Import the loader

const AdminNav = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State for loader

  // Handle navigation with loader
  const handleNavigation = useCallback(
    async (url: string) => {
      if (pathName !== url) {
        setLoading(true); // Show loader
        router.push(url);
      }
    },
    [pathName, router]
  );

  // Stop loading when navigation is complete
  useEffect(() => {
    setLoading(false);
  }, [pathName]);

  return (
    <>
      <div className="w-full shadow-sm top-20 border-b-[1px] pt-4">
        <Container>
          <div className="flex flex-row items-center justify-between md:justify-center gap-8 md:gap-12 overflow-x-auto flex-nowrap">
            <button onClick={() => handleNavigation("/admin")}>
              <AdminNavitem
                label="Summary"
                icon={MdDashboard}
                selected={pathName === "/admin"}
              />
            </button>
            <button onClick={() => handleNavigation("/admin/add-products")}>
              <AdminNavitem
                label="Add Products"
                icon={MdLibraryAdd}
                selected={pathName === "/admin/add-products"}
              />
            </button>
            <button onClick={() => handleNavigation("/admin/manage-products")}>
              <AdminNavitem
                label="Manage Products"
                icon={MdDns}
                selected={pathName === "/admin/manage-products"}
              />
            </button>
            <button onClick={() => handleNavigation("/admin/manage-orders")}>
              <AdminNavitem
                label="Manage Orders"
                icon={MdFormatListBulleted}
                selected={pathName === "/admin/manage-orders"}
              />
            </button>
          </div>
        </Container>
      </div>

      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
    </>
  );
};

export default AdminNav;
