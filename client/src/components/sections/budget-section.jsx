import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/formatters";
import { ExpenseCategorySelect } from "./expense-category-dropdown";

// SWR fetcher function
const fetcher = url => fetch(url).then(res => res.json());

const BudgetSection = () => {
  const { data: budgets = [], error } = useSWR('/api/budgets', fetcher);
  const [newBudget, setNewBudget] = useState({ category: "", budget: "" });
  const [editBudget, setEditBudget] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewBudget(prevState => ({ ...prevState, [id]: value }));
    setFormError(""); // Clear error on input change
  };

  const handleSelectChange = (value) => {
    setNewBudget(prevState => ({ ...prevState, category: value }));
    setFormError(""); // Clear error on select change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for duplicate category
    const duplicate = budgets.some(budget => budget.category === newBudget.category);
    if (duplicate) {
      setFormError("A budget for this category already exists.");
      return;
    }

    if (newBudget.category && newBudget.budget) {
      try {
        const response = await fetch("/api/budgets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBudget),
        });

        if (response.ok) {
          mutate('/api/budgets'); // Revalidate data
          setNewBudget({ category: "", budget: "" });
        } else {
          console.error("Error creating budget:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating budget:", error);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/budgets/${editBudget.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ budget: editBudget.budget }),
      });

      if (response.ok) {
        mutate('/api/budgets'); // Revalidate data
        setEditBudget(null);
        setIsDialogOpen(false);  // Close the dialog after successful submission
      } else {
        console.error("Error updating budget:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const handleDelete = async (category) => {
    const budgetToDelete = budgets.find(budget => budget.category === category);
    try {
      const response = await fetch(`/api/budgets/${budgetToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate('/api/budgets'); // Revalidate data
      } else {
        console.error("Error deleting budget:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const handleEditChange = (e) => {
    const { value } = e.target;
    setEditBudget(prevState => ({
      ...prevState,
      budget: value,
    }));
  };

  if (error) return <div>Failed to load budgets</div>;

  return (
    <div className="flex gap-4 flex-col-reverse md:flex-row">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 grow">
        {budgets && budgets?.map((budget, index) => (
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
                <ExpenseCategorySelect  onChange={handleSelectChange} value={newBudget.category} />
              </div>
              <div>
                <Label htmlFor="budget">Monthly Budget</Label>
                <Input id="budget" type="number" placeholder="Enter amount" value={newBudget.budget} onChange={handleInputChange} />
              </div>
              {formError && <p className="text-red-500">{formError}</p>}
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
