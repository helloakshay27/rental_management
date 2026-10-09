
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Add Utility Service</DialogTitle>
          <DialogDescription>
            Register a new utility service for a property
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="utility-type">Utility Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select utility type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="gas">Gas</SelectItem>
                <SelectItem value="internet">Internet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="provider">Service Provider</Label>
            <Input id="provider" placeholder="Enter provider name" />
          </div>
          <div>
            <Label htmlFor="account-number">Account Number</Label>
            <Input id="account-number" placeholder="Enter account number" />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Add Utility
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUtilityDialog;
