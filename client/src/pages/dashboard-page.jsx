import DashboardSection from "@/components/sections/dashboard-section";
import moment from 'moment';

const data = {
  cards: [
    { title: 'Total Income', amount: 5200, change: '' },
    { title: 'Total Expenses', amount: 3450, change: '' },
    { title: 'Monthly Budget', amount: 4000, change: '' },
    { title: 'Budget Spent', amount: 10, progress: { value: 86, label: '' } },
    { title: 'Remaining Budget ', amount: 4000, change: '' },
    { title: 'Total Saving', amount: 4000, change: '' },
    { title: 'Average Monthly Saving', amount: 4000, change: '' },
    { title: 'Average Annual Saving', amount: 4000, change: '' },
  ],
  expensesByCategory: {
    series: [
      { name: 'Groceries', y: 300 },
      { name: 'Rent', y: 1500 },
      { name: 'Utilities', y: 200 },
      { name: 'Transportation', y: 100 },
      { name: 'Others', y: 50 }
    ]
  },
  expensesAndIncome: {
    categories: moment.months(),
    series: [
      {
        name: 'Expenses',
        data: [300, 500, 400, 600, 700, 800]
      },
      {
        name: 'Income',
        data: [800, 700, 600, 500, 400, 300]
      }
    ]
  },
  recentExpenses: [
    { date: '2023-04-15', amount: 125, category: 'Groceries', description: 'Weekly grocery shopping' },
    { date: '2023-04-10', amount: 50, category: 'Transportation', description: 'Uber ride' },
    { date: '2023-04-05', amount: 1200, category: 'Rent', description: 'Monthly rent payment' },
    { date: '2023-04-01', amount: 75, category: 'Utilities', description: 'Electricity bill' },
  ],
  recentIncome: [
    { date: '2023-04-20', amount: 3000, source: 'Salary', description: 'Monthly salary' },
    { date: '2023-04-15', amount: 200, source: 'Freelance', description: 'Freelance project payment' },
    { date: '2023-04-01', amount: 2000, source: 'Salary', description: 'Monthly salary' },
    { date: '2023-04-01', amount: 2000, source: 'Salary', description: 'Monthly salary' },
  ],
  monthlyBudget: [
    { name: 'Groceries', spent: 300, total: 500, progress: 60 },
    { name: 'Rent', spent: 1200, total: 1500, progress: 80 },
    { name: 'Utilities', spent: 100, total: 200, progress: 50 },
    { name: 'Transportation', spent: 75, total: 150, progress: 50 },
  ],
  savings: {
    total: 5000,
    monthly: 500,
    annual: 6000,
    chart: {
      categories: moment.months(),
      series: [
        {
          name: 'Savings',
          data: [500, 1000, 1500, 2000, 2500, 3000]
        }
      ]
    }
  },
};

function DashboardPage() {
  return (
    <div>
      <DashboardSection data={data} />
    </div>
  );
}

export default DashboardPage;
