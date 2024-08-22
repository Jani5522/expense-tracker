import useSWR from 'swr';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { formatCurrency } from '@/lib/formatters';

export default function Component() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: recurringExpenses = [], mutate } = useSWR('/api/expense/recurring', fetcher);

  const toggleRecurring = async (id) => {
    try {
      await fetch(`/api/expense/recurring/${id}/disable`, { method: 'PATCH' });
      mutate(); // Revalidate data after disabling
    } catch (error) {
      console.error('Error disabling recurring expense:', error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await fetch(`/api/expense/recurring/${id}`, { method: 'DELETE' });
      mutate(); // Revalidate data after deletion
    } catch (error) {
      console.error('Error deleting recurring expense:', error);
    }
  };

  return (
    <div className="container px-0">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recurringExpenses.map((expense) => (
          <Card key={expense.id} className="bg-card text-card-foreground shadow-sm relative">
            <CardContent className="px-4 py-5">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-medium">{expense.category}</h3>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={expense.isActive}
                    onCheckedChange={() => toggleRecurring(expense.id)}
                    className="ml-auto"
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-5 h-5 absolute inset-auto top-2 right-2 rounded-full">
                        <XIcon className="w-4 h-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {expense.category}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <Button variant="ghost">Cancel</Button>
                        <Button variant="destructive" onClick={() => deleteExpense(expense.id)}>Delete</Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Amount:</span>
                  <span>{formatCurrency(expense.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Frequency:</span>
                  <span>{expense.recurrenceType}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
