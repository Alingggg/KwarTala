import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "default" | "sm" | "lg";
}

const buttonStyles = {
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  variants: {
    primary:
      "bg-auburn-500 text-white hover:bg-auburn-600 focus:ring-auburn-500",
    secondary:
      "bg-ash-gray-700 text-white hover:bg-ash-gray-600 focus:ring-ash-gray-500",
  },
  sizes: {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  },
};

function Button({
  className,
  variant = "primary",
  size = "default",
  children,
}: ButtonProps) {
  const variantClass = buttonStyles.variants[variant];
  const sizeClass = buttonStyles.sizes[size];

  return (
    <button
      className={`${buttonStyles.base} ${variantClass} ${sizeClass} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
