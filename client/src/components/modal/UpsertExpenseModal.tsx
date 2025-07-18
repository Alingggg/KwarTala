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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 md:p-8">
      <div className="bg-ash-gray-900 p-5 md:p-7 rounded-lg w-full max-w-sm md:max-w-md text-night-500 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-night-700 hover:text-night-500 z-10"
        >
          <FiX size={18} className="md:w-5 md:h-5" />
        </button>
        <h2 className="text-lg md:text-xl font-bold mb-5 md:mb-6 pr-8">
          {id ? "Edit" : "Add"} Expense
        </h2>
        <form className="space-y-4 md:space-y-5">
          <div>
            <label
              htmlFor="amount"
              className="block text-xs md:text-sm font-semibold text-night-600 mb-1"
            >
              Amount
            </label>
            <Input id="amount" type="number" />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-xs md:text-sm font-semibold text-night-600 mb-1"
            >
              Date
            </label>
            <Input id="date" type="text" />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-xs md:text-sm font-semibold text-night-600 mb-1"
            >
              Category
            </label>
            <Input id="category" type="text" />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-xs md:text-sm font-semibold text-night-600 mb-1"
            >
              Description
            </label>
            <Input id="description" type="text" />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-auto text-xs md:text-sm px-3 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              className="w-full sm:w-auto text-xs md:text-sm px-3 py-2"
            >
              {id ? "Save Changes" : "Add Expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpsertExpenseModal;
