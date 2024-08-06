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

export function IncomeForm({ editEntry, onSave, onCancel }) {
    const [newIncomeEntry, setNewIncomeEntry] = useState(
      editEntry || {
        amount: "",
        date: "",
        source: "",
        description: "",
      }
    );

    const incomeSources = [
      { value: "salary", label: "Salary" },
      { value: "freelance", label: "Freelance" },
      { value: "investments", label: "Investments" },
      { value: "rent", label: "Rent" },
      { value: "other", label: "Other" }
    ];

    const handleSave = () => {
      onSave(newIncomeEntry);
      setNewIncomeEntry({
        amount: "",
        date: "",
        source: "",
        description: "",
      });
    };

    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {editEntry ? "Edit Income Entry" : "Add New Income Entry"}
          </DialogTitle>
          <DialogDescription>
            {editEntry
              ? "Update the details of the income entry."
              : "Fill in the details for the new income entry."}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='amount'>Amount</Label>
            <Input
              id='amount'
              type='number'
              value={newIncomeEntry.amount}
              onChange={(e) =>
                setNewIncomeEntry({ ...newIncomeEntry, amount: e.target.value })
              }
              placeholder='Amount'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='date'>Date</Label>
            <Input
              id='date'
              type='date'
              value={newIncomeEntry.date}
              onChange={(e) =>
                setNewIncomeEntry({ ...newIncomeEntry, date: e.target.value })
              }
              placeholder='Date'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='source'>Source</Label>
            <Select
              value={newIncomeEntry.source}
              onChange={(value) =>
                setNewIncomeEntry({ ...newIncomeEntry, source: value })
              }
            >
              <SelectTrigger className=''>
                <SelectValue placeholder='Select source' />
              </SelectTrigger>

              <SelectContent>

                {incomeSources.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={newIncomeEntry.description}
              onChange={(e) =>
                setNewIncomeEntry({
                  ...newIncomeEntry,
                  description: e.target.value,
                })
              }
              placeholder='Description'
            />
          </div>
        </div>
        <DialogFooter>
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
