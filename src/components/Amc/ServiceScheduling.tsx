
import React, { useState, useEffect } from 'react';
import { SectionLoader } from '@/components/ui/loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { Calendar, Clock, User, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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

  /**
   * One schedule row. Overdue entries only change the accent — a red left rule
   * and a red badge — instead of getting their own fill, border weight and
   * hover colour, so both lists read as the same component.
   */
  const renderSchedule = (schedule: any, overdue = false) => (
    <div
      key={schedule.id}
      className={`flex items-center justify-between gap-3 rounded-md border border-brand-border px-4 py-3 transition-colors hover:bg-brand-selected ${overdue ? 'border-l-[3px] border-l-brand-error' : ''
        }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-light">
          <Calendar className="h-4 w-4 text-brand" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-brand-body-4 font-medium text-brand-text">
              {schedule.service_type || 'Maintenance Service'}
            </span>
            {overdue && (
              <span className="shrink-0 rounded-full bg-brand-error-bg px-2 py-0.5 text-brand-caption font-medium text-brand-error">
                Overdue
              </span>
            )}
          </div>
          <div className="truncate text-brand-body-5 text-brand-text-light">
            {schedule.amc_contract?.site_name || 'Various Sites'}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center text-brand-caption text-brand-text-light">
              <Clock className="mr-1 h-3 w-3" />
              {schedule.scheduled_date}
            </span>
            <span className="flex items-center text-brand-caption text-brand-text-light">
              <User className="mr-1 h-3 w-3" />
              {schedule.amc_contract?.vendor_name || 'Unassigned Vendor'}
            </span>
            {!overdue && schedule.days_until !== undefined && (
              <span className="text-brand-caption font-medium text-brand-text-light">
                in {schedule.days_until} days
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-brand-caption font-medium capitalize ${getStatusStyle(schedule.status)}`}
        >
          {schedule.status_badge?.label || schedule.status}
        </span>
        <Button variant="outline" size="sm" className="fm-button-fix px-4">
          Details
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <Panel title="Upcoming Services" description="Scheduled maintenance activities">
        {loading ? (
          <SectionLoader message="Loading schedules..." />
        ) : [...overdueSchedules, ...upcomingSchedules].length === 0 ? (
          <div className="py-12 text-center text-brand-body-5 text-brand-text-light">
            No upcoming services found.
          </div>
        ) : (
          <>
            {overdueSchedules.map((schedule) => renderSchedule(schedule, true))}
            {upcomingSchedules.map((schedule) => renderSchedule(schedule))}
          </>
        )}

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
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                <SectionLoader />
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
