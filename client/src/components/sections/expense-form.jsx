import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ExpenseCategorySelect } from "./expense-category-dropdown";
import moment from "moment";
import { mutate } from "swr";

// Define Zod schema
const expenseSchema = z.object({
  amount: z.string().nonempty("Amount is required"),
  date: z.string().nonempty("Date is required"),
  category: z.string().nonempty("Category is required"),
  description: z.string().optional(),
  isRecurring: z.coerce.boolean().optional(),
  recurrenceType: z.string().optional().nullable(),
});

export function ExpenseForm({ editEntry, onSave, onCancel }) {
  console.log(editEntry)
  const [receipt, setReceipt] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: editEntry ? {
        amount: editEntry.amount,
        date: moment(editEntry.date).format('yyyy-MM-DD'),
        category: editEntry.category,
        description: editEntry.description,
        isRecurring: false,
        recurrenceType: "",
      } : {
        amount: "",
        date: "",
        category: "",
        description: "",
        isRecurring: false,
        recurrenceType: "",
      },
  });

  const isRecurring = watch("isRecurring");

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("amount", data?.amount || '');
      formData.append("date", moment(data?.date).format('YYYY-MM-DD') || '');
      formData.append("category", data?.category || '');
      formData.append("description", data?.description || "");
      formData.append("isRecurring", Boolean(data?.isRecurring) || false);
      formData.append("recurrenceType", data?.recurrenceType || "");
      if (receipt) {
        formData.append("receipt", receipt);
      }

      const method = editEntry ? "PUT" : "POST";
      const url = editEntry ? `/api/expense/${editEntry.id}` : "/api/expense";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save expense entry");
      }

      const savedData = await response.json();
      onSave(savedData);

      // Reset form fields if it's a new entry
      if (!editEntry) {
        setValue("amount", "");
        setValue("date", "");
        setValue("category", "");
        setValue("description", "");
        setValue("isRecurring", false);
        setValue("recurrenceType", "");
        setReceipt(null);
      }
      
      mutate('/api/dashboard/current-balance')

    } catch (error) {
      console.error("Error saving expense entry:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Amount"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-2 col-span-1">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            placeholder="Date"  
            {...register("date")}
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>
        <div className="space-y-2 col-span-1">
          <Label htmlFor="category">Category</Label>
          <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <ExpenseCategorySelect
                    value={field.value}
                    onChange={field.onChange}
                  />
              )}
           />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description"
            {...register("description")}
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="receipt">Receipt</Label>
          <Input
            id="receipt"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {(receipt || editEntry) && (
            <img
              src={receipt ? URL.createObjectURL(receipt)  : editEntry.receipt  }
              alt="Receipt"
              className="mt-2 "
            />
          )}
        </div>
        {(!editEntry) &&
          <div className="space-y-1 mt-4">
          <Label htmlFor="recurring">Recurring</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              {...register("isRecurring")}
              checked={isRecurring}
              onCheckedChange={() => setValue("isRecurring", !isRecurring)}
            />
            <span>Set as recurring</span>
          </div>
        </div>}
        {isRecurring && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="recurrenceType">Recurrence Type</Label>
            <Select
              value={watch("recurrenceType")}
              onValueChange={(value) => setValue("recurrenceType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recurrence type" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.recurrenceType && (
              <p className="text-red-500 text-sm">
                {errors.recurrenceType.message}
              </p>
            )}
          </div>
        )}
      </div>
      <DialogFooter className="gap-2 mt-4">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editEntry ? "Update Entry" : "Add Entry"}
        </Button>
      </DialogFooter>
    </form>
  );
}
