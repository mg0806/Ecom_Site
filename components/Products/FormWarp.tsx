import React from "react";

const FormWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-12 sm:pt-16 md:pt-12 pb-12">
      <div className="w-full max-w-md sm:max-w-lg flex flex-col items-center gap-6 shadow-xl shadow-slate-300 rounded-lg p-4 sm:p-6 md:p-8 bg-white">
        {children}
      </div>
    </div>
  );
};

export default FormWrap;
