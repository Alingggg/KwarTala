function AddExpenseModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h2>Add Expense</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default AddExpenseModal;
