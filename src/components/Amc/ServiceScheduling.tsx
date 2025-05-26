
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';

const ServiceScheduling = () => {
  const upcomingServices = [
    { id: 'SVC001', service: 'HVAC Quarterly Check', property: 'Sunset Apartments', vendor: 'CoolAir Services', date: '2024-01-25', time: '10:00 AM', status: 'Scheduled' },
    { id: 'SVC002', service: 'Elevator Inspection', property: 'Downtown Plaza', vendor: 'LiftTech', date: '2024-01-27', time: '2:00 PM', status: 'Confirmed' },
    { id: 'SVC003', service: 'Fire Alarm Test', property: 'Green Valley', vendor: 'SafeGuard Systems', date: '2024-01-30', time: '9:00 AM', status: 'Pending' },
    { id: 'SVC004', service: 'Pest Control', property: 'Sunset Apartments', vendor: 'BugAway', date: '2024-02-01', time: '11:30 AM', status: 'Scheduled' }
  ];

  const completedServices = [
    { service: 'HVAC Maintenance', property: 'Downtown Plaza', vendor: 'CoolAir Services', date: '2024-01-15', rating: 4.5 },
    { service: 'Security System Check', property: 'Green Valley', vendor: 'SecureWatch', date: '2024-01-12', rating: 5.0 },
    { service: 'Cleaning Service', property: 'Sunset Apartments', vendor: 'CleanCorp', date: '2024-01-10', rating: 4.2 }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Upcoming Services</CardTitle>
          <CardDescription className="text-gray-600">Scheduled maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-[#C72030] bg-red-50 p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{service.service}</h3>
                    <p className="text-sm text-gray-600">{service.property}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.date} at {service.time}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {service.vendor}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    service.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    service.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {service.status}
                  </span>
                  <Button variant="outline" size="sm" className="border-gray-200">
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
                      className={`h-8 flex items-center justify-center text-xs rounded ${
                        day > 0 && day <= 31
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
              {completedServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{service.service}</div>
                      <div className="text-xs text-gray-500">{service.property} • {service.vendor}</div>
                      <div className="text-xs text-gray-400">{service.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">★ {service.rating}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceScheduling;
