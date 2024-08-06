import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

export default function ReportSection() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");

  const expenses = [
    { category: "Rent", amount: 1200 },
    { category: "Groceries", amount: 500 },
    { category: "Utilities", amount: 300 },
    { category: "Transportation", amount: 150 },
    { category: "Entertainment", amount: 250 },
    { category: "Miscellaneous", amount: 100 },
  ];

  const income = [
    { source: "Salary", amount: 5000 },
    { source: "Freelance", amount: 1500 },
    { source: "Investments", amount: 800 },
  ];

  const budget = {
    total: 6000,
    actual: 5500,
    surplus: 500,
  };

  const handleTimeframeChange = (value) => {
    setSelectedTimeframe(value);
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
      type: "line",
    },
    title: {
      text: "Budget",
    },
    xAxis: {
      categories: ["Total", "Actual", "Surplus"],
    },
    yAxis: {
      title: {
        text: "Amount",
      },
    },
    series: [
      {
        name: "Budget",
        data: [budget.total, budget.actual, budget.surplus],
      },
    ],
  };

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Summary of your monthly expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="text-4xl font-bold">
              {formatCurrency(expenses.reduce((total, expense) => total + expense.amount, 0))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {selectedTimeframe === "month"
                      ? "This Month"
                      : selectedTimeframe === "year"
                      ? "This Year"
                      : "All Time"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => handleTimeframeChange("month")}>
                    This Month
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleTimeframeChange("year")}>
                    This Year
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleTimeframeChange("all")}>
                    All Time
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {expenses.map((expense, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="text-sm font-medium">{expense.category}</div>
                  <div className="text-sm font-medium">{formatCurrency(expense.amount)}</div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <HighchartsReact highcharts={Highcharts} options={expenseOptions} />
          </CardContent>
          <CardFooter className="flex justify-end">
            {/* <Button variant="outline">Export Expenses</Button> */}
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
            <CardDescription>Summary of your monthly income</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="text-4xl font-bold">
                {formatCurrency(income.reduce((total, source) => total + source.amount, 0))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {selectedTimeframe === "month"
                      ? "This Month"
                      : selectedTimeframe === "year"
                      ? "This Year"
                      : "All Time"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => handleTimeframeChange("month")}>
                    This Month
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleTimeframeChange("year")}>
                    This Year
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleTimeframeChange("all")}>
                    All Time
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {income.map((source, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="text-sm font-medium">{source.source}</div>
                  <div className="text-sm font-medium">{formatCurrency(source.amount)}</div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <HighchartsReact highcharts={Highcharts} options={incomeOptions} />
          </CardContent>
          <CardFooter className="flex justify-end">
            {/* <Button variant="outline">Export Income</Button> */}
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
            <CardDescription>Summary of your monthly budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="text-4xl font-bold">{formatCurrency(budget.total)}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {selectedTimeframe === "month"
                      ? "This Month"
                      : selectedTimeframe === "year"
                      ? "This Year"
                      : "All Time"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => handleTimeframeChange("month")}>
                    This Month
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleTimeframeChange("year")}>
                    This Year
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleTimeframeChange("all")}>
                    All Time
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Budget</div>
                <div className="text-sm font-medium">{formatCurrency(budget.total)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Actual</div>
                <div className="text-sm font-medium">{formatCurrency(budget.actual)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Surplus</div>
                <div className="text-sm font-medium">{formatCurrency(budget.surplus)}</div>
              </div>
            </div>
            <Separator className="my-4" />
            <HighchartsReact highcharts={Highcharts} options={budgetOptions} />
          </CardContent>
          <CardFooter className="flex justify-end">
            {/* <Button variant="outline">Export Budget</Button> */}
          </CardFooter>
        </Card>
      </div>
  );
}
