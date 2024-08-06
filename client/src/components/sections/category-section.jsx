import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrashIcon } from "lucide-react"

export default function CategorySection() {
  const [categories, setCategories] = useState([
    { id: 1, type: "income", name: "Salary" },
    { id: 2, type: "income", name: "Freelance" },
    { id: 3, type: "expense", name: "Rent" },
    { id: 4, type: "expense", name: "Groceries" },
  ])
  const [newCategory, setNewCategory] = useState({ type: "income", name: "" })
  const handleNewCategory = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value })
  }
  const addCategory = () => {
    if (newCategory.name.trim()) {
      setCategories([...categories, { id: categories.length + 1, ...newCategory }])
      setNewCategory({ type: "income", name: "" })
    }
  }
  const deleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id))
  }
  return (
    <div className="mx-auto">
      <div className="grid gap-8">
        <div>
          {/* <h2 className="text-2xl font-bold mb-4">Add New Category</h2> */}
          <div className="grid sm:grid-cols-[1fr_auto] gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={newCategory.type}
                onValueChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
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
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${category.type === "income" ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <div className="font-medium">{category.name}</div>
                    <div className={`text-sm ${category.type === "income" ? "text-green-500" : "text-red-500"}`}>
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
  )
}
