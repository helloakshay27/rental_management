
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { postAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface MaintenanceCostEntry {
    cost_type: string;
    amount: string;
    description: string;
}

interface AddMaintenanceCostModalProps {
    isOpen: boolean;
    onClose: () => void;
    maintenanceRequestId: number | string;
    onSuccess: () => void;
}

const AddMaintenanceCostModal = ({ isOpen, onClose, maintenanceRequestId, onSuccess }: AddMaintenanceCostModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [costs, setCosts] = useState<MaintenanceCostEntry[]>([
        { cost_type: '', amount: '', description: '' }
    ]);

    const addRow = () => {
        setCosts([...costs, { cost_type: '', amount: '', description: '' }]);
    };

    const removeRow = (index: number) => {
        if (costs.length === 1) return;
        setCosts(costs.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: keyof MaintenanceCostEntry, value: string) => {
        const newCosts = [...costs];
        newCosts[index][field] = value;
        setCosts(newCosts);
    };

    const handleSubmit = async () => {
        // Validation
        const isValid = costs.every(c => c.cost_type && c.amount && c.description);
        if (!isValid) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);

            const promises = costs.map(cost => {
                const payload = {
                    maintenance_cost: {
                        maintenance_request_id: parseInt(maintenanceRequestId.toString()),
                        cost_type: cost.cost_type,
                        amount: parseFloat(cost.amount),
                        description: cost.description
                    }
                };
                return postAuth('/maintenance_costs.json', payload);
            });

            await Promise.all(promises);

            toast.success('Maintenance costs added successfully');
            onSuccess();
            onClose();
            setCosts([{ cost_type: '', amount: '', description: '' }]);
        } catch (error: any) {
            console.error('Error adding maintenance costs:', error);
            toast.error(error.message || 'Failed to add costs');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Add Maintenance Costs
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {costs.map((cost, index) => (
                        <div key={index} className="space-y-4 p-4 border-2 border-gray-100 rounded-lg relative bg-white">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Entry #{index + 1}</h4>
                                {costs.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeRow(index)}
                                        className="h-8 w-8 text-gray-400 hover:text-[#C72030] hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Cost Type *</Label>
                                    <Select
                                        value={cost.cost_type}
                                        onValueChange={(val) => updateRow(index, 'cost_type', val)}
                                    >
                                        <SelectTrigger className="bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium h-11">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="labor">Labor</SelectItem>
                                            <SelectItem value="material">Material</SelectItem>
                                            <SelectItem value="transport">Transport</SelectItem>
                                            <SelectItem value="tax">Tax/GST</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Amount (₹) *</Label>
                                    <Input
                                        type="number"
                                        value={cost.amount}
                                        onChange={(e) => updateRow(index, 'amount', e.target.value)}
                                        className="bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium h-11"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label className="text-gray-900 font-medium">Description *</Label>
                                    <Textarea
                                        value={cost.description}
                                        onChange={(e) => updateRow(index, 'description', e.target.value)}
                                        className="bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium min-h-[80px]"
                                        placeholder="Enter description..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={addRow}
                        className="w-full border-dashed border-2 border-gray-200 text-gray-500 hover:text-[#C72030] hover:border-[#C72030] py-6 rounded-lg font-medium transition-all"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Cost Row
                    </Button>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#C72030] hover:bg-[#A01825] text-white font-medium min-w-[140px]"
                    >
                        {isLoading ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                        ) : (
                            'Submit All Costs'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddMaintenanceCostModal;
