import { Button, Input } from "@/components";
import { FiX } from "@/assets/icons";

function AddExpenseModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-ash-gray-900 p-8 rounded-lg w-full max-w-md text-night-500 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-night-700 hover:text-night-500"
        >
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Add Expense</h2>
        <form className="space-y-4">
          <Input label="Amount" id="amount" type="number" placeholder="P0.00" />
          <Input
            label="Category"
            id="category"
            type="text"
            placeholder="e.g., Food, Transport"
          />
          <Input
            label="Description"
            id="description"
            type="text"
            placeholder="e.g., Jollibee"
          />
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpenseModal;
