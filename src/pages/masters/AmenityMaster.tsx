import React, { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { FileText, Edit, Save, Plus, Trash } from 'lucide-react';
import { getAuth, postAuth, patchAuth, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

type Amenity = {
    id: number | string;
    name: string;
    active: boolean;
};

const columns: ColumnConfig[] = [
    { key: 'name', label: 'Amenity Details', sortable: true, draggable: true },
    { key: 'active', label: 'Status', sortable: true, draggable: true },
];

const AmenityMaster = () => {
    const navigate = useNavigate();
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
        return active ? 'bg-brand-success-bg text-brand-success' : 'bg-brand-error-bg text-brand-error';
    };

    const renderCell = (amenity: Amenity, columnKey: string) => {
        switch (columnKey) {
            case 'name':
                return (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-light rounded-md">
                            <FileText className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                            <div className="font-semibold text-brand-text">{amenity.name}</div>
                            <div className="text-brand-caption text-brand-text-light font-bold uppercase tracking-wider">
                                ID: {amenity.id}
                            </div>
                        </div>
                    </div>
                );
            case 'active':
                return (
                    <span
                        className={`px-2 py-0.5 rounded text-brand-caption font-bold uppercase tracking-wider ${getStatusStyle(
                            amenity.active
                        )}`}
                    >
                        {amenity.active ? 'Active' : 'Inactive'}
                    </span>
                );
            default:
                return amenity[columnKey as keyof Amenity] as React.ReactNode;
        }
    };

    const renderActions = (amenity: Amenity) => (
        <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" title="Edit" onClick={() => startEdit(amenity)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" className="text-brand-error" onClick={() => deleteAmenity(amenity)}>
                <Trash className="h-4 w-4" />
            </Button>
        </div>
    );

    return (
        <PageContainer>
            <PageHeader
                title="Amenity Master"
                description="Manage standard amenities across properties"
                backTo="/masters"
            />

            <form onSubmit={handleSubmit}>
                <Card className="bg-white shadow-none hover:shadow-none">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-brand-body-3">
                            {editingId ? 'Edit Amenity' : 'Add New Amenity'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
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
                                    <Spinner />
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

            <div>
                <EnhancedTable
                    data={amenities}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(amenity) => String(amenity.id)}
                    storageKey="amenities-master-table"
                    emptyMessage="No amenities found"
                    loading={loading}
                    loadingMessage="Loading amenities..."
                    searchPlaceholder="Search amenities..."
                    enableSearch={true}
                    enableSelection={false}
                    exportFileName="amenities"
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </PageContainer>
    );
};

export default AmenityMaster;
