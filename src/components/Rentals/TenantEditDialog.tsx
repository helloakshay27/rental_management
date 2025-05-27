
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  leaseStart: string;
  leaseEnd: string;
  rent: number;
  status: string;
  emergencyContact: string;
  profession: string;
}

interface TenantEditDialogProps {
  tenant: Tenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedTenant: Tenant) => void;
}

const TenantEditDialog = ({ tenant, open, onOpenChange, onSave }: TenantEditDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Tenant | null>(null);

  useEffect(() => {
    if (tenant) {
      setFormData({ ...tenant });
    }
  }, [tenant]);

  if (!tenant || !formData) return null;

  const handleSave = () => {
    onSave(formData);
    toast({
      title: "Tenant Updated",
      description: `${formData.name}'s information has been updated successfully.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#1a1a1a]">
            Edit Tenant - {tenant.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="notice_given">Notice Given</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rent">Monthly Rent (₹)</Label>
            <Input
              id="rent"
              type="number"
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: Number(e.target.value) })}
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leaseStart">Lease Start Date</Label>
            <Input
              id="leaseStart"
              type="date"
              value={formData.leaseStart}
              onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leaseEnd">Lease End Date</Label>
            <Input
              id="leaseEnd"
              type="date"
              value={formData.leaseEnd}
              onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
              className="bg-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#C72030] hover:bg-[#A01825]">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantEditDialog;
