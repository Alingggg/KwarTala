import { Button } from "@/components";
import { FiX, FiAlertTriangle } from "@/assets/icons";
import { useCurrencyContext } from "@/hooks";

interface DeleteExpenseModalProps {
  onClose: () => void;
  category: string;
  amount: number;
  description: string;
  date?: string;
}

function DeleteExpenseModal({
  onClose,
  category,
  amount,
  description,
  date,
}: DeleteExpenseModalProps) {
  const handleDelete = () => {
    console.log("Deleting");
    onClose();
  };

  const { currency } = useCurrencyContext();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-ash-gray-900 p-5 md:p-7 rounded-lg w-full max-w-sm text-night-500 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-night-700 hover:text-night-500"
        >
          <FiX size={20} className="md:w-6 md:h-6" />
        </button>
        <div className="mx-auto flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-auburn-900 mb-4">
          <FiAlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-auburn-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2">Delete Expense</h2>
        <p className="text-night-600 mb-4 md:mb-6 text-sm md:text-base">
          Are you sure you want to delete this expense? This action cannot be
          undone.
        </p>
        <div className="bg-timberwolf-800 p-3 md:p-4 rounded-md text-left mb-4 md:mb-6 text-xs md:text-sm">
          <p className="mb-1">
            <span className="font-semibold">Category:</span> {category}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Description:</span> {description}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Amount:</span> {currency}
            {amount.toFixed(2)}
          </p>
          {date && (
            <p>
              <span className="font-semibold">Date:</span> {date}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full text-sm md:text-base"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            variant="danger"
            className="w-full text-sm md:text-base"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteExpenseModal;
