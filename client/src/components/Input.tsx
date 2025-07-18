interface InputProps {
  type?: "text" | "email" | "password" | "number" | "month";
  id: string;
  placeholder?: string;
  value?: string;
  min?: string;
  max?: string;
}

function Input({ type, ...otherProps }: InputProps) {
  return (
    <input
      type={type}
      {...otherProps}
      className={`w-full bg-timberwolf-800 border border-ash-gray-700 rounded-md p-2 px-3 text-night-500 focus:ring-2 focus:ring-night-600 outline-none ${
        type === "number"
          ? "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          : ""
      }`}
      style={type === "number" ? { MozAppearance: "textfield" } : undefined}
    />
  );
}

export default Input;
