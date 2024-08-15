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
import { CalendarIcon } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ReportSection() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const { data, error } = useSWR(`/api/dashboard/report-data?timeframe=${selectedTimeframe}`, fetcher);

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  const { expenses, income, budget } = data;

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
      categories: budget.map(item => item.name),
    },
    yAxis: {
      title: {
        text: "Amount",
      },
    },
    series: [
      {
        name: "Overview",
        data: budget.filter(item => item.y !== 0).map(item => ({ name: item.name, y: item.y })),
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>Summary of your {selectedTimeframe} expenses</CardDescription>
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
                    : selectedTimeframe === "last-month"
                    ? "Last Month"
                    : selectedTimeframe === "last-three-months"
                    ? "Last 3 Months"
                    : selectedTimeframe === "year"
                    ? "This Year"
                    : "All Time"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setSelectedTimeframe("month")}>
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTimeframe("last-month")}>
                  Last Month
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTimeframe("last-three-months")}>
                  Last 3 Months
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTimeframe("year")}>
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
          <CardDescription>Summary of your {selectedTimeframe} income</CardDescription>
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
                    : selectedTimeframe === "last-month"
                    ? "Last Month"
                    : selectedTimeframe === "last-three-months"
                    ? "Last 3 Months"
                    : selectedTimeframe === "year"
                    ? "This Year"
                    : "All Time"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setSelectedTimeframe("month")}>
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTimeframe("last-month")}>
                  Last Month
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTimeframe("last-three-months")}>
                  Last 3 Months
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTimeframe("year")}>
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
          <CardDescription>Summary of your {selectedTimeframe} budget</CardDescription>
        </CardHeader>
        <CardContent>
          <HighchartsReact highcharts={Highcharts} options={budgetOptions} />
        </CardContent>
      </Card>
    </div>
  );
}
