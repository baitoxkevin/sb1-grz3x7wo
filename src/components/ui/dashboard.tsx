import { useState } from 'react';
import { Card, CardContent } from './card';
import { Calendar } from './calendar';

export const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const meetings = [
    {
      id: 1,
      name: "Team Meeting",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
    },
    {
      id: 2,
      name: "Project Review",
      startTime: "4:00 PM",
      endTime: "5:00 PM",
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Total Projects</div>
            </div>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Active Projects</div>
            </div>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Total Candidates</div>
            </div>
            <div className="text-2xl font-bold">245</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Active Candidates</div>
            </div>
            <div className="text-2xl font-bold">180</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <h3 className="text-lg font-medium">Calendar</h3>
            </div>
            <div className="pt-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-2">
              <h3 className="text-lg font-medium">Upcoming Meetings</h3>
            </div>
            <div className="pt-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {meeting.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {meeting.startTime} - {meeting.endTime}
                    </p>
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
