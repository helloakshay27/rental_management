
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Eye, Edit, AlertTriangle, Loader2 } from 'lucide-react';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const ContractManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const data = await getAuth('/amc_contracts');
      if (Array.isArray(data)) {
        setContracts(data);
      } else if (data?.amc_contracts) {
        setContracts(data.amc_contracts);
      } else {
        setContracts([]);
      }
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      toast.error('Failed to load AMC contracts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch =
      contract.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.vendor?.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.site?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && contract.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const getDaysToExpiry = (endDate: string) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">AMC Contracts</CardTitle>
          <CardDescription className="text-gray-600">Manage all Annual Maintenance Contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search contracts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900 border border-gray-200"
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
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg bg-white border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-white border-b border-gray-200">
                  <TableHead className="text-gray-900 font-medium">Contract ID</TableHead>
                  <TableHead className="text-gray-900 font-medium">Service</TableHead>
                  <TableHead className="text-gray-900 font-medium">Vendor</TableHead>
                  <TableHead className="text-gray-900 font-medium">Property</TableHead>
                  <TableHead className="text-gray-900 font-medium">Start Date</TableHead>
                  <TableHead className="text-gray-900 font-medium">End Date</TableHead>
                  <TableHead className="text-gray-900 font-medium">Value</TableHead>
                  <TableHead className="text-gray-900 font-medium">Status</TableHead>
                  <TableHead className="text-gray-900 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-[#C72030]" />
                        <span className="ml-2 text-gray-500">Loading contracts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No contracts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContracts.map((contract) => {
                    const daysToExpiry = getDaysToExpiry(contract.end_date);
                    return (
                      <TableRow key={contract.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="text-gray-900 font-medium">AMC{contract.id}</TableCell>
                        <TableCell className="text-gray-700">{contract.service_type}</TableCell>
                        <TableCell className="text-gray-700">{contract.vendor?.vendor_name || contract.vendor?.name || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{contract.site?.name || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{contract.start_date}</TableCell>
                        <TableCell className="text-gray-700">{contract.end_date}</TableCell>
                        <TableCell className="text-gray-900 font-semibold">₹{parseFloat(contract.contract_value || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${contract.status === 'active' ? 'bg-green-100 text-green-800' :
                              contract.status === 'expired' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                              {contract.status}
                            </span>
                            {daysToExpiry <= 60 && daysToExpiry > 0 && contract.status === 'active' && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={() => navigate(`/amc/${contract.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={() => navigate(`/amc/edit/${contract.id}`)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractManagement;
