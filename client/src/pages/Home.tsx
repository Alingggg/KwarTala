import { Button, ExpenseCard, ExpenseChart } from "@/components";
import { useModalContext, useCurrencyContext } from "@/hooks";
import { mockData as allMonthsData } from "@/assets/mockData";

function Home() {
  const { openModal } = useModalContext();
  const { currency } = useCurrencyContext();

  // Find the current month's data
  const now = new Date();
  const currentMonthName = now.toLocaleString("en-US", { month: "long" });
  const currentYear = now.getFullYear();

  const currentMonthIndex = allMonthsData.findIndex(
    (data) => data.month === currentMonthName && data.year === currentYear
  );

  // Use the found index, or default to 0 if no data exists for the current month
  const displayIndex = currentMonthIndex !== -1 ? currentMonthIndex : 0;
  const mockData = allMonthsData[displayIndex];

  return (
    <div className="p-3 md:p-8">
      {/* Page Header */}
      <div className="mb-5 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-night-600">
            Hello, John
          </h1>
          <p className="text-lg md:text-2xl font-semibold text-night-600">
            {mockData.month} {mockData.year}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-8 mb-5 md:mb-8">
        {/* Budget Section */}
        <div className="bg-timberwolf-900 text-timberwolf-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-center">
          <div className="bg-night-500 p-3 md:p-6 rounded-lg shadow-sm">
            <p className="text-sm text-ash-gray-400">Budget</p>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <p className="text-2xl md:text-4xl font-bold text-timberwolf-900">
                {currency}
                {mockData.remaining.toLocaleString()}
              </p>
              <span className="text-sm md:text-base font-normal text-ash-gray-400">
                remaining of {currency}
                {mockData.monthlyBudget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Budget Progress and Today's Spending */}
          <div className="bg-ash-gray-800 p-3 md:p-4 rounded-lg mt-3 md:mt-4 shadow-inner">
            <Button
              onClick={() =>
                openModal("EDIT_BUDGET", {
                  month: mockData.month,
                  year: mockData.year,
                  currentBudget: mockData.monthlyBudget,
                })
              }
              variant="secondary"
              className="w-full mb-3 md:mb-6 text-sm md:text-base"
            >
              Edit Budget
            </Button>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-night-600">
                  Budget Progress
                </span>
                <span className="text-sm font-semibold text-night-600">
                  {mockData.budgetUsedPercentage}% used
                </span>
              </div>
              <div className="w-full bg-ash-gray-700 rounded-full h-2 md:h-3 shadow-inner">
                <div
                  className={`h-2 md:h-3 rounded-full shadow-sm ${
                    mockData.remaining >= 0 ? "bg-night-700" : "bg-auburn-500"
                  }`}
                  style={{
                    width: `${Math.min(mockData.budgetUsedPercentage, 100)}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs md:text-sm text-night-600 font-medium">
                <span>{currency}0</span>
                <span>
                  {currency}
                  {mockData.monthlyBudget.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Today's Spending */}
            <div className="bg-night-500 p-3 md:p-4 rounded-lg mt-3 md:mt-4 border border-night-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-auburn-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-timberwolf-700">
                    Today's Spending
                  </span>
                </div>
                <span className="text-lg md:text-xl font-bold text-timberwolf-900">
                  {currency}
                  {mockData.spentToday?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => openModal("UPSERT_EXPENSE")}
            className="mt-3 md:mt-4 shadow-sm text-sm md:text-base"
          >
            Add Expense
          </Button>
        </div>

        {/* Expense Chart */}
        <div className="col-span-1 bg-timberwolf-900 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <ExpenseChart monthIndex={displayIndex} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center mb-4 md:mb-6">
          <span className="text-lg md:text-xl font-bold text-night-600">
            Recent Transactions
          </span>
          <div className="flex-grow border-t border-ash-gray-700 ml-4"></div>
        </div>
        <div className="space-y-3 md:space-y-4">
          {mockData.weeks
            .flatMap((week) => week.transactions)
            .slice(0, 10)
            .map((transaction, index) => (
              <ExpenseCard key={transaction.id || index} {...transaction} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
