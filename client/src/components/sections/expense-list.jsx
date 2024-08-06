import { useState } from "react";
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
import { ArrowDown, ArrowUp, EllipsisVertical, FilePenIcon, TrashIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";

export function ExpenseList({ entries, onEdit, onDelete, onSortChange, sortOptions }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>Receipt</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSortChange("date")}>
              <span className="flex items-center gap-3">
                Date
                {sortOptions.key === "date" ? (
                  <span className="ml-1 text-primary w-5 h-5 flex items-center justify-center">{sortOptions.order === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}</span>
                ) : (
                  <ArrowUpDownIcon className="ml-1 text-muted-foreground w-4 h-4" />
                )}
              </span>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSortChange("category")}>
              <span className="flex items-center gap-3">
                Category
                {sortOptions.key === "category" ? (
                  <span className="ml-1 text-primary w-5 h-5 flex items-center justify-center">{sortOptions.order === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}</span>
                ) : (
                  <ArrowUpDownIcon className="ml-1 text-muted-foreground w-4 h-4" />
                )}
              </span>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => onSortChange("amount")}>
              <span className="flex items-center gap-3">
                Amount
                {sortOptions.key === "amount" ? (
                  <span className="ml-1 text-primary w-5 h-5 flex items-center justify-center">{sortOptions.order === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}</span>
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
              <TableCell className='flex items-end justify-center'>
                <Button variant='ghost' onClick={() => openModal(entry.receipt)}>
                  <img alt='receipt' src={entry.receipt} className="size-full object-cover"/>
                </Button>
              </TableCell>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.category}</TableCell>
              <TableCell className="text-start">{formatCurrency(entry.amount)}</TableCell>
              <TableCell className="text-center max-w-52">{entry.description}</TableCell>
              <TableCell className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Button className='w-full' onClick={() => onEdit(entry)} variant='secondary'>
                        <FilePenIcon className="m-2 w-5 h-5" /> Edit
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button onClick={() => onDelete(entry.id)} variant='destructive'>
                        <TrashIcon className="m-2 w-5 h-5" /> Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <img src={selectedImage} alt="Enlarged receipt" className="w-full h-auto rounded-md object-contain" />
      </Modal>
    </>
  );
}




export function Modal({ isOpen, onClose, children }) {
  return (
    <Dialog open={isOpen} className="modal">
      <DialogOverlay />
      <DialogContent>
        {children}
        <Button variant='destructive' onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
