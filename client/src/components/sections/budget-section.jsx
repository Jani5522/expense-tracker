import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/formatters";

const BudgetSection = () => {
  const [budgets, setBudgets] = useState([
    { category: "Groceries", budget: 500, spent: 450 },
    { category: "Utilities", budget: 200, spent: 180 },
    { category: "Entertainment", budget: 150, spent: 180 }
  ]);

  const [newBudget, setNewBudget] = useState({ category: "", budget: "" });
  const [editBudget, setEditBudget] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewBudget(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSelectChange = (value) => {
    setNewBudget(prevState => ({ ...prevState, category: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newBudget.category && newBudget.budget) {
      setBudgets([...budgets, { ...newBudget, spent: 0 }]);
      setNewBudget({ category: "", budget: "" });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setBudgets(budgets.map(budget => budget.category === editBudget.category ? editBudget : budget));
    setEditBudget(null);
    setIsDialogOpen(false);  // Close the dialog after successful submission
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditBudget(prevState => ({ ...prevState, [id]: value }));
  };

  const handleDelete = (category) => {
    setBudgets(budgets.filter(budget => budget.category !== category));
  };

  return (
    <div className="flex gap-4 flex-col-reverse md:flex-row">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 grow">
        {budgets.map((budget, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className='capitalize'>{budget.category}</CardTitle>
              <CardDescription>Monthly Budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Budget</span>
                <span className="font-semibold">{formatCurrency(budget.budget)}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-semibold">{formatCurrency(budget.spent)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className={`font-semibold ${budget.budget - budget.spent < 0 ? "text-red-500" : "text-green-500"}`}>
                  {formatCurrency(budget.budget - budget.spent)}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="mr-2" onClick={() => {
                    setEditBudget(budget);
                    setIsDialogOpen(true);
                  }}>
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Edit Budget</DialogTitle>
                  <DialogDescription>Edit your budget for {budget.category}.</DialogDescription>
                  <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                    <div>
                      <Label htmlFor="budget">Monthly Budget</Label>
                      <Input id="budget" type="number" value={editBudget?.budget || ''} onChange={handleEditChange} />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(budget.category)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="md:basis-4/12 basis-full">
        <Card>
          <CardContent className='pt-4'>
            <h2 className="text-xl font-bold mb-4">Create New Budget</h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select id="category" onValueChange={handleSelectChange} value={newBudget.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="groceries">Groceries</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Monthly Budget</Label>
                <Input id="budget" type="number" placeholder="Enter amount" value={newBudget.budget} onChange={handleInputChange} />
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-end">
                <Button type="submit">Create Budget</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetSection;
