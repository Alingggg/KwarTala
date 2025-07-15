import { Button, ExpenseCard, ExpenseChart } from "@/components";
import { useModalContext } from "@/hooks";
import { mockData as allMonthsData } from "@/data/mockData";

// Assuming the home page shows the first month's data.
const mockData = allMonthsData[0];

// Helper to get and sort recent transactions
const getRecentTransactions = () => {
  const allTransactions = mockData.weeks.flatMap((week) => week.transactions);
  return allTransactions.sort((a, b) => {
    const dateA = new Date(a.date.replace(".", "") + " " + mockData.year);
    const dateB = new Date(b.date.replace(".", "") + " " + mockData.year);
    return dateB.getTime() - dateA.getTime();
  });
};

const recentTransactions = getRecentTransactions();

function Home() {
  const { openModal } = useModalContext();
  const budgetPercentage =
    (mockData.monthlyTotal / mockData.monthlyBudget) * 100;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-night-600 mb-6">Hello, John</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Budget Section */}
        <div className="bg-ash-gray-900 text-timberwolf-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="bg-night-500 p-6 rounded-lg shadow-sm">
            <p className="text-sm text-ash-gray-400">Budget</p>
            <p className="text-4xl font-bold text-timberwolf-900">
              P{mockData.remaining.toLocaleString()}
              <span className="text-base font-normal text-ash-gray-400 ml-2">
                remaining of P{mockData.monthlyBudget.toLocaleString()}
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
                  style={{ width: `${budgetPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-night-700 font-medium mt-1">
                <span>P0</span>
                <span>P{mockData.monthlyBudget.toLocaleString()}</span>
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
          <ExpenseChart />
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
          {recentTransactions.slice(0, 10).map((transaction, index) => (
            <ExpenseCard key={transaction.id || index} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
