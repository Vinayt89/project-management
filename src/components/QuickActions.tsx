
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Calendar, FileText, Clock, Users } from "lucide-react";

const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 'new-project',
      label: 'New Project',
      icon: Plus,
      description: 'Create a new project',
      action: () => console.log('Creating new project')
    },
    {
      id: 'add-task',
      label: 'Add Task',
      icon: FileText,
      description: 'Create a new task',
      action: () => console.log('Adding new task')
    },
    {
      id: 'invite-member',
      label: 'Invite Member',
      icon: UserPlus,
      description: 'Invite team member',
      action: () => console.log('Inviting team member')
    },
    {
      id: 'schedule-meeting',
      label: 'Schedule Meeting',
      icon: Calendar,
      description: 'Schedule a meeting',
      action: () => console.log('Scheduling meeting')
    },
    {
      id: 'time-tracking',
      label: 'Track Time',
      icon: Clock,
      description: 'Start time tracking',
      action: () => console.log('Starting time tracking')
    },
    {
      id: 'team-report',
      label: 'Team Report',
      icon: Users,
      description: 'Generate team report',
      action: () => console.log('Generating team report')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                onClick={action.action}
              >
                <Icon className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
