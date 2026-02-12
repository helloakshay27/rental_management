import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Edit, Save, Plus, Loader2, Trash } from 'lucide-react';
import { getAuth, postAuth, patchAuth, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';

type Amenity = {
    id: number | string;
    name: string;
    active: boolean;
};

const AmenityMaster = () => {
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<{ name: string; active: boolean }>({
        name: '',
        active: true,
    });
    const [editingId, setEditingId] = useState<number | string | null>(null);

    const fetchAmenities = async () => {
        try {
            setLoading(true);
            const res: unknown = await getAuth('/pms/amenities.json');
            const listCandidate =
                (res as Record<string, unknown>)?.amenities ??
                (res as Record<string, unknown>)?.pms_amenities ??
                (res as Record<string, unknown>)?.data ??
                res;
            const parsed = Array.isArray(listCandidate) ? (listCandidate as unknown[]) : [];
            const normalized: Amenity[] = parsed.map((item) => {
                const obj = item as Record<string, unknown>;
                const id = (obj?.id as number | string) ?? '';
                const name = (obj?.name as string) ?? '';
                const active =
                    (obj?.active as boolean) ??
                    (obj?.is_active as boolean) ??
                    false;
                return { id, name, active };
            });
            setAmenities(normalized);
        } catch (error) {
            const message =
                (error as { message?: string })?.message || 'Failed to load amenities';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAmenities();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Amenity name is required');
            return;
        }
        try {
            setSubmitting(true);
            if (editingId) {
                await patchAuth(`/pms/amenities/${editingId}.json`, {
                    pms_amenity: { name: formData.name.trim(), active: formData.active },
                });
                toast.success('Amenity updated');
            } else {
                await postAuth('/pms/amenities.json', {
                    pms_amenity: { name: formData.name.trim(), active: formData.active },
                });
                toast.success('Amenity created');
            }
            setFormData({ name: '', active: true });
            setEditingId(null);
            fetchAmenities();
        } catch (error) {
            const message =
                (error as { message?: string })?.message || 'Request failed';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (amenity: Amenity) => {
        setEditingId(amenity.id);
        setFormData({ name: amenity.name || '', active: !!amenity.active });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', active: true });
    };

    const deleteAmenity = async (amenity: Amenity) => {
        if (!window.confirm('Are you sure you want to delete this amenity?')) {
            return;
        }
        try {
            await deleteAuth(`/pms/amenities/${amenity.id}.json`);
            toast.success('Amenity deleted');
            fetchAmenities();
        } catch (error) {
            const message =
                (error as { message?: string })?.message || 'Request failed';
            toast.error(message);
        }
    };

    const getStatusStyle = (active: boolean) => {
        return active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    };

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Amenity Master</h1>
                        <p className="text-sm text-gray-500">
                            Manage standard amenities across properties
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                        <div className="h-1 bg-[#C72030]"></div>
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-xs text-[#C72030] font-bold uppercase tracking-widest">
                                {editingId ? 'Edit Amenity' : 'Add New Amenity'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label className="text-gray-700 font-medium">Amenity Name</Label>
                                    <Input
                                        placeholder="e.g., Swimming Pool"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Active</Label>
                                    <div className="flex items-center h-10 px-3 bg-white border border-gray-300 rounded-md">
                                        <Switch
                                            checked={formData.active}
                                            onCheckedChange={(v) =>
                                                setFormData({ ...formData, active: !!v })
                                            }
                                        />
                                        <span className="ml-3 text-sm text-gray-700">
                                            {formData.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    type="submit"
                                    className="gap-2 bg-[#C72030] hover:bg-[#b51b28]"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {editingId ? 'Save Changes' : 'Create Amenity'}
                                </Button>
                                {editingId && (
                                    <Button variant="outline" onClick={cancelEdit}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </form>

                <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-xs text-[#C72030] font-bold uppercase tracking-widest">
                            Amenities List
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border rounded-xl bg-white border-gray-200 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 border-b border-gray-200">
                                        <TableHead className="text-gray-900 font-semibold py-4 px-4 text-sm uppercase">
                                            Amenity Details
                                        </TableHead>
                                        <TableHead className="text-gray-900 font-semibold text-sm uppercase">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-gray-900 font-semibold text-sm uppercase text-right px-4">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-8 text-center">
                                                <Loader2 className="h-5 w-5 animate-spin text-[#C72030]" />
                                            </TableCell>
                                        </TableRow>
                                    ) : amenities.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="text-center py-12 text-gray-500 font-medium italic"
                                            >
                                                No amenities found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        amenities.map((amenity) => (
                                            <TableRow
                                                key={amenity.id}
                                                className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                                            >
                                                <TableCell className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-red-50 rounded-lg">
                                                            <FileText className="h-5 w-5 text-[#C72030]" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">
                                                                {amenity.name}
                                                            </div>
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                                ID: {amenity.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                                                            amenity.active
                                                        )}`}
                                                    >
                                                        {amenity.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right px-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-gray-400 hover:text-[#C72030] hover:bg-red-50"
                                                            onClick={() => startEdit(amenity)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-gray-400 hover:text-[#C72030] hover:bg-red-50"
                                                            onClick={() => deleteAmenity(amenity)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AmenityMaster;
