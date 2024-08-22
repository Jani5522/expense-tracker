import { useState, useMemo } from "react";
import useSWR from 'swr';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { IncomeList } from "./income-list";
import { IncomeForm } from "./income-form";
import { RotateCcw } from "lucide-react";
import IncomeSummary from "./income-summary";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function IncomeSection() {
  // Fetching income entries and summary from the API
  const { data: incomeEntries = [], mutate } = useSWR('/api/income', fetcher);
  const { data: incomeSummary, mutate: mutateSummary } = useSWR('/api/income/summary', fetcher,{refreshInterval: 2000});

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
    order: "desc",
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/income/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete income entry');
      }

      mutate(); // Re-fetch income entries after deletion
      mutateSummary();
    } catch (error) {
      console.error('Error deleting income entry:', error);
    }
  };

  const handleCreateOrUpdateIncomeEntry = async () => {
    try {
      mutate(); // Re-fetch income entries after save
      mutateSummary();
      setEditEntry(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving income entry:', error);
    }
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

  const handleEdit = (entry) =>{
    setEditEntry(entry)
    setShowModal(true)
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-6 flex gap-4 flex-col md:flex-row  items-center justify-between">
        <div>
          <p className="text-primary/70 text-center sm:text-start">View and manage your income sources and amounts.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Create Income</Button>
      </div>
      <div className="my-5">
        <IncomeSummary 
          averageMonthlyIncome={incomeSummary?.currentMonthIncome || 0}
          totalYearlyIncome={incomeSummary?.totalYearlyIncome || 0}
          highestMonthlyIncome={incomeSummary?.highestMonthlyIncome || 0}
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
            editEntry={editEntry}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
