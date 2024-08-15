import { useState } from "react";
import useSWR from "swr";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrashIcon } from "lucide-react";

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CategorySection() {
  // Use SWR for data fetching
  const { data: categories = [], mutate } = useSWR('/api/categories', fetcher);

  const [newCategory, setNewCategory] = useState({ type: "income", name: "" });
  const [error, setError] = useState("");

  const handleNewCategory = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const addCategory = async () => {
    if (newCategory.name.trim()) {
      // Check for duplicate category
      const duplicate = categories.some(
        (category) => 
          category.name.toLowerCase() === newCategory.name.toLowerCase() && 
          category.type === newCategory.type
      );

      if (duplicate) {
        setError("This category already exists.");
        return;
      }

      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCategory),
        });

        if (response.ok) {
          const createdCategory = await response.json();
          mutate([...categories, createdCategory], false); // Optimistic UI update
          setNewCategory({ type: "income", name: "" });
        } else {
          console.error('Error creating category');
        }
      } catch (error) {
        console.error('Error creating category:', error);
      }
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate(categories?.filter((c) => c.id !== id), false); // Optimistic UI update
      } else {
        console.error('Error deleting category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="mx-auto">
      <div className="grid gap-8">
        <div className="grid sm:grid-cols-[1fr_auto] gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              value={newCategory.type}
              onValueChange={(value) => setNewCategory({ ...newCategory, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={newCategory.name}
              onChange={handleNewCategory}
              placeholder="Enter category name"
            />
          </div>
          <Button onClick={addCategory}>Add Category</Button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="grid gap-4">
            {categories && categories?.map((category) => (
              <Card key={category.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        category.type === "income" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <div className="font-medium capitalize">{category.name}</div>
                    <div
                      className={`text-sm ${
                        category.type === "income" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {category.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => deleteCategory(category.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
