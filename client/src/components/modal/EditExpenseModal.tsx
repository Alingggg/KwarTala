import { Button, Input } from "@/components";
import { FiX } from "@/assets/icons";

interface EditExpenseModalProps {
  onClose: () => void;
  category: string;
  amount: number;
  description: string;
  date?: string;
}

function EditExpenseModal({
  onClose,
  category,
  amount,
  description,
  date,
}: EditExpenseModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-ash-gray-900 p-8 rounded-lg w-full max-w-md text-night-500 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-night-700 hover:text-night-500"
        >
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Edit Expense</h2>
        <form className="space-y-4">
          <Input
            label="Amount"
            id="amount"
            type="number"
            // defaultValue={amount}
          />
          <Input
            label="Date"
            id="date"
            type="text"
            // defaultValue={date}
            placeholder="e.g., Mar. 16"
          />
          <Input
            label="Category"
            id="category"
            type="text"
            // defaultValue={category}
          />
          <Input
            label="Description"
            id="description"
            type="text"
            // defaultValue={description}
          />
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpenseModal;
