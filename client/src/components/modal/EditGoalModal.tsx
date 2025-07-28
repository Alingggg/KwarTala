import { useState, useEffect } from "react";
import { FiTarget, FiX, FiTrash2 } from "@/assets/icons";
import { Button } from "@/components";
import { useCurrencyContext } from "@/hooks";

interface Goal {
  id: string;
  category: string;
  targetAmount: number;
  currentSpent: number;
  color: string;
}

interface EditGoalModalProps {
  onClose: () => void;
  goal: Goal;
}

const categories = [
  { name: "Food", color: "#54876e" },
  { name: "Transportation", color: "#a22c29" },
  { name: "Entertainment", color: "#832221" },
  { name: "Shopping", color: "#902923" },
  { name: "Bills", color: "#757759" },
  { name: "Others", color: "#999b7a" },
];

function EditGoalModal({ onClose, goal }: EditGoalModalProps) {
  const [formData, setFormData] = useState({
    category: "",
    targetAmount: "",
    color: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { currency } = useCurrencyContext();

  // Pre-populate form with existing goal data
  useEffect(() => {
    if (goal) {
      setFormData({
        category: goal.category,
        targetAmount: goal.targetAmount.toString(),
        color: goal.color,
      });
    }
  }, [goal]);

  const handleCategorySelect = (category: { name: string; color: string }) => {
    setFormData((prev) => ({
      ...prev,
      category: category.name,
      color: category.color,
    }));
    // Clear category error when selected
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    setFormData((prev) => ({
      ...prev,
      targetAmount: value,
    }));
    // Clear amount error when typing
    if (errors.targetAmount) {
      setErrors((prev) => ({ ...prev, targetAmount: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.targetAmount || parseInt(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Please enter a valid target amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Here you would typically update the goal
      console.log("Updating goal:", {
        id: goal.id,
        ...formData,
        targetAmount: parseInt(formData.targetAmount),
        currentSpent: goal.currentSpent, // Keep existing spent amount
      });
      onClose();
    }
  };

  const handleDelete = () => {
    // Here you would typically delete the goal
    console.log("Deleting goal:", goal.id);
    onClose();
  };

  if (!goal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-ash-gray-900 p-8 rounded-lg w-full max-w-md text-night-500 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-night-700 hover:text-night-500"
        >
          <FiX size={24} />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FiTarget className="text-night-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold">Edit Goal</h2>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-auburn-500 hover:text-auburn-400 hover:bg-auburn-500 hover:bg-opacity-10 rounded-full transition-colors"
          >
            <FiTrash2 size={18} />
          </button>
        </div>

        {/* Current Progress */}
        <div className="bg-timberwolf-700 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-night-600 mb-2">
            Current Progress
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-ash-gray-400">
              {currency}
              {goal.currentSpent.toLocaleString()} spent
            </span>
            <span className="text-sm font-medium text-night-600">
              {((goal.currentSpent / goal.targetAmount) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-ash-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (goal.currentSpent / goal.targetAmount) * 100,
                  100
                )}%`,
                backgroundColor: goal.color,
              }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-night-600 mb-3">
              Select Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.category === category.name
                      ? "border-night-600 bg-timberwolf-700"
                      : "border-ash-gray-700 hover:border-ash-gray-600"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm font-medium text-night-600">
                      {category.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-auburn-500 text-sm mt-2">{errors.category}</p>
            )}
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-night-600 mb-2">
              Target Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-ash-gray-400 text-base">{currency}</span>
              </div>
              <input
                type="text"
                value={formData.targetAmount}
                onChange={handleAmountChange}
                placeholder="0"
                className={`w-full pl-8 pr-4 py-3 bg-timberwolf-700 border rounded-lg text-night-600 placeholder-ash-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.targetAmount
                    ? "border-auburn-500 focus:ring-auburn-500"
                    : "border-ash-gray-600 focus:ring-night-600 focus:border-night-600"
                }`}
              />
            </div>
            {errors.targetAmount && (
              <p className="text-auburn-500 text-sm mt-2">
                {errors.targetAmount}
              </p>
            )}
            {formData.targetAmount && (
              <p className="text-ash-gray-400 text-sm mt-2">
                {currency}
                {parseInt(formData.targetAmount || "0").toLocaleString()}
              </p>
            )}
          </div>

          {/* Preview Changes */}
          {(formData.category !== goal.category ||
            parseInt(formData.targetAmount) !== goal.targetAmount) && (
            <div className="bg-timberwolf-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-night-600 mb-2">
                Preview Changes
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: formData.color }}
                  ></div>
                  <span className="font-medium text-night-600">
                    {formData.category}
                  </span>
                </div>
                <span className="font-bold text-night-600">
                  {currency}
                  {parseInt(formData.targetAmount || "0").toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Save Changes
            </Button>
          </div>
        </form>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="bg-ash-gray-900 rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-bold text-night-600 mb-2">
                Delete Goal
              </h3>
              <p className="text-ash-gray-400 mb-6">
                Are you sure you want to delete the "{goal.category}" goal? This
                action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-auburn-500 hover:bg-auburn-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditGoalModal;
