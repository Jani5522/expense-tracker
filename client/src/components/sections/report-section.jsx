import { useState } from "react";
import useSWR from "swr";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ReportSection() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const { data, error } = useSWR(
    `/api/dashboard/report-data?timeframe=${selectedTimeframe}`,
    fetcher
  );

  if (error) return <div>Error loading data</div>;
  if (!data)
    return (
      <Loader className='animate-spin text-primary w-10 h-10 m-auto my-10'></Loader>
    );

  const { expenses, income, budget } = data;

  const totalIncome = income.reduce(
    (total, source) => total + source.amount,
    0
  );
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const totalBudget = budget?.[0]?.y || 0;
  const surplus = totalIncome - totalExpenses;

  const getTimeframeText = () => {
    switch (selectedTimeframe) {
      case "month":
        return "this month";
      case "last-month":
        return "last month";
      case "last-three-months":
        return "the last 3 months";
      case "year":
        return "this year";
      default:
        return "all time";
    }
  };

  const expenseOptions = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Expenses",
    },
    xAxis: {
      categories: expenses.map((expense) => expense.category),
    },
    yAxis: {
      title: {
        text: "Amount",
      },
    },
    series: [
      {
        name: "Expenses",
        data: expenses.map((expense) => expense.amount),
      },
    ],
  };

  const incomeOptions = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Income",
    },
    series: [
      {
        name: "Income",
        colorByPoint: true,
        data: income.map((source) => ({
          name: source.source,
          y: source.amount,
        })),
      },
    ],
  };

  const budgetOptions = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Budget Overview",
    },
    xAxis: {
      categories: budget.map((item) => item.name),
    },
    yAxis: {
      title: {
        text: "Amount",
      },
    },
    series: [
      {
        name: "Overview",
        data: budget
          .filter((item) => item.y !== 0)
          .map((item) => ({ name: item.name, y: item.y })),
      },
    ],
  };

  return (
    <div className='flex flex-col gap-6'>
      <Card className='space-y-4 p-4'>
  <h2 className='text-xl font-semibold text-primary'>Financial Summary</h2>

  <p className='text-sm text-muted-foreground/80 px-2'>
    <strong className='text-primary pr-2'>Income & Expenses:</strong>
    For {getTimeframeText()}, your total income is{" "}
    <span className={`font-semibold ${totalIncome > 0 ? 'text-primary' : 'text-destructive'}`}>
      {formatCurrency(totalIncome)}
    </span>
    , total expenses are{" "}
    <span className={`font-semibold ${totalExpenses > totalIncome ? 'text-destructive' : 'text-primary'}`}>
      {formatCurrency(totalExpenses)}
    </span>
    , with a budget of{" "}
    <span className='font-semibold text-primary'>
      {formatCurrency(totalBudget)}
    </span>
    . This leaves you with{" "}
    {surplus >= 0 ? (
      <span>
        a surplus of{" "}
        <span className='font-semibold text-green-600'>
          {formatCurrency(surplus)}
        </span>
        .
      </span>
    ) : (
      <span>
        a deficit of{" "}
        <span className='font-semibold text-destructive'>
          {formatCurrency(Math.abs(surplus))}
        </span>
        .
      </span>
    )}
  </p>

  <p className='text-sm text-muted-foreground/80 px-2'>
    <strong className='text-primary pr-2'>Budget Management:</strong>
    You have spent{" "}
    <span className={`font-semibold ${((totalExpenses / totalBudget) * 100) > 100 ? 'text-destructive' : 'text-primary'}`}>
      {((totalExpenses / totalBudget) * 100).toFixed(2)}%
    </span>{" "}
    of your budget, which means you have{" "}
    {totalBudget - totalExpenses > 0 ? (
      <span className='font-semibold text-green-600'>
        {formatCurrency(totalBudget - totalExpenses)}
      </span>
    ) : (
      <span className='font-semibold text-destructive'>
        {formatCurrency(Math.abs(totalBudget - totalExpenses))}
      </span>
    )}{" "}
    {totalBudget - totalExpenses > 0 ? "remaining" : "overspent"} for the rest of{" "}
    {getTimeframeText()}. Be cautious with your spending to avoid exceeding your budget.
  </p>

  <p className='text-sm text-muted-foreground/80 px-2'>
    <strong className='text-primary pr-2'>Savings Advice:</strong>
    Your savings for {getTimeframeText()} are{" "}
    <span className={`font-semibold ${surplus > 0 ? 'text-green-600' : 'text-destructive'}`}>
      {formatCurrency(surplus)}
    </span>
    . {surplus > 0 ? (
      <span>
        Consider setting aside some of this amount towards your financial goals or an emergency fund.
        Staying consistent with your savings can help you achieve long-term financial stability.
      </span>
    ) : (
      <span>
        Consider revising your budget or finding ways to reduce expenses to avoid further financial strain.
      </span>
    )}
  </p>
</Card>


      {/* Charts Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>
              Summary of your {getTimeframeText()} expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-center mb-4'>
              <div className='text-4xl font-bold'>
                {formatCurrency(totalExpenses)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm'>
                    <CalendarIcon className='w-4 h-4 mr-2' />
                    {getTimeframeText()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onSelect={() => setSelectedTimeframe("month")}
                  >
                    This Month
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedTimeframe("last-month")}
                  >
                    Last Month
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedTimeframe("last-three-months")}
                  >
                    Last 3 Months
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedTimeframe("year")}
                  >
                    This Year
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <HighchartsReact highcharts={Highcharts} options={expenseOptions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
            <CardDescription>
              Summary of your {getTimeframeText()} income
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-center mb-4'>
              <div className='text-4xl font-bold'>
                {formatCurrency(totalIncome)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm'>
                    <CalendarIcon className='w-4 h-4 mr-2' />
                    {getTimeframeText()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onSelect={() => setSelectedTimeframe("month")}
                  >
                    This Month
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedTimeframe("last-month")}
                  >
                    Last Month
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedTimeframe("last-three-months")}
                  >
                    Last 3 Months
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedTimeframe("year")}
                  >
                    This Year
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <HighchartsReact highcharts={Highcharts} options={incomeOptions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
            <CardDescription>
              Summary of your {getTimeframeText()} budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HighchartsReact highcharts={Highcharts} options={budgetOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
