import { FiEdit, FiTrash2 } from "@/assets/icons";

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
  return (
    <div className="bg-ash-gray-900 p-4 rounded-lg flex items-center text-white">
      <div className={`w-10 h-10 rounded-full ${iconColor} mr-4`}></div>
      <div className="flex-grow grid grid-cols-3 items-center">
        <span className="font-medium">{category}</span>
        <span className="font-semibold text-center">P{amount.toFixed(2)}</span>
        <span className="text-ash-gray-400 text-right">{description}</span>
      </div>
      <div className="ml-6 flex items-center space-x-4">
        <button className="text-ash-gray-400 hover:text-white">
          <FiEdit size={20} />
        </button>
        <button className="text-ash-gray-400 hover:text-auburn-500">
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
}

export default ExpenseCard;
