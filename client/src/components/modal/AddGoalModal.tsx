import { useState } from "react";
import { FiTarget, FiX } from "react-icons/fi";
import { Button } from "@/components";
import { useCurrencyContext } from "@/hooks";

const categories = [
  { name: "Food", color: "#6aa384" },
  { name: "Transportation", color: "#a22c29" },
  { name: "Entertainment", color: "#832221" },
  { name: "Shopping", color: "#d4a043" },
  { name: "Bills", color: "#8f8567" },
  { name: "Others", color: "#7fa08e" },
];

function AddGoalModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    category: "",
    targetAmount: "",
    color: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { currency } = useCurrencyContext();

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
      // Here you would typically save the goal
      console.log("Adding new goal:", {
        ...formData,
        targetAmount: parseInt(formData.targetAmount),
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-timberwolf-900 p-8 rounded-lg w-full max-w-md text-night-500 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-night-700 hover:text-night-500 cursor-pointer"
        >
          <FiX size={24} />
        </button>

        <div className="flex items-center mb-6">
          <FiTarget className="text-night-600 mr-3" size={24} />
          <h2 className="text-2xl font-bold">Add New Goal</h2>
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
                      : "border-timberwolf-500 hover:border-timberwolf-400"
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
                <span className="text-night-700 text-base">{currency}</span>
              </div>
              <input
                type="text"
                value={formData.targetAmount}
                onChange={handleAmountChange}
                placeholder="0"
                className={`w-full pl-8 pr-4 py-3 bg-timberwolf-700 border rounded-lg text-night-600 placeholder-night-700 focus:outline-none focus:ring-2 transition-colors ${
                  errors.targetAmount
                    ? "border-auburn-500 focus:ring-auburn-500"
                    : "border-timberwolf-400 focus:ring-night-600 focus:border-night-600"
                }`}
              />
            </div>
            {errors.targetAmount && (
              <p className="text-auburn-500 text-sm mt-2">
                {errors.targetAmount}
              </p>
            )}
            {formData.targetAmount && (
              <p className="text-night-700 text-sm mt-2">
                {currency}
                {parseInt(formData.targetAmount || "0").toLocaleString()}
              </p>
            )}
          </div>

          {/* Preview */}
          {formData.category && formData.targetAmount && (
            <div className="bg-timberwolf-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-night-600 mb-2">
                Preview
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
                  {parseInt(formData.targetAmount).toLocaleString()}
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
              Add Goal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGoalModal;
