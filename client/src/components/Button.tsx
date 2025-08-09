import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit";
  className?: string;
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  onClick?: () => void;
}

const buttonStyles = {
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer",
  variants: {
    primary:
      "bg-auburn-500 text-white hover:bg-auburn-600 focus:ring-auburn-500",
    secondary:
      "bg-ash-gray-300 text-timberwolf-900 hover:bg-ash-gray-400 focus:ring-ash-gray-400 font-semibold",
    success:
      "bg-night-600 text-timberwolf-900 hover:bg-night-700 focus:ring-night-600 font-semibold",
    danger:
      "bg-auburn-500 text-white hover:bg-auburn-600 focus:ring-auburn-500 font-semibold",
  },
  sizes: {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  },
};

function Button({
  children,
  type = "button",
  className,
  variant = "primary",
  size = "default",
  disabled = false,
  onClick,
}: ButtonProps) {
  const variantClass = buttonStyles.variants[variant];
  const sizeClass = buttonStyles.sizes[size];

  return (
    <button
      type={type}
      className={`${buttonStyles.base} ${variantClass} ${sizeClass} ${
        className || ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
