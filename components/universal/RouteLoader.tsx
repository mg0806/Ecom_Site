"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const RouteLoader = () => {
  const pathname = usePathname(); // Track route changes
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // You can tweak the delay for UX

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white/70 flex items-center justify-center px-4">
      <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );
};

export default RouteLoader;
