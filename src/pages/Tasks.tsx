import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Task } from '../types';
import { Search, Filter } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Tasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
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
    },
    {
      id: '5',
      name: 'Update documentation',
      assignee: 'Emily Davis',
      dueDate: '2024-05-02',
      status: 'In Progress',
      priority: 'Medium',
      projectId: '1',
      createdDate: '2024-02-20'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');

  const [newTask, setNewTask] = useState({
    name: '',
    assignee: '',
    dueDate: '',
    status: 'Not Started' as Task['status'],
    priority: 'Medium' as Task['priority'],
    projectId: ''
  });

  const projects = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Marketing Campaign' },
    { id: '3', name: 'Mobile App Development' },
  ];

  const teamMembers = [
    'John Smith',
    'Sarah Brown',
    'Michael Lee',
    'Emily Davis'
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'All' || task.assignee === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const handleCreateTask = () => {
    if (!newTask.name || !newTask.assignee || !newTask.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      name: newTask.name,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      status: newTask.status,
      priority: newTask.priority,
      projectId: newTask.projectId,
      createdDate: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    setNewTask({ name: '', assignee: '', dueDate: '', status: 'Not Started', priority: 'Medium', projectId: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Task created successfully",
    });
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    
    toast({
      title: "Updated",
      description: "Task status updated successfully",
    });
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getProjectName = (projectId?: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'No Project';
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader 
        title="Tasks" 
        buttonText="New Task"
        onButtonClick={() => setIsDialogOpen(true)}
      />

      {/* Search and Filters */}
      <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks or assignees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Priority</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Assignees</SelectItem>
              {teamMembers.map(member => (
                <SelectItem key={member} value={member}>{member}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Task</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Project</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Assignee</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Due Date</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Priority</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                    {task.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {getProjectName(task.projectId)}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {task.assignee}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Select 
                      value={task.status} 
                      onValueChange={(value: Task['status']) => handleStatusChange(task.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Creation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="taskName">Task Name *</Label>
              <Input
                id="taskName"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                placeholder="Enter task name"
              />
            </div>

            <div>
              <Label htmlFor="taskProject">Project</Label>
              <Select 
                value={newTask.projectId} 
                onValueChange={(value) => setNewTask({ ...newTask, projectId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="taskAssignee">Assignee *</Label>
              <Select 
                value={newTask.assignee} 
                onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="taskDueDate">Due Date *</Label>
              <Input
                id="taskDueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="taskPriority">Priority</Label>
              <Select 
                value={newTask.priority} 
                onValueChange={(value: Task['priority']) => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="taskStatus">Status</Label>
              <Select 
                value={newTask.status} 
                onValueChange={(value: Task['status']) => setNewTask({ ...newTask, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
