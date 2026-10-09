
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddAmcDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddAmcDialog: React.FC<AddAmcDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Add AMC Contract</DialogTitle>
          <DialogDescription>
            Create a new Annual Maintenance Contract
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="service-type">Service Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hvac">HVAC Maintenance</SelectItem>
                <SelectItem value="elevators">Elevator Service</SelectItem>
                <SelectItem value="fire-safety">Fire Safety</SelectItem>
                <SelectItem value="security">Security Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Input id="vendor" placeholder="Enter vendor name" />
          </div>
          <div>
            <Label htmlFor="contract-value">Contract Value</Label>
            <Input id="contract-value" type="number" placeholder="0.00" />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Create Contract
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAmcDialog;
