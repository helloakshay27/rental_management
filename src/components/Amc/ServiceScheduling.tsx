
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const ServiceScheduling = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_entries: 0,
    per_page: 10
  });

  const fetchSchedules = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getAuth(`/amc_schedules.json?page=${page}`);
      setSchedules(data.amc_schedules || []);
      if (data.pagination) {
        setPagination({
          current_page: data.pagination.current_page,
          total_pages: data.pagination.total_pages,
          total_entries: data.pagination.total_entries,
          per_page: data.pagination.per_page
        });
      }
    } catch (error) {
      console.error('Error fetching AMC schedules:', error);
      toast.error('Failed to load maintenance schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const completedServices = [
    { service: 'HVAC Maintenance', property: 'Downtown Plaza', vendor: 'CoolAir Services', date: '2024-01-15', rating: 4.5 },
    { service: 'Security System Check', property: 'Green Valley', vendor: 'SecureWatch', date: '2024-01-12', rating: 5.0 },
    { service: 'Cleaning Service', property: 'Sunset Apartments', vendor: 'CleanCorp', date: '2024-01-10', rating: 4.2 }
  ];

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Upcoming Services</CardTitle>
          <CardDescription className="text-gray-600">Scheduled maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 text-[#C72030] animate-spin" />
                <p className="text-sm text-gray-500">Loading schedules...</p>
              </div>
            ) : schedules.filter(s => s.status?.toLowerCase() !== 'completed').length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No upcoming services found.
              </div>
            ) : (
              schedules
                .filter(s => s.status?.toLowerCase() !== 'completed')
                .map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-[#C72030] bg-red-50 p-1.5 rounded-lg" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {schedule.amc_contract?.service_type || schedule.description || 'Maintenance Service'}
                        </h3>
                        <p className="text-sm text-gray-600">{schedule.amc_contract?.site?.name || 'Various Sites'}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {schedule.schedule_date}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {schedule.amc_contract?.vendor?.name || 'Unassigned Vendor'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(schedule.status)}`}>
                        {schedule.status}
                      </span>
                      <Button variant="outline" size="sm" className="border-gray-200">
                        Details
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Pagination */}
          {!loading && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total_entries)} of {pagination.total_entries} schedules
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page === 1}
                  onClick={() => fetchSchedules(pagination.current_page - 1)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-xs font-medium">
                  Page {pagination.current_page} of {pagination.total_pages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page === pagination.total_pages}
                  onClick={() => fetchSchedules(pagination.current_page + 1)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Service Calendar</CardTitle>
            <CardDescription className="text-gray-600">Monthly service overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6; // Adjust for month start
                  const hasService = [25, 27, 30].includes(day);
                  return (
                    <div
                      key={i}
                      className={`h-8 flex items-center justify-center text-xs rounded ${day > 0 && day <= 31
                        ? hasService
                          ? 'bg-[#C72030] text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                        : 'text-gray-300'
                        }`}
                    >
                      {day > 0 && day <= 31 ? day : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Completions</CardTitle>
            <CardDescription className="text-gray-600">Recently completed services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-[#C72030]" />
                </div>
              ) : schedules.filter(s => s.status?.toLowerCase() === 'completed').length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No completed services recently.
                </div>
              ) : (
                schedules
                  .filter(s => s.status?.toLowerCase() === 'completed')
                  .slice(0, 5)
                  .map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {service.amc_contract?.service_type || service.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {service.amc_contract?.site?.name} • {service.amc_contract?.vendor?.name}
                          </div>
                          <div className="text-xs text-gray-400">{service.schedule_date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 capitalize text-green-700">Done</div>
                        <div className="text-xs text-gray-500">Status</div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceScheduling;
