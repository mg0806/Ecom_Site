import React from "react";

interface BackDropProps {
  onClick: () => void;
}
const BackDrop: React.FC<BackDropProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 w-screen h-screen bg-slate-200 bg-opacity-50 z-30 cursor-pointer"
    />
  );
};

export default BackDrop;
