import { formatCurrency } from "@/lib/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import moment from "moment";

const ExpenseSummary = ({totalMonthlyExpenses = 0, totalMonthlyBudget = 0, remainingBudget = 0}) => {
  return (
    <div>
      <div className="flex gap-3 items-center mb-4">
        <h3 className='text-2xl font-bold'>Expense Summary</h3>
      </div>

      <div className='grid md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex  gap-2'>
            <CardTitle>Total Expenses <span className="m-auto text-xs text-secondary-foreground mx-1 capitalize">{moment().format('MMMM')}</span></CardTitle> 
            <Badge className='max-w-fit' variant='secondary'>Monthly</Badge>
          </CardHeader>
          <CardContent className='text-2xl font-bold text-destructive'>
            {formatCurrency(totalMonthlyExpenses)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex  gap-2'>
            <CardTitle>Total Budget</CardTitle>
            <Badge className='max-w-fit' variant='secondary'>Monthly</Badge>
          </CardHeader>
          <CardContent className='text-2xl font-bold text-green-600'>
            {formatCurrency(totalMonthlyBudget)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex  gap-2'>
            <CardTitle>Remaining Budget</CardTitle>
            <Badge className='max-w-fit' variant='secondary'>Monthly</Badge>
          </CardHeader>
          <CardContent className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-destructive' : 'text-green-600'}`}>
            {formatCurrency(remainingBudget)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseSummary;
