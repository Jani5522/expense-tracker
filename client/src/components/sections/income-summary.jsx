import { formatCurrency } from "@/lib/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import moment from "moment";

const IncomeSummary = ({ averageMonthlyIncome = 0, totalYearlyIncome = 0, highestMonthlyIncome = 0 }) => {
  return (
    <div>
      <div className="flex gap-3 items-center mb-4">
        <h3 className='text-2xl font-bold'>Income Summary</h3>
        <Badge variant='secondary'>Summary</Badge>
      </div>

      <div className='grid md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex gap-2'>
            <CardTitle>Current Month Income</CardTitle>
            <Badge className='max-w-fit' variant='secondary'>Monthly</Badge>
          </CardHeader>
          <CardContent className='text-2xl font-bold text-green-600'>
            {formatCurrency(averageMonthlyIncome)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex gap-2'>
            <CardTitle>Current Year Income <span className="m-auto text-xs text-secondary-foreground mx-1">{moment().year()}</span></CardTitle>
            <Badge className='max-w-fit' variant='secondary'>Yearly</Badge>
          </CardHeader>
          <CardContent className='text-2xl font-bold text-green-600'>
            {formatCurrency(totalYearlyIncome)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex gap-2'>
            <CardTitle>Highest Monthly Income</CardTitle>
            <Badge className='max-w-fit' variant='secondary'>Monthly</Badge>
          </CardHeader>
          <CardContent className='text-2xl font-bold text-green-600'>
            {formatCurrency(highestMonthlyIncome)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncomeSummary;
