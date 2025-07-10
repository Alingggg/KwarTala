import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "default" | "sm" | "lg";
  onClick?: () => void;
}

const buttonStyles = {
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  variants: {
    primary:
      "bg-auburn-500 text-white hover:bg-auburn-600 focus:ring-auburn-500",
    secondary:
      "bg-night-600 text-timberwolf-900 hover:bg-night-700 focus:ring-night-600 font-semibold",
  },
  sizes: {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  },
};

function Button({
  children,
  className,
  variant = "primary",
  size = "default",
  onClick,
}: ButtonProps) {
  const variantClass = buttonStyles.variants[variant];
  const sizeClass = buttonStyles.sizes[size];

  return (
    <button
      className={`${buttonStyles.base} ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
