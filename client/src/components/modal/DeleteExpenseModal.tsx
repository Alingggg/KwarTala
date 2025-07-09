function DeleteExpenseModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <p>Are you sure you want to delete this item?</p>
        <button onClick={onClose}>Cancel</button>
        <button
          onClick={() => {
            console.log("Deleting");
            onClose();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteExpenseModal;
