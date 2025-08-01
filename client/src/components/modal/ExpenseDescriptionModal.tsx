import { useCurrencyContext } from "@/hooks";
import type { Expense } from "@/types";

interface ExpenseDescriptionModalProps extends Omit<Expense, "id" | "userId"> {
  color?: string;
  setShowDescription: (show: boolean) => void;
}

function ExpenseDescriptionModal({
  category,
  description,
  date,
  amount,
  color,
  setShowDescription,
}: ExpenseDescriptionModalProps) {
  const { currency } = useCurrencyContext();

  return (
    <div
      className="md:hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={() => setShowDescription(false)}
    >
      <div
        className="relative bg-timberwolf-900 rounded-xl w-full max-w-sm shadow-xl border border-timberwolf-400 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowDescription(false)}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-night-400 hover:text-night-600 hover:bg-ash-gray-200 rounded-full text-lg transition-colors duration-200"
          aria-label="Close"
        >
          ×
        </button>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Category with color indicator */}
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-7 rounded-full"
              style={{ backgroundColor: color || "#a22c29" }}
            />
            <h3 className="font-semibold text-base text-night-700 truncate">
              {category}
            </h3>
          </div>

          {/* Amount */}
          <p className="text-xl font-bold text-auburn-600 ml-6">
            {currency}
            {amount.toFixed(2)}
          </p>

          {/* Date */}
          {date && (
            <p className="text-sm text-night-400 ml-6">
              {new Date(date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {/* Description */}
          <div className="ml-6">
            {description && description.trim() !== "" ? (
              <p className="text-sm text-night-500 leading-relaxed break-words">
                {description}
              </p>
            ) : (
              <p className="text-sm italic text-night-400">[No description]</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDescriptionModal;
