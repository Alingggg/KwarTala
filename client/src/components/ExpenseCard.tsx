import { FiEdit, FiTrash2, FiInfo } from "@/assets/icons";
import { ExpenseDescriptionModal } from "@/components";
import { useModalContext, useCurrencyContext } from "@/hooks";
import { useState } from "react";
import type { ExpenseWithId } from "@/types";
import { formatDate } from "@/utils";

interface ExpenseCardProps extends ExpenseWithId {
  iconColor?: string;
}

export function ExpenseCard({
  id,
  category,
  description,
  amount,
  date,
  iconColor = "bg-night-500",
}: ExpenseCardProps) {
  const { openModal } = useModalContext();
  const { currency } = useCurrencyContext();
  const [showDescription, setShowDescription] = useState(false);

  const formattedDate = formatDate(date, {
    includeMonth: true,
    includeDay: true,
  });

  return (
    <>
      <div className="bg-timberwolf-900 p-3 md:p-4 rounded-lg flex items-center text-night-500 shadow-md hover:shadow-lg transition-shadow">
        {/* Icon */}
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${iconColor} mr-3 md:mr-4 flex-shrink-0`}
        ></div>

        {/* Main Content */}
        <div className="flex-grow min-w-0">
          <div className="font-semibold text-sm md:text-base truncate">
            {category}
          </div>

          {/* Mobile: Show date and info button. Desktop: Show description */}
          <div className="text-xs md:text-sm text-night-700 flex items-center gap-2 mt-1">
            <span className="md:hidden truncate">{formattedDate}</span>
            <span className="hidden md:inline truncate">{description}</span>

            {/* Info button (mobile only) */}
            <button
              onClick={() => setShowDescription(true)}
              className="md:hidden text-night-600 hover:text-night-500 hover:bg-night-600 transition-colors flex-shrink-0 p-1 rounded-full"
              title="View details"
            >
              <FiInfo size={14} />
            </button>
          </div>

          {/* Desktop: Show date below description */}
          {date && (
            <div className="text-xs text-night-600 mt-1 hidden md:block">
              {formattedDate}
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="font-semibold text-sm md:text-lg mx-3 md:mx-4 text-right flex-shrink-0">
          {currency}
          {amount.toFixed(2)}
        </div>

        {/* Edit/Delete Actions */}
        <div className="flex items-center space-x-2 md:space-x-2 flex-shrink-0">
          <button
            onClick={() =>
              openModal("UPSERT_EXPENSE", {
                id,
                category,
                amount,
                description,
                date,
              })
            }
            className="p-2 md:p-2 text-night-700 hover:text-timberwolf-900 hover:bg-night-600 rounded-full transition-colors"
            title="Edit expense"
          >
            <FiEdit size={16} className="md:w-[18px] md:h-[18px]" />
          </button>

          <button
            onClick={() =>
              openModal("DELETE_EXPENSE", {
                id,
                category,
                amount,
                description,
                date,
              })
            }
            className="p-2 md:p-2 text-auburn-600 hover:text-white hover:bg-auburn-500 rounded-full transition-colors"
            title="Delete expense"
          >
            <FiTrash2 size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>

      {/* Mobile Description Modal */}
      {showDescription && (
        <ExpenseDescriptionModal
          category={category}
          description={description}
          date={formattedDate}
          amount={amount}
          setShowDescription={setShowDescription}
        />
      )}
    </>
  );
}

export default ExpenseCard;
