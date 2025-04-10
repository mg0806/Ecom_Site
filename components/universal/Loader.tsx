import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[1000] bg-white/10 flex items-center justify-center px-4">
      <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );
};

export default Loader;
