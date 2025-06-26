export interface Project {
  id: string;
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  dueDate: string;
  progress: number;
  priority?: 'Low' | 'Medium' | 'High';
  description?: string;
  budget?: number;
  estimatedHours?: number;
  actualHours?: number;
  clientName?: string;
  tags?: string[];
  createdDate: string;
  updatedDate?: string;
  managerId?: string;
}

export interface Task {
  id: string;
  name: string;
  assignee: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  projectId?: string;
  description?: string;
  estimatedHours?: number;
  actualHours?: number;
  completedDate?: string;
  createdDate: string;
  tags?: string[];
  subtasks?: Subtask[];
  comments?: TaskComment[];
}

export interface Subtask {
  id: string;
  name: string;
  completed: boolean;
  createdDate: string;
}

export interface TaskComment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role?: string;
  salary?: number;
  payPeriod?: string;
  avatar?: string;
  department?: string;
  hireDate?: string;
  status?: 'Active' | 'Inactive';
  skills?: string[];
  phone?: string;
  address?: string;
  emergencyContact?: string;
  workload?: number; // percentage of capacity
  projects?: string[]; // Array of project names the member is involved in
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  status: 'Paid' | 'Unpaid' | 'Processing';
  amount?: number;
  dueDate?: string;
  hoursWorked?: number;
  overtimeHours?: number;
  bonus?: number;
  deductions?: number;
  netPay?: number;
  payDate?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  assigneeId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  dueDate: string;
  dependencies?: string[];
  estimatedHours?: number;
  actualHours?: number;
  blockedReason?: string;
  completedDate?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  projectId?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority?: 'Low' | 'Medium' | 'High';
  createdDate: string;
  dueDate?: string;
  templateId?: string;
  tags?: string[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  tasks: Omit<Task, 'id' | 'projectId' | 'createdDate'>[];
  estimatedDuration: number; // in days
  category: string;
}

export interface Notification {
  id: string;
  type: 'overdue' | 'due-soon' | 'completed' | 'assigned' | 'mentioned';
  title: string;
  message: string;
  read: boolean;
  createdDate: string;
  userId?: string;
  relatedId?: string; // project, task, or workflow id
}
