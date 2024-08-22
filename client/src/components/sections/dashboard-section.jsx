import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";

export default function DashboardSection({ data }) {
  return (
    <div className="flex-1">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.cards?.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex gap-2 items-center">
                <CardTitle>{card.title}</CardTitle>
                {card?.badge && <Badge variant='secondary' className='py-[1px] px-[5px] rounded-sm'>{card.badge}</Badge> }
              </div>
            </CardHeader>
            <CardContent>
              {card.amount !==null ? <div className="text-4xl font-bold">{formatCurrency(card.amount)}</div>: <div className="text-2xl font-bold text-primary">{card.change}</div>}
              {card.amount !==null && <div className="text-sm text-muted-foreground">{card.change}</div>}
              {card.progress && <Progress value={card.progress.value} aria-label={card.progress.label} />}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-full">
              <PieChart data={data.expensesByCategory} />
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Expenses and Income</CardTitle>
          </CardHeader>
          <CardContent className="grow">
            <div className="relative h-full">
              <LineChart data={data.expensesAndIncome} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Savings</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="relative min-h-[200px] mt-4">
              <LineChart data={data.savings.chart} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentExpenses.slice(0, 4).map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Link to="/expense" className="text-sm text-blue-500 mt-2 inline-block">
              View all expenses
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Income</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentIncome.slice(0, 4).map((income, index) => (
                  <TableRow key={index}>
                    <TableCell>{income.date}</TableCell>
                    <TableCell>{formatCurrency(income.amount)}</TableCell>
                    <TableCell>{income.source}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Link to="/income" className="text-sm text-blue-500 mt-2 inline-block">
              View all income
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {data.monthlyBudget.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>{item.name}</div>
                  <div>
                    <Progress value={item.progress} aria-label={`${item.progress}% of budget spent`} />
                    <div className="text-sm text-muted-foreground">{formatCurrency(item.spent)} / {formatCurrency(item.total)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LineChart({ data }) {
  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: data.categories,
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: null,
      },
      gridLineWidth: 0,
    },
    series: data.series,
    tooltip: {
      pointFormatter: function() {
        return `${this.series.name}: ${formatCurrency(this.y)}`;
      }
    },
    legend: {
      enabled: true,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

function PieChart({ data }) {
  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: null,
    },
    series: [{
      name: 'Expenses',
      data: data.series,
    }],
    tooltip: {
      pointFormatter: function() {
        return `${this.name}: ${formatCurrency(this.y)}`;
      }
    },
    legend: {
      enabled: true,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
