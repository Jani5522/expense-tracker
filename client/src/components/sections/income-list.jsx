import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "../ui/button";
import {ArrowDown, ArrowUp, EllipsisVertical, FilePenIcon, TrashIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react"; // Assuming you have an up-down arrow icon

export function IncomeList({ entries, onEdit, onDelete, onSortChange, sortOptions }) {
  return (
      <Table>
          <TableHeader>
              <TableRow>
                  <TableHead className="cursor-pointer " onClick={() => onSortChange("date")}>
                  <span className="flex items-center gap-3">
                      Date
                      {sortOptions.key === "date" ? (
                          <span className="ml-1 text-primary w-5 h-5 flex items-center justify-center">{sortOptions.order === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown  className="w-3 h-3"/>}</span>
                      ) : (
                          <ArrowUpDownIcon className="ml-1 text-muted-foreground w-4 h-4" />
                      )}
                      </span>

                  </TableHead>
                  <TableHead className="cursor-pointer " onClick={() => onSortChange("source")}>
                      <span className="flex items-center gap-3">
                      Source
                      {sortOptions.key === "source" ? (
                          <span className="ml-1 text-primary w-5 h-5 flex items-center justify-center">{sortOptions.order === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown  className="w-3 h-3"/>}</span>
                      ) : (
                          <ArrowUpDownIcon className="ml-1 text-muted-foreground w-4 h-4" />
                          
                      )}
                      </span>
                  </TableHead>
                  <TableHead className="text-center cursor-pointer " onClick={() => onSortChange("amount")}>
                  <span className="flex items-center gap-3">

                      Amount
                      {sortOptions.key === "amount" ? (
                          <span className="ml-1 text-primary w-5 h-5 flex items-center justify-center">{sortOptions.order === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown  className="w-3 h-3"/>}</span>
                      ) : (
                          <ArrowUpDownIcon className="ml-1 text-muted-foreground w-4 h-4" />
                      )}
                      </span>

                  </TableHead>
                  <TableHead className="text-center">Description</TableHead>
                  <TableHead className="">Actions</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {entries.map((entry) => (
                  <TableRow key={entry.id}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.source}</TableCell>
                      <TableCell className="text-start">{formatCurrency(entry.amount)}</TableCell>
                      <TableCell className="text-center max-w-52">{ entry.description}</TableCell>
                      <TableCell className="">
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <EllipsisVertical />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                  <DropdownMenuItem >
                                      <Button className='w-full' onClick={() => onEdit(entry)} variant='secondary'> 
                                        <FilePenIcon className="m-2 w-5 h-5" /> Edit
                                      </Button>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Button  onClick={() => onDelete(entry.id)} variant='destructive'>
                                      <TrashIcon className="m-2 w-5 h-5 " /> Delete
                                    </Button>
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                  </TableRow>
              ))}
          </TableBody>
      </Table>
  );
}
