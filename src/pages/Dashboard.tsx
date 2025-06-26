import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, LayoutDashboard, ListChecks, User2 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import TimeTracker from '../components/TimeTracker';
import ProjectCalendar from '../components/ProjectCalendar';
import RecentFiles from '../components/RecentFiles';
import QuickActions from '../components/QuickActions';
import { Project, Task, TeamMember, Notification } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const projects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      status: 'In Progress',
      dueDate: '2024-06-30',
      progress: 75,
      createdDate: '2024-03-01'
    },
    {
      id: '2',
      name: 'Marketing Campaign',
      status: 'Not Started',
      dueDate: '2024-07-15',
      progress: 0,
      createdDate: '2024-03-05'
    },
    {
      id: '3',
      name: 'Mobile App Development',
      status: 'In Progress',
      dueDate: '2024-05-20',
      progress: 60,
      createdDate: '2024-02-15'
    }
  ];

  const tasks: Task[] = [
    {
      id: '1',
      name: 'Design mockups',
      assignee: 'John Smith',
      dueDate: '2024-05-05',
      status: 'In Progress',
      priority: 'High',
      projectId: '1',
      createdDate: '2024-03-01'
    },
    {
      id: '2',
      name: 'Write blog post',
      assignee: 'Sarah Brown',
      dueDate: '2024-04-25',
      status: 'Completed',
      priority: 'Medium',
      projectId: '2',
      createdDate: '2024-03-05'
    },
    {
      id: '3',
      name: 'Fix bugs',
      assignee: 'John Smith',
      dueDate: '2024-04-28',
      status: 'In Progress',
      priority: 'High',
      projectId: '1',
      createdDate: '2024-02-15'
    },
    {
      id: '4',
      name: 'Create presentation',
      assignee: 'Michael Lee',
      dueDate: '2024-05-10',
      status: 'Not Started',
      priority: 'Low',
      projectId: '3',
      createdDate: '2024-01-10'
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      initials: 'JS',
      department: 'Development'
    },
    {
      id: '2',
      name: 'Sarah Brown',
      email: 'sarah.brown@example.com',
      initials: 'SB',
      department: 'Marketing'
    },
    {
      id: '3',
      name: 'Michael Lee',
      email: 'michael.lee@example.com',
      initials: 'ML',
      department: 'Design'
    }
  ];

  const projectProgressData = {
    labels: projects.map(project => project.name),
    datasets: [
      {
        label: 'Progress',
        data: projects.map(project => project.progress),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const taskStatusData = {
    labels: ['Not Started', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Tasks',
        data: [
          tasks.filter(task => task.status === 'Not Started').length,
          tasks.filter(task => task.status === 'In Progress').length,
          tasks.filter(task => task.status === 'Completed').length,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(25, 206, 86, 0.6)',
        ],
      },
    ],
  };

  const upcomingDeadlines = tasks
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const recentActivities = [
    {
      id: '1',
      message: 'John Smith completed the design mockups for Website Redesign project.',
      date: '2024-04-25',
    },
    {
      id: '2',
      message: 'Sarah Brown started working on the Marketing Campaign project.',
      date: '2024-04-24',
    },
    {
      id: '3',
      message: 'Michael Lee created a presentation for the Mobile App Development project.',
      date: '2024-04-23',
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0, // Remove animation for steady charts
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const taskStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0, // Remove animation for steady charts
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleTimeEntryAdd = (entry: any) => {
    console.log('Time entry added:', entry);
    // Here you would typically update the task's actual hours in your state management
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-sm text-gray-500">Active projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-sm text-gray-500">Assigned tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <User2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-sm text-gray-500">Active members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25,000</div>
            <p className="text-sm text-gray-500">Estimated budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Charts and Time Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Overview of project completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={projectProgressData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Time Tracker */}
        <TimeTracker 
          tasks={tasks}
          projects={projects}
          onTimeEntryAdd={handleTimeEntryAdd}
        />
      </div>

      {/* Task Status Chart and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>Distribution of tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={taskStatusData} options={taskStatusOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Project Calendar */}
        <ProjectCalendar projects={projects} tasks={tasks} />
      </div>

      {/* Activity, Deadlines, and Files */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest project updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="text-sm">
                <p className="font-medium">{activity.message}</p>
                <p className="text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks due soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.map(task => (
              <div key={task.id} className="text-sm">
                <p className="font-medium">{task.name}</p>
                <p className="text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Files */}
        <RecentFiles />
      </div>
    </div>
  );
};

export default Dashboard;
