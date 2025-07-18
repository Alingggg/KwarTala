import { FiEdit, FiTrash2 } from "@/assets/icons";
import { useModalContext, useCurrencyContext } from "@/hooks";

interface ExpenseCardProps {
  id?: string;
  category: string;
  amount: number;
  description: string;
  iconColor: string;
  date?: string;
}

export function ExpenseCard({
  id,
  category,
  amount,
  description,
  iconColor,
  date,
}: ExpenseCardProps) {
  const { openModal } = useModalContext();
  const { currency } = useCurrencyContext();

  return (
    <div className="bg-timberwolf-700 p-4 rounded-lg flex items-center text-night-500">
      <div
        className={`w-10 h-10 rounded-full ${iconColor} mr-4 flex-shrink-0`}
      ></div>
      <div className="flex-grow">
        <div className="font-semibold">{category}</div>
        <div className="text-sm text-night-700">{description}</div>
        {date && <div className="text-xs text-night-600 mt-1">{date}</div>}
      </div>
      <div className="font-semibold text-lg mx-4">
        {currency}
        {amount.toFixed(2)}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() =>
            openModal("UPSERT_EXPENSE", {
              id,
              category,
              amount,
              description,
              date,
            })
          }
          className="p-2 text-night-700 hover:text-timberwolf-900 hover:bg-night-600 rounded-full transition-colors"
          title="Edit expense"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={() =>
            openModal("DELETE_EXPENSE", {
              id,
              category,
              amount,
              description,
              date,
            })
          }
          className="p-2 text-auburn-600 hover:text-white hover:bg-auburn-500 rounded-full transition-colors"
          title="Delete expense"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default ExpenseCard;
