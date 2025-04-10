"use client";

import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import { ChangeEvent } from "react";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  step?: string | number;
  registerOptions?: RegisterOptions;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  required,
  register,
  errors,
  step,
  registerOptions,
  onChange,
}) => {
  const {
    ref,
    onChange: registerOnChange,
    ...rest
  } = register(id, {
    required,
    ...registerOptions,
  });

  return (
    <div className="w-full relative">
      <input
        id={id}
        type={type}
        step={step}
        autoComplete="off"
        disabled={disabled}
        placeholder=""
        ref={ref}
        {...rest}
        aria-invalid={!!errors[id]}
        onChange={(e) => {
          registerOnChange(e);
          onChange?.(e);
        }}
        onWheel={type === "number" ? (e) => e.currentTarget.blur() : undefined}
        className={`peer w-full p-4 pt-6 text-sm sm:text-base outline-none bg-white font-light border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed
          ${errors[id] ? "border-rose-400" : "border-slate-300"}
          ${errors[id] ? "focus:border-rose-400" : "focus:border-slate-300"}
        `}
      />
      <label
        htmlFor={id}
        className={`absolute text-sm sm:text-base cursor-text duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
          peer-focus:scale-75 peer-focus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-slate-400"}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
