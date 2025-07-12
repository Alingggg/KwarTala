interface InputProps {
  type?: "text" | "email" | "password" | "number";
  label?: string;
  id: string;
  placeholder?: string;
}

function Input({ type, label, id, placeholder, ...otherProps }: InputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-night-600 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        {...otherProps}
        className={`w-full bg-timberwolf-800 border border-ash-gray-700 rounded-md p-2 px-3 text-night-500 focus:ring-2 focus:ring-night-600 outline-none ${
          type === "number"
            ? "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            : ""
        }`}
      />
    </div>
  );
}

export default Input;
