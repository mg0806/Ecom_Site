"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import Avatar from "../universal/Avatar";
import { AiFillCaretDown } from "react-icons/ai";
import MenuItem from "./MenuItem";
import { signOut } from "next-auth/react";
import BackDrop from "./BackDrop";
import { SafeUser } from "@/types";
import { usePathname, useRouter } from "next/navigation";

interface UserMenuProps {
  currentUser: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const showLoaderAndNavigate = (url: string) => {
    if (pathname !== url) {
      setIsOpen(false);
      setLoading(true);
      router.push(url);
      setTimeout(() => {
        setLoading(false); // You can remove this if you have a global route loader
      }, 500); // small delay for loader visibility
    }
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    setLoading(true);
    await signOut({ callbackUrl: "/Login" });
    setLoading(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {isOpen && <BackDrop onClick={toggleOpen} />} {/* ⬅ Backdrop first */}
      <div className="relative z-30" ref={menuRef}>
        <div
          onClick={toggleOpen}
          className="p-2 border-[1px] border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700"
        >
          <Avatar src={currentUser?.image} />
          <AiFillCaretDown />
        </div>

        {isOpen && (
          <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer z-40">
            {currentUser ? (
              <>
                <MenuItem onClick={() => showLoaderAndNavigate("/orders")}>
                  Your Orders
                </MenuItem>
                {currentUser.role === "ADMIN" && (
                  <MenuItem onClick={() => showLoaderAndNavigate("/admin")}>
                    Admin Dashboard
                  </MenuItem>
                )}
                <hr />
                <MenuItem onClick={handleSignOut}>Log Out</MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => showLoaderAndNavigate("/Login")}>
                  Login
                </MenuItem>
                <MenuItem onClick={() => showLoaderAndNavigate("/Register")}>
                  Register
                </MenuItem>
              </>
            )}
          </div>
        )}
      </div>
      {/* 🔄 Loader */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full z-[1000] bg-white/70 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </>
  );
};

export default UserMenu;
