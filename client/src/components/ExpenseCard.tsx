import { FiEdit, FiTrash2, FiInfo, FiMoreHorizontal } from "@/assets/icons";
import { ExpenseDescriptionModal } from "@/components";
import { useModalContext, useCurrencyContext } from "@/hooks";
import { useState, useEffect, useRef } from "react";
import type { Expense } from "@/types";
import { formatDate } from "@/utils";

interface ExpenseCardProps extends Omit<Expense, "userId"> {
  color?: string;
}

export function ExpenseCard({
  id,
  category,
  description,
  amount,
  date,
  color,
}: ExpenseCardProps) {
  const { openModal } = useModalContext();
  const { currency } = useCurrencyContext();
  const [showDescription, setShowDescription] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const formattedDate = formatDate(date, {
    includeMonth: true,
    includeDay: true,
  });

  useEffect(() => {
    if (!showOptions) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  return (
    <>
      <div className="h-20 md:h-24 bg-timberwolf-900 p-3 md:p-4 rounded-2xl flex items-center text-night-500 shadow-md hover:shadow-lg transition-shadow relative">
        {/* Category Icon */}
        <div
          className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3 md:mr-4 flex-shrink-0"
          style={color ? { backgroundColor: color } : undefined}
        ></div>

        {/* Expense Details */}
        <div className="flex-grow min-w-0">
          <div className="font-semibold text-sm md:text-base truncate">
            {category}
          </div>

          <div className="text-xs md:text-sm text-night-700 flex items-center gap-2 mt-1">
            {/* Mobile: Show date */}
            <span className="md:hidden truncate">{formattedDate}</span>
            {/* Desktop: Show description */}
            <span className="hidden md:inline truncate">
              {description || <span className="italic">[No Description]</span>}
            </span>

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

        {/* Desktop: Edit & Delete Actions */}
        <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
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
            className="p-2 text-night-700 hover:text-timberwolf-900 hover:bg-night-600 rounded-full transition-colors"
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
            className="p-2 text-auburn-600 hover:text-white hover:bg-auburn-500 rounded-full transition-colors"
            title="Delete expense"
          >
            <FiTrash2 size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
        {/* Mobile: Options button */}
        <div
          className="md:hidden flex items-center flex-shrink-0 relative"
          ref={optionsRef}
        >
          <button
            onClick={() => setShowOptions((prev) => !prev)}
            className="p-2 text-night-700 hover:text-timberwolf-900 hover:bg-night-600 rounded-full transition-colors"
            title="Options"
          >
            <FiMoreHorizontal size={18} />
          </button>
          {showOptions && (
            <div className="absolute right-0 bottom-14 bg-white rounded-lg shadow-lg z-20 flex flex-col min-w-[120px] py-2">
              <button
                onClick={() => {
                  setShowOptions(false);
                  openModal("UPSERT_EXPENSE", {
                    id,
                    category,
                    amount,
                    description,
                    date,
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 text-left hover:bg-timberwolf-900 text-night-700 rounded-md"
              >
                <FiEdit size={16} /> <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  setShowOptions(false);
                  openModal("DELETE_EXPENSE", {
                    id,
                    category,
                    amount,
                    description,
                    date,
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 text-left hover:bg-auburn-100 text-auburn-600 rounded-md"
              >
                <FiTrash2 size={16} /> <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Expense Description Modal */}
      {showDescription && (
        <ExpenseDescriptionModal
          category={category}
          description={description}
          date={formattedDate}
          amount={amount}
          color={color}
          setShowDescription={setShowDescription}
        />
      )}
    </>
  );
}

export default ExpenseCard;
