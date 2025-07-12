import { Button } from "@/components";
import { FiX, FiAlertTriangle } from "@/assets/icons";

interface DeleteExpenseModalProps {
  onClose: () => void;
  category: string;
  amount: number;
  description: string;
}

function DeleteExpenseModal({
  onClose,
  category,
  amount,
  description,
}: DeleteExpenseModalProps) {
  const handleDelete = () => {
    console.log("Deleting");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-ash-gray-900 p-8 rounded-lg w-full max-w-sm text-night-500 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-night-700 hover:text-night-500"
        >
          <FiX size={24} />
        </button>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-auburn-900 mb-4">
          <FiAlertTriangle className="h-6 w-6 text-auburn-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Delete Expense</h2>
        <p className="text-night-600 mb-6">
          Are you sure you want to delete this expense? This action cannot be
          undone.
        </p>
        <div className="bg-timberwolf-800 p-4 rounded-md text-left mb-6 text-sm">
          <p>
            <span className="font-semibold">Category:</span> {category}
          </p>
          <p>
            <span className="font-semibold">Description:</span> {description}
          </p>
          <p>
            <span className="font-semibold">Amount:</span> P{amount.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            variant="danger"
            className="w-full"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteExpenseModal;
