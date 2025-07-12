import { FiEdit, FiTrash2 } from "@/assets/icons";
import { useModalContext } from "@/hooks";

interface ExpenseCardProps {
  category: string;
  amount: number;
  description: string;
  iconColor: string;
}

export function ExpenseCard({
  category,
  amount,
  description,
  iconColor,
}: ExpenseCardProps) {
  const { openModal } = useModalContext();
  return (
    <div className="bg-timberwolf-700 p-4 rounded-lg flex items-center text-night-500">
      <div
        className={`w-10 h-10 rounded-full ${iconColor} mr-4 flex-shrink-0`}
      ></div>
      <div className="flex-grow">
        <div className="font-semibold">{category}</div>
        <div className="text-sm text-night-700">{description}</div>
      </div>
      <div className="font-semibold mx-4">P{amount.toFixed(2)}</div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() =>
            openModal("EDIT_EXPENSE", { category, amount, description })
          }
          className="p-2 text-night-700 hover:text-night-500 hover:bg-ash-gray-400 rounded-full"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={() =>
            openModal("DELETE_EXPENSE", { category, amount, description })
          }
          className="p-2 text-night-700 hover:text-white hover:bg-auburn-500 rounded-full"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default ExpenseCard;
