import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { IncomeList } from "./income-list";
import { IncomeForm } from "./income-form";
import { RotateCcw } from "lucide-react";
import IncomeSummary from "./income-summary";

export default function IncomeSection() {
  const [incomeEntries, setIncomeEntries] = useState([
    {
      id: 1,
      amount: 2500.0,
      date: "2024-01-15",
      source: "Freelance Work",
      description: "Payment for website design project",
    },
    {
      id: 2,
      amount: 1800.0,
      date: "2024-01-30",
      source: "Part-Time Job",
      description: "Paycheck for May",
    },
    {
      id: 3,
      amount: 3200.0,
      date: "2024-01-01",
      source: "Consulting Gig",
      description: "Payment for business strategy consultation",
    },
    {
      id: 4,
      amount: 1200.0,
      date: "2024-01-01",
      source: "Freelance Work",
      description: "Payment for content writing project",
    },
    {
      id: 5,
      amount: 2000.0,
      date: "2024-01-20",
      source: "Part-Time Job",
      description: "Paycheck for June",
    },
  ]);

  const [filterOptions, setFilterOptions] = useState({
    dateRange: {
      start: null,
      end: null,
    },
    source: "",
    amount: {
      min: null,
      max: null,
    },
  });

  const [sortOptions, setSortOptions] = useState({
    key: "date",
    order: "asc",
  });

  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (type, value) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [type]: value,
    }));
  };

  const handleSortChange = (key) => {
    setSortOptions((prevOptions) => ({
      ...prevOptions,
      key,
      order:
        prevOptions.key === key
          ? prevOptions.order === "asc"
            ? "desc"
            : "asc"
          : "asc",
    }));
  };

  const handleDelete = (id) => {
    setIncomeEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.id !== id)
    );
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setShowModal(true);
  };

  const handleCreateOrUpdateIncomeEntry = (newIncomeEntry) => {
    if (editEntry) {
      // Update existing entry
      setIncomeEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === editEntry.id
            ? {
                ...entry,
                ...newIncomeEntry,
                amount: parseFloat(newIncomeEntry.amount),
              }
            : entry
        )
      );
    } else {
      // Add new entry
      const newEntry = {
        id: incomeEntries.length + 1,
        amount: parseFloat(newIncomeEntry.amount),
        date: newIncomeEntry.date,
        source: newIncomeEntry.source,
        description: newIncomeEntry.description,
      };
      setIncomeEntries((prevEntries) => [...prevEntries, newEntry]);
    }
    setEditEntry(null);
    setShowModal(false);
  };

  const filteredAndSortedEntries = useMemo(() => {
    let entries = [...incomeEntries];

    if (filterOptions.dateRange.start) {
      entries = entries.filter(
        (entry) => new Date(entry.date) >= new Date(filterOptions.dateRange.start)
      );
    }

    if (filterOptions.dateRange.end) {
      entries = entries.filter(
        (entry) => new Date(entry.date) <= new Date(filterOptions.dateRange.end)
      );
    }

    if (filterOptions.source) {
      entries = entries.filter((entry) =>
        entry.source.toLowerCase().includes(filterOptions.source.toLowerCase())
      );
    }

    if (filterOptions.amount.min !== null) {
      entries = entries.filter((entry) => entry.amount >= filterOptions.amount.min);
    }

    if (filterOptions.amount.max !== null) {
      entries = entries.filter((entry) => entry.amount <= filterOptions.amount.max);
    }

    entries.sort((a, b) => {
      if (a[sortOptions.key] < b[sortOptions.key]) return sortOptions.order === "asc" ? -1 : 1;
      if (a[sortOptions.key] > b[sortOptions.key]) return sortOptions.order === "asc" ? 1 : -1;
      return 0;
    });

    return entries;
  }, [incomeEntries, filterOptions, sortOptions]);

  const handleReset = () => {
    setFilterOptions({
      dateRange: {
        start: null,
        end: null,
      },
      source: "",
      amount: {
        min: null,
        max: null,
      },
    });
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-primary/70">View and manage your income sources and amounts.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Create Income</Button>
      </div>
      <div className="my-5">
        <IncomeSummary 
          averageMonthlyIncome={5000}  // Example values; replace with actual calculation
          totalYearlyIncome={60000}    // Example values; replace with actual calculation
          highestMonthlyIncome={3200}  // Example values; replace with actual calculation
        />
      </div>
      <div className="bg-background border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between">
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className={`space-y-2 ${showFilters ? "block" : "hidden"} md:block`}>
              <Label htmlFor="date-range">Date Range</Label>
              <DatePickerWithRange
                value={filterOptions.dateRange}
                onChange={(range) =>
                  handleFilterChange("dateRange", {
                    start: range.from,
                    end: range.to,
                  })
                }
                placeholder="Please select date range"
              />
            </div>
            <div className={`space-y-2 ${showFilters ? "block" : "hidden"} md:block`}>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="Filter by source"
                value={filterOptions.source}
                onChange={(e) => handleFilterChange("source", e.target.value)}
              />
            </div>
            <div className={`space-y-2 ${showFilters ? "block" : "hidden"} md:block`}>
              <Label htmlFor="amount">Amount</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  id="amount-min"
                  type="number"
                  placeholder="Min"
                  value={filterOptions.amount.min || ""}
                  onChange={(e) =>
                    handleFilterChange("amount", {
                      ...filterOptions.amount,
                      min: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                />
                <Input
                  id="amount-max"
                  type="number"
                  placeholder="Max"
                  value={filterOptions.amount.max || ""}
                  onChange={(e) =>
                    handleFilterChange("amount", {
                      ...filterOptions.amount,
                      max: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                />
              </div>
            </div>
            <div className={`space-y-2 flex flex-col justify-end ${showFilters ? "flex" : "hidden"} md:flex`}>
              <Label htmlFor="Reset">Reset</Label>
              <Button size='icon' variant='secondary' onClick={handleReset}><RotateCcw className="w-4 h-4"/></Button>
            </div>
            <div className="md:hidden">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
        </div>
        <IncomeList
          entries={filteredAndSortedEntries}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSortChange={handleSortChange}
          sortOptions={sortOptions}
        />
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <IncomeForm
            onSave={handleCreateOrUpdateIncomeEntry}
            onCancel={() => {
              setEditEntry(null);
              setShowModal(false);
            }}
            entry={editEntry}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
