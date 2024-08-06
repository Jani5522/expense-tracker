import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; // Adjust the import based on your project structure

export function ExpenseForm({ editEntry, onSave, onCancel }) {
  const [newExpenseEntry, setNewExpenseEntry] = useState(
    editEntry || {
      amount: "",
      date: "",
      category: "",
      description: "",
      receipt: null,
    }
  );

  const expenseCategories = [
    { value: "groceries", label: "Groceries" },
    { value: "utilities", label: "Utilities" },
    { value: "rent", label: "Rent" },
    { value: "transportation", label: "Transportation" },
    { value: "entertainment", label: "Entertainment" },
    { value: "other", label: "Other" }
  ];

  const handleSave = () => {
    onSave(newExpenseEntry);
    setNewExpenseEntry({
      amount: "",
      date: "",
      category: "",
      description: "",
      receipt: null,
    });
  };

  const handleFileChange = (e) => {
    setNewExpenseEntry({
      ...newExpenseEntry,
      receipt: URL.createObjectURL(e.target.files[0]),
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editEntry ? "Edit Expense Entry" : "Add New Expense Entry"}
        </DialogTitle>
        <DialogDescription>
          {editEntry
            ? "Update the details of the expense entry."
            : "Fill in the details for the new expense entry."}
        </DialogDescription>
      </DialogHeader>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='amount'>Amount</Label>
          <Input
            id='amount'
            type='number'
            value={newExpenseEntry.amount}
            onChange={(e) =>
              setNewExpenseEntry({ ...newExpenseEntry, amount: e.target.value })
            }
            placeholder='Amount'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='date'>Date</Label>
          <Input
            id='date'
            type='date'
            value={newExpenseEntry.date}
            onChange={(e) =>
              setNewExpenseEntry({ ...newExpenseEntry, date: e.target.value })
            }
            placeholder='Date'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='category'>Category</Label>
          <Select
            value={newExpenseEntry.category}
            onChange={(value) =>
              setNewExpenseEntry({ ...newExpenseEntry, category: value })
            }
          >
            <SelectTrigger className=''>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            value={newExpenseEntry.description}
            onChange={(e) =>
              setNewExpenseEntry({
                ...newExpenseEntry,
                description: e.target.value,
              })
            }
            placeholder='Description'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='receipt'>Receipt</Label>
          <Input
            id='receipt'
            type='file'
            accept='image/*'
            onChange={handleFileChange}
          />
          {newExpenseEntry.receipt && (
            <img src={newExpenseEntry.receipt} alt='Receipt' className='mt-2' />
          )}
        </div>
      </div>
      <DialogFooter className='gap-2'>
        <Button type='button' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='button' onClick={handleSave}>
          {editEntry ? "Update Entry" : "Add Entry"}
        </Button>
      </DialogFooter>
    </>
  );
}
