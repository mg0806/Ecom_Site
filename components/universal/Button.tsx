"use client";

import { IconType } from "react-icons";

interface ButtonProps {
  lable: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: boolean;
  icon?: IconType;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const Button: React.FC<ButtonProps> = ({
  lable,
  disabled,
  outline,
  small,
  custom,
  icon: Icon,
  type = "button",
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
    w-full flex items-center justify-center gap-2
    rounded-md transition
    border-slate-700
    ${outline ? "bg-white text-slate-700" : "bg-slate-700 text-white"}
    ${
      small
        ? "text-sm font-light py-1 px-2 border"
        : "text-base font-semibold py-3 px-4 border-2"
    }
    ${disabled ? "opacity-70 cursor-not-allowed" : "hover:opacity-80"}
    ${custom || ""}
  `}
    >
      {Icon && <Icon size={small ? 18 : 24} className="shrink-0" />}
      {lable}
    </button>
  );
};

export default Button;
