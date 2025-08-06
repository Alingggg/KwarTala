import { useState } from "react";
import { FiEye, FiEyeOff } from "@/assets/icons";

interface InputProps {
  type?: string;
  id: string;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  className?: string;
}

function Input({
  type,
  id,
  placeholder,
  min,
  max,
  className = "",
  ...otherProps
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;
  const step = type === "number" ? "any" : undefined;

  return (
    <div className="relative">
      <input
        type={inputType}
        id={id}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        {...otherProps}
        className={`w-full bg-timberwolf-800 border border-ash-gray-700 rounded-md p-2 px-3 text-night-500 focus:ring-2 focus:ring-night-600 outline-none ${
          type === "password" ? "pr-11" : ""
        } ${className}`}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 px-3 flex items-center"
        >
          {showPassword ? (
            <FiEyeOff className="h-5 w-5 text-night-500 hover:text-night-600" />
          ) : (
            <FiEye className="h-5 w-5 text-night-500 hover:text-night-600" />
          )}
        </button>
      )}
    </div>
  );
}

export default Input;
