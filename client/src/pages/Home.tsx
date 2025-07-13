import { Button, ExpenseCard, ExpenseChart } from "@/components";
import { useModalContext } from "@/hooks";

const recentTransactions = [
  {
    category: "Entertainment",
    amount: 400,
    description: "Absolute Cinema",
    iconColor: "bg-blue-500",
  },
  {
    category: "Food",
    amount: 400,
    description: "Jalibi",
    iconColor: "bg-orange-500",
  },
  {
    category: "Grocery",
    amount: 400,
    description: "Puregold",
    iconColor: "bg-green-500",
  },
];

function Home() {
  const { openModal } = useModalContext();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-night-600 mb-8">Hello, John</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Budget Section */}
        <div className="bg-ash-gray-900 text-timberwolf-800 p-6 rounded-lg flex flex-col">
          <div className="bg-night-500 p-6 rounded-lg">
            <p className="text-sm text-ash-gray-400">Budget</p>
            <p className="text-4xl font-bold text-timberwolf-900">
              P3,854
              <span className="text-base font-normal text-ash-gray-400 ml-2">
                remaining of P10,000
              </span>
            </p>
          </div>
          <div className="bg-ash-gray-800 p-4 rounded-lg mt-4">
            <Button
              onClick={() =>
                openModal("EDIT_BUDGET", {
                  month: "September",
                  year: 2024,
                  currentBudget: 10000,
                })
              }
              variant="secondary"
              className="w-full mb-4"
            >
              Edit Budget
            </Button>
            <div>
              <div className="flex justify-between text-xs text-night-700 font-medium mb-1">
                <span>September 1</span>
                <span>September 30</span>
              </div>
              <div className="w-full bg-ash-gray-700 rounded-full h-2.5">
                <div
                  className="bg-auburn-500 h-2.5 rounded-full"
                  style={{ width: "61.46%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-night-700 font-medium mt-1">
                <span>P0</span>
                <span>P10,000</span>
              </div>
            </div>
          </div>
          <Button onClick={() => openModal("ADD_EXPENSE")} className="mt-4">
            Add Expense
          </Button>
        </div>

        {/* Expense Chart */}
        <div className="col-span-1 bg-ash-gray-900 p-6 rounded-lg">
          <ExpenseChart />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center mb-4">
          <span className="font-semibold text-night-600">
            Recent Transactions
          </span>
          <div className="flex-grow border-t border-ash-gray-400 ml-4"></div>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((transaction, index) => (
            <ExpenseCard key={index} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
