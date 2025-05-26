
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddUtilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUtilityDialog: React.FC<AddUtilityDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add Utility Service</DialogTitle>
          <DialogDescription className="text-gray-600">
            Register a new utility service for a property
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="utility-type" className="text-gray-700">Utility Type</Label>
            <Select>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="Select utility type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="gas">Gas</SelectItem>
                <SelectItem value="internet">Internet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="provider" className="text-gray-700">Service Provider</Label>
            <Input id="provider" placeholder="Enter provider name" className="bg-white border-gray-200" />
          </div>
          <div>
            <Label htmlFor="account-number" className="text-gray-700">Account Number</Label>
            <Input id="account-number" placeholder="Enter account number" className="bg-white border-gray-200" />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-gray-200">
              Cancel
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1 bg-[#C72030] hover:bg-[#A01825]">
              Add Utility
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUtilityDialog;
