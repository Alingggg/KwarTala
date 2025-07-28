import { useCurrencyContext } from "@/hooks";
import type { Expense } from "@/types";

interface ExpenseDescriptionModalProps extends Omit<Expense, "id" | "userId"> {
  setShowDescription: (show: boolean) => void;
}

function ExpenseDescriptionModal({
  category,
  description,
  date,
  amount,
  setShowDescription,
}: ExpenseDescriptionModalProps) {
  const { currency } = useCurrencyContext();
  return (
    <div
      className="md:hidden fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={() => setShowDescription(false)}
    >
      <div
        className="bg-timberwolf-900 text-night-500 p-5 rounded-xl max-w-sm w-full shadow-2xl border border-timberwolf-400"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">{category}</h3>
          <button
            onClick={() => setShowDescription(false)}
            className="text-night-300 hover:text-night-500 text-2xl p-1 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="text-base mb-3 leading-relaxed">{description}</p>
        {date && <p className="text-xs text-night-400 mb-3">Date: {date}</p>}
        <p className="text-xl font-bold text-night-500">
          {currency}
          {amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default ExpenseDescriptionModal;
