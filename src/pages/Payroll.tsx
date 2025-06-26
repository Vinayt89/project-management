
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { PayrollEntry, TeamMember } from '../types';
import { Search, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Payroll = () => {
  const { toast } = useToast();
  
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'John Smith',
      month: 'March 2024',
      status: 'Paid',
      amount: 7500,
      dueDate: '2024-03-31',
      hoursWorked: 160,
      bonus: 500
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Sarah Brown',
      month: 'March 2024',
      status: 'Unpaid',
      amount: 5000,
      dueDate: '2024-03-31',
      hoursWorked: 160,
      bonus: 0
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Michael Lee',
      month: 'March 2024',
      status: 'Processing',
      amount: 6500,
      dueDate: '2024-03-31',
      hoursWorked: 170,
      overtimeHours: 10,
      bonus: 200
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Emily Davis',
      month: 'March 2024',
      status: 'Paid',
      amount: 4800,
      dueDate: '2024-03-31',
      hoursWorked: 160,
      bonus: 0
    }
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      initials: 'JS',
      role: 'Project Manager',
      salary: 7500,
      payPeriod: 'Monthly',
      department: 'Management',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Sarah Brown',
      email: 'sarah.brown@example.com',
      initials: 'SB',
      role: 'Designer',
      salary: 5000,
      payPeriod: 'Monthly',
      department: 'Design',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Michael Lee',
      email: 'michael.lee@example.com',
      initials: 'ML',
      role: 'Developer',
      salary: 6500,
      payPeriod: 'Monthly',
      department: 'Engineering',
      status: 'Active'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      initials: 'ED',
      role: 'Marketing Specialist',
      salary: 4800,
      payPeriod: 'Monthly',
      department: 'Marketing',
      status: 'Active'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');

  const [newPayrollEntry, setNewPayrollEntry] = useState({
    employeeId: '',
    month: '',
    hoursWorked: '',
    overtimeHours: '',
    bonus: ''
  });

  // Calculate statistics
  const totalPayroll = payrollEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const unpaidAmount = payrollEntries
    .filter(entry => entry.status === 'Unpaid')
    .reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const activeEmployees = teamMembers.filter(member => member.status === 'Active').length;
  const processingCount = payrollEntries.filter(entry => entry.status === 'Processing').length;

  const filteredEntries = payrollEntries.filter(entry => {
    const matchesSearch = entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
    const matchesMonth = monthFilter === 'All' || entry.month.includes(monthFilter);
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const handleCreatePayrollEntry = () => {
    if (!newPayrollEntry.employeeId || !newPayrollEntry.month || !newPayrollEntry.hoursWorked) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const employee = teamMembers.find(member => member.id === newPayrollEntry.employeeId);
    if (!employee) return;

    const hoursWorked = parseInt(newPayrollEntry.hoursWorked);
    const overtimeHours = parseInt(newPayrollEntry.overtimeHours) || 0;
    const bonus = parseFloat(newPayrollEntry.bonus) || 0;
    
    // Calculate base salary based on hours worked
    const hourlyRate = (employee.salary || 0) / 160; // Assuming 160 hours per month
    const basePay = hourlyRate * hoursWorked;
    const overtimePay = hourlyRate * 1.5 * overtimeHours; // 1.5x for overtime
    const totalAmount = basePay + overtimePay + bonus;

    const entry: PayrollEntry = {
      id: Date.now().toString(),
      employeeId: newPayrollEntry.employeeId,
      employeeName: employee.name,
      month: newPayrollEntry.month,
      status: 'Processing',
      amount: Math.round(totalAmount),
      hoursWorked: hoursWorked,
      overtimeHours: overtimeHours,
      bonus: bonus,
      dueDate: new Date().toISOString().split('T')[0]
    };
    
    setPayrollEntries([...payrollEntries, entry]);
    setNewPayrollEntry({ employeeId: '', month: '', hoursWorked: '', overtimeHours: '', bonus: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Payroll entry created successfully",
    });
  };

  const handleStatusChange = (entryId: string, newStatus: PayrollEntry['status']) => {
    setPayrollEntries(payrollEntries.map(entry => 
      entry.id === entryId ? { ...entry, status: newStatus } : entry
    ));
    
    toast({
      title: "Updated",
      description: "Payroll status updated successfully",
    });
  };

  const getStatusColor = (status: PayrollEntry['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Unpaid':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader 
        title="Payroll" 
        buttonText="New Entry"
        onButtonClick={() => setIsDialogOpen(true)}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Payroll</h3>
              <p className="text-2xl font-bold text-green-600">${totalPayroll.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Payments</h3>
              <p className="text-2xl font-bold text-red-600">${unpaidAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Employees</h3>
              <p className="text-2xl font-bold text-blue-600">{activeEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processing</h3>
              <p className="text-2xl font-bold text-yellow-600">{processingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search employees..."
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
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
            </SelectContent>
          </Select>

          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Months</SelectItem>
              <SelectItem value="March">March 2024</SelectItem>
              <SelectItem value="February">February 2024</SelectItem>
              <SelectItem value="January">January 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Employee</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Month</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Hours</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Overtime</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Bonus</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                    {entry.employeeName}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {entry.month}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {entry.hoursWorked || 0}h
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {entry.overtimeHours || 0}h
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    ${entry.bonus || 0}
                  </td>
                  <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                    ${entry.amount?.toLocaleString() || 0}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Select 
                      value={entry.status} 
                      onValueChange={(value: PayrollEntry['status']) => handleStatusChange(entry.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Payroll Entry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Payroll Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee">Employee *</Label>
              <Select 
                value={newPayrollEntry.employeeId} 
                onValueChange={(value) => setNewPayrollEntry({ ...newPayrollEntry, employeeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="month">Month *</Label>
              <Input
                id="month"
                value={newPayrollEntry.month}
                onChange={(e) => setNewPayrollEntry({ ...newPayrollEntry, month: e.target.value })}
                placeholder="e.g., March 2024"
              />
            </div>

            <div>
              <Label htmlFor="hoursWorked">Hours Worked *</Label>
              <Input
                id="hoursWorked"
                type="number"
                value={newPayrollEntry.hoursWorked}
                onChange={(e) => setNewPayrollEntry({ ...newPayrollEntry, hoursWorked: e.target.value })}
                placeholder="160"
              />
            </div>

            <div>
              <Label htmlFor="overtimeHours">Overtime Hours</Label>
              <Input
                id="overtimeHours"
                type="number"
                value={newPayrollEntry.overtimeHours}
                onChange={(e) => setNewPayrollEntry({ ...newPayrollEntry, overtimeHours: e.target.value })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="bonus">Bonus ($)</Label>
              <Input
                id="bonus"
                type="number"
                step="0.01"
                value={newPayrollEntry.bonus}
                onChange={(e) => setNewPayrollEntry({ ...newPayrollEntry, bonus: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePayrollEntry}>
                Create Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payroll;
