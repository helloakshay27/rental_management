
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add New Expense</DialogTitle>
          <DialogDescription className="text-gray-600">
            Record a new operational expense
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="description" className="text-gray-700">Description</Label>
            <Input id="description" placeholder="Enter expense description" className="bg-white border-gray-200" />
          </div>
          <div>
            <Label htmlFor="amount" className="text-gray-700">Amount</Label>
            <Input id="amount" type="number" placeholder="0.00" className="bg-white border-gray-200" />
          </div>
          <div>
            <Label htmlFor="category" className="text-gray-700">Category</Label>
            <Select>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-gray-200">
              Cancel
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1 bg-[#C72030] hover:bg-[#A01825]">
              Add Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
