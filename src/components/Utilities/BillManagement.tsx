
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Eye, Edit, Trash2, Loader2, Zap } from 'lucide-react';
import { getAuth, getToken } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const BillManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [utilities, setUtilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUtilities = async () => {
      try {
        setIsLoading(true);
        const res = await getAuth('/utilities.json');
        // The API returns { utilities: [...] } or just [...]
        const data = res?.utilities || res || [];
        setUtilities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch utilities:', error);
        toast.error('Failed to load utilities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilities();
  }, []);

  const filteredUtilities = utilities.filter(utility => {
    const matchesSearch =
      utility.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utility.utility_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utility.meter_number?.toLowerCase().includes(searchTerm.toLowerCase());

    // For now, 'status' isn't explicitly on the utility model other than is_active
    // We can map 'active'/'inactive' to statusFilter if desired, or assume 'all' for now
    // If utility has a status field, we would use it here.
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && utility.is_active) ||
      (statusFilter === 'inactive' && !utility.is_active);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#C72030]" />
            Utility Services List
          </CardTitle>
          <CardDescription className="text-gray-600">Manage all registered utility services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search provider, type, meter number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900 border border-gray-200 focus:ring-[#C72030]"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900 border border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg bg-white border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-gray-900 font-bold">Type</TableHead>
                  <TableHead className="text-gray-900 font-bold">Provider</TableHead>
                  <TableHead className="text-gray-900 font-bold">Meter No.</TableHead>
                  <TableHead className="text-gray-900 font-bold">Est. Cost</TableHead>
                  <TableHead className="text-gray-900 font-bold">Status</TableHead>
                  <TableHead className="text-gray-900 font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-[#C72030] mr-2" />
                        <span className="text-gray-500">Loading utilities...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUtilities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                      No utilities found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUtilities.map((utility) => (
                    <TableRow key={utility.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="text-gray-900 font-medium">{utility.utility_type}</TableCell>
                      <TableCell className="text-gray-700">{utility.provider}</TableCell>
                      <TableCell className="text-gray-700">{utility.meter_number || '-'}</TableCell>
                      <TableCell className="text-gray-900 font-semibold">₹{utility.monthly_cost?.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${utility.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                          }`}>
                          {utility.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-[#C72030] hover:bg-red-50"
                            onClick={() => navigate(`/utilities/${utility.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-[#C72030] hover:bg-red-50"
                            onClick={() => navigate(`/utilities/edit/${utility.id}`)}
                          >
                            <Edit className="h-4 w-4" />
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
  );
};

export default BillManagement;
