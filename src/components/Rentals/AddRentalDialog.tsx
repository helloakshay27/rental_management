
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddRentalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddRentalDialog = ({ open, onOpenChange }: AddRentalDialogProps) => {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Rental Agreement</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new rental agreement
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-6">
          {/* Property Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property">Property</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prop1">Sunset Apartments - Unit 2A</SelectItem>
                  <SelectItem value="prop2">Downtown Plaza - Unit 5B</SelectItem>
                  <SelectItem value="prop3">Green Valley - Unit 1C</SelectItem>
                  <SelectItem value="prop4">City Center - Unit 3A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leaseType">Lease Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select lease type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Lease</SelectItem>
                  <SelectItem value="monthly">Monthly Lease</SelectItem>
                  <SelectItem value="shortterm">Short-term Rental</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tenant Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tenant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenantName">Tenant Name</Label>
                <Input id="tenantName" placeholder="Enter tenant name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tenantEmail">Email</Label>
                <Input id="tenantEmail" type="email" placeholder="tenant@email.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tenantPhone">Phone</Label>
                <Input id="tenantPhone" placeholder="+91 98765 43210" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input id="profession" placeholder="Enter profession" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" placeholder="Name - Phone Number" />
            </div>
          </div>

          {/* Lease Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lease Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Financial Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent (₹)</Label>
                <Input id="monthlyRent" type="number" placeholder="25000" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                <Input id="securityDeposit" type="number" placeholder="50000" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maintenanceCharges">Maintenance Charges (₹)</Label>
                <Input id="maintenanceCharges" type="number" placeholder="2000" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentDueDate">Rent Due Date</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select due date" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>
                        {i + 1}{i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th'} of every month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lateFeePercentage">Late Fee (%)</Label>
                <Input id="lateFeePercentage" type="number" placeholder="5" step="0.1" />
              </div>
            </div>
          </div>

          {/* Additional Terms */}
          <div className="space-y-2">
            <Label htmlFor="additionalTerms">Additional Terms & Conditions</Label>
            <Textarea 
              id="additionalTerms" 
              placeholder="Enter any additional terms and conditions..."
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Agreement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRentalDialog;
