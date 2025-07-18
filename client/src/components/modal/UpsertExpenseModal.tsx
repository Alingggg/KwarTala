import { Button, Input } from "@/components";
import { FiX } from "@/assets/icons";

interface UpsertExpenseModalProps {
  onClose: () => void;
  id?: number;
  category?: string;
  amount?: number;
  description?: string;
  date?: string;
}

function UpsertExpenseModal({
  onClose,
  id,
  category,
  amount,
  description,
  date,
}: UpsertExpenseModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-ash-gray-900 p-8 rounded-lg w-full max-w-md text-night-500 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-night-700 hover:text-night-500"
        >
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">
          {id ? "Edit" : "Add"} Expense
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-night-600 mb-1"
            >
              Amount
            </label>
            <Input id="amount" type="number" />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-night-600 mb-1"
            >
              Date
            </label>
            <Input id="date" type="text" />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-night-600 mb-1"
            >
              Category
            </label>
            <Input id="category" type="text" />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-night-600 mb-1"
            >
              Description
            </label>
            <Input id="description" type="text" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              {id ? "Save Changes" : "Add Expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpsertExpenseModal;
