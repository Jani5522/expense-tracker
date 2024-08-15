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
import { SourceSelect } from "./source-dropdown";  // Adjust the import based on your project structure
import { useEffect } from "react";
import moment from "moment";
import { mutate } from "swr";

// Define the Zod schema
const incomeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  date: z.string().nonempty("Date is required"),
  source: z.string().nonempty("Source is required"),
  description: z.string().optional(),
});

export function IncomeForm({ editEntry, onSave, onCancel }) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(incomeSchema),
        defaultValues: editEntry || {
          amount: null,
          date: "",
          source: "",
          description: "",
        },
    });

    // Set initial values if editing
    useEffect(() => {
      if (editEntry) {
        setValue("amount", editEntry.amount);
        setValue("date", moment(editEntry.date).format('yyyy-MM-DD'));
        setValue("source", editEntry.source);
        setValue("description", editEntry.description);
      }
    }, [editEntry, setValue]);

    const onSubmit = async (data) => {
      try {
        const method = editEntry ? 'PUT' : 'POST';
        const url = editEntry ? `/api/income/${editEntry.id}` : '/api/income';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to save income entry');
        }

        const result = await response.json();
        onSave(result);
        mutate('/api/dashboard/current-balance')
      } catch (error) {
        console.error('Error saving income entry:', error);
      }
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='amount'>Amount</Label>
              <Input
                id='amount'
                type='number'
                {...register('amount', { valueAsNumber: true })}
                placeholder='Amount'
              />
              {errors.amount && <span className="text-red-500">{errors.amount.message}</span>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='date'>Date</Label>
              <Input
                id='date'
                type='date'
                {...register('date')}
                placeholder='Date'
              />
              {errors.date && <span className="text-red-500">{errors.date.message}</span>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='source'>Source</Label>
              <Controller
                name="source"
                control={control}
                render={({ field }) => (
                  <SourceSelect
                    value={field.value}
                    onChange={field.onChange}
                  />
              )}
              />
             
              {errors.source && <span className="text-red-500">{errors.source.message}</span>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                {...register('description')}
                placeholder='Description'
              />
              {errors.description && <span className="text-red-500">{errors.description.message}</span>}
            </div>
          </div>
          <DialogFooter  className='my-4'>
            <Button type='button' onClick={onCancel}>
              Cancel
            </Button>
            <Button type='submit'>
              {editEntry ? "Update Entry" : "Add Entry"}
            </Button>
          </DialogFooter>
        </form>
      </>
    );
}
