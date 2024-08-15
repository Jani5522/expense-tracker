import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ExpenseForm } from "./expense-form";
import { IncomeForm } from "./income-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function EntryCreator() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  const toggleAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000); // Reset animation after 1 second
  };

  const handleCreateExpense = () => {
    setShowExpenseForm(true);
  };

  const handleCreateIncome = () => {
    setShowIncomeForm(true);
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size='icon' 
            className={`rounded-full border border-secondary-foreground shadow-xl ${isAnimating ? "animate-spin" : ""}`}
            variant='secondary'
            onClick={toggleAnimation}
          >
            <Plus />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="origin-top-right bottom-full mb-2">
          <DropdownMenuItem className='text-destructive' onClick={handleCreateExpense}>Expense</DropdownMenuItem>
          <DropdownMenuItem className='text-secondary-foreground' onClick={handleCreateIncome}>Income</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <DialogContent  className='overflow-auto  max-h-svh'>
          <ExpenseForm onSave={() => setShowExpenseForm(false)} onCancel={() => setShowExpenseForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showIncomeForm} onOpenChange={setShowIncomeForm}>
        <DialogContent>
          <IncomeForm onSave={() => setShowIncomeForm(false)} onCancel={() => setShowIncomeForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
