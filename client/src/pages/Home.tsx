import { Button, ExpenseCard, ExpenseChart } from "@/components";
import { useModalContext, useCurrencyContext } from "@/hooks";
import { mockData as allMonthsData } from "@/assets/mockData";

function Home() {
  const { openModal } = useModalContext();
  const { currency } = useCurrencyContext();

  // --- Logic to find the current month's data ---
  const now = new Date();
  const currentMonthName = now.toLocaleString("en-US", { month: "long" });
  const currentYear = now.getFullYear();

  // Find the index of the current month in your mock data
  const currentMonthIndex = allMonthsData.findIndex(
    (data) => data.month === currentMonthName && data.year === currentYear
  );

  // Use the found index, or default to 0 if no data exists for the current month
  const displayIndex = currentMonthIndex !== -1 ? currentMonthIndex : 0;
  const mockData = allMonthsData[displayIndex];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between">
          <h1 className="text-3xl font-bold text-night-600">Hello, John</h1>
          <p className="text-2xl font-semibold text-night-600">
            {mockData.month} {mockData.year}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Budget Section */}
        <div className="bg-ash-gray-900 text-timberwolf-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-center">
          <div className="bg-night-500 p-6 rounded-lg shadow-sm">
            <p className="text-sm text-ash-gray-400">Budget</p>
            <p className="text-4xl font-bold text-timberwolf-900">
              {currency}
              {mockData.remaining.toLocaleString()}
              <span className="text-base font-normal text-ash-gray-400 ml-2">
                remaining of {currency}
                {mockData.monthlyBudget.toLocaleString()}
              </span>
            </p>
          </div>
          <div className="bg-ash-gray-800 p-4 rounded-lg mt-4 shadow-inner">
            <Button
              onClick={() =>
                openModal("EDIT_BUDGET", {
                  month: mockData.month,
                  year: mockData.year,
                  currentBudget: mockData.monthlyBudget,
                })
              }
              variant="secondary"
              className="w-full mb-4"
            >
              Edit Budget
            </Button>
            <div>
              <div className="flex justify-between text-xs text-night-700 font-medium mb-1">
                <span>{mockData.month} 1</span>
                <span>{mockData.month} 28</span>
              </div>
              <div className="w-full bg-ash-gray-700 rounded-full h-2.5 shadow-inner">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full shadow-sm"
                  style={{ width: `${mockData.budgetUsedPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-night-700 font-medium mt-1">
                <span>{currency}0</span>
                <span>
                  {currency}
                  {mockData.monthlyBudget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => openModal("ADD_EXPENSE")}
            className="mt-4 shadow-sm"
          >
            Add Expense
          </Button>
        </div>

        {/* Expense Chart */}
        <div className="col-span-1 bg-ash-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <ExpenseChart monthIndex={displayIndex} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-ash-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <span className="text-xl font-bold text-night-600">
            Recent Transactions
          </span>
          <div className="flex-grow border-t border-ash-gray-700 ml-4"></div>
        </div>
        <div className="space-y-4">
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
