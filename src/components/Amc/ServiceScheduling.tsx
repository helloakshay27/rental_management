
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const ServiceScheduling = () => {
  const [upcomingSchedules, setUpcomingSchedules] = useState<any[]>([]);
  const [overdueSchedules, setOverdueSchedules] = useState<any[]>([]);
  const [completedSchedules, setCompletedSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcomingPagination, setUpcomingPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_entries: 0,
    per_page: 10
  });
  const [completedPagination, setCompletedPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_entries: 0,
    per_page: 10
  });

  const fetchSchedules = async (upcomingPage = 1, completedPage = 1) => {
    try {
      setLoading(true);
      const data = await getAuth(`/amc_schedules.json?upcoming_page=${upcomingPage}&completed_page=${completedPage}`);

      // Set upcoming schedules (combining upcoming and overdue)
      setUpcomingSchedules(data.upcoming || []);
      setOverdueSchedules(data.overdue || []);
      setCompletedSchedules(data.completed || []);

      // Set pagination for upcoming
      if (data.pagination?.upcoming) {
        setUpcomingPagination({
          current_page: data.pagination.upcoming.current_page,
          total_pages: data.pagination.upcoming.total_pages,
          total_entries: data.pagination.upcoming.total_entries,
          per_page: data.pagination.upcoming.per_page
        });
      }

      // Set pagination for completed
      if (data.pagination?.completed) {
        setCompletedPagination({
          current_page: data.pagination.completed.current_page,
          total_pages: data.pagination.completed.total_pages,
          total_entries: data.pagination.completed.total_entries,
          per_page: data.pagination.completed.per_page
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
            ) : [...overdueSchedules, ...upcomingSchedules].length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No upcoming services found.
              </div>
            ) : (
              <>
                {/* Overdue Services - Show First */}
                {overdueSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border-2 border-red-300 bg-red-50 rounded-lg hover:bg-red-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-red-600 bg-red-100 p-1.5 rounded-lg" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {schedule.service_type || 'Maintenance Service'}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">
                            Overdue
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{schedule.amc_contract?.site_name || 'Various Sites'}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {schedule.scheduled_date}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {schedule.amc_contract?.vendor_name || 'Unassigned Vendor'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(schedule.status)}`}>
                        {schedule.status_badge?.label || schedule.status}
                      </span>
                      <Button variant="outline" size="sm" className="border-gray-200">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Upcoming Services */}
                {upcomingSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-[#C72030] bg-red-50 p-1.5 rounded-lg" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {schedule.service_type || 'Maintenance Service'}
                        </h3>
                        <p className="text-sm text-gray-600">{schedule.amc_contract?.site_name || 'Various Sites'}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {schedule.scheduled_date}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {schedule.amc_contract?.vendor_name || 'Unassigned Vendor'}
                          </span>
                          {schedule.days_until !== undefined && (
                            <span className="text-xs text-blue-600 font-medium">
                              in {schedule.days_until} days
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(schedule.status)}`}>
                        {schedule.status_badge?.label || schedule.status}
                      </span>
                      <Button variant="outline" size="sm" className="border-gray-200">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Pagination */}
          {!loading && upcomingPagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Showing {((upcomingPagination.current_page - 1) * upcomingPagination.per_page) + 1} to {Math.min(upcomingPagination.current_page * upcomingPagination.per_page, upcomingPagination.total_entries)} of {upcomingPagination.total_entries} schedules
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={upcomingPagination.current_page === 1}
                  onClick={() => fetchSchedules(upcomingPagination.current_page - 1, completedPagination.current_page)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-xs font-medium">
                  Page {upcomingPagination.current_page} of {upcomingPagination.total_pages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={upcomingPagination.current_page === upcomingPagination.total_pages}
                  onClick={() => fetchSchedules(upcomingPagination.current_page + 1, completedPagination.current_page)}
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
              ) : completedSchedules.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No completed services recently.
                </div>
              ) : (
                completedSchedules
                  .slice(0, 5)
                  .map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {service.service_type || 'Maintenance Service'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {service.amc_contract?.site_name} • {service.amc_contract?.vendor_name}
                          </div>
                          <div className="text-xs text-gray-400">{service.completed_date || service.scheduled_date}</div>
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
