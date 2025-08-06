import { FiChevronDown } from "react-icons/fi";

interface DropdownProps {
  options: { value: string; label: string }[];
  id: string;
  placeholder?: string;
  classname?: string;
}

function Dropdown({
  options,
  id,
  placeholder,
  classname,
  ...restProps
}: DropdownProps) {
  return (
    <div className="relative">
      <select
        id={id}
        className={`w-full bg-timberwolf-800 border border-ash-gray-700 rounded-md p-2 px-3 text-night-500 focus:ring-2 focus:ring-night-600 outline-none ${classname}`}
        {...restProps}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-night-500">
        <FiChevronDown size={18} />
      </span>
    </div>
  );
}

export default Dropdown;
