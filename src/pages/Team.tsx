
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { TeamMember } from '../types';
import { Badge } from '../components/ui/badge';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      initials: 'JS',
      role: 'Project Manager',
      salary: 7500,
      payPeriod: 'Biweekly',
      projects: ['E-commerce Platform', 'Mobile App Redesign']
    },
    {
      id: '2',
      name: 'Sarah Brown',
      email: 'sarah.brown@example.com',
      initials: 'SB',
      role: 'Designer',
      salary: 5000,
      payPeriod: 'Biweekly',
      projects: ['Brand Identity System', 'Mobile App Redesign']
    },
    {
      id: '3',
      name: 'Michael Lee',
      email: 'michael.lee@example.com',
      initials: 'ML',
      role: 'Developer',
      salary: 6500,
      payPeriod: 'Biweekly',
      projects: ['E-commerce Platform', 'API Integration']
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      initials: 'ED',
      role: 'Marketing Specialist',
      salary: 4800,
      payPeriod: 'Biweekly',
      projects: ['Brand Identity System']
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    salary: '',
    payPeriod: 'Biweekly'
  });

  const handleCreateMember = () => {
    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      initials: newMember.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      role: newMember.role,
      salary: newMember.salary ? parseInt(newMember.salary) : undefined,
      payPeriod: newMember.payPeriod,
      projects: []
    };
    
    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', email: '', role: '', salary: '', payPeriod: 'Biweekly' });
    setIsDialogOpen(false);
  };

  const getInitialsColor = (initials: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader 
        title="Team" 
        buttonText="Add Member"
        onButtonClick={() => setIsDialogOpen(true)}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Name</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Email</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Role</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Projects</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Salary</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${getInitialsColor(member.initials)} flex items-center justify-center text-white font-medium`}>
                        {member.initials}
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {member.email}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {member.role}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2">
                      {member.projects && member.projects.length > 0 ? (
                        member.projects.map((project, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {project}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No projects</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                    {member.salary ? `$${member.salary.toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="memberName">Full Name</Label>
              <Input
                id="memberName"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="memberEmail">Email</Label>
              <Input
                id="memberEmail"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="memberRole">Role</Label>
              <Input
                id="memberRole"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                placeholder="Enter role/position"
              />
            </div>
            <div>
              <Label htmlFor="memberSalary">Salary</Label>
              <Input
                id="memberSalary"
                type="number"
                value={newMember.salary}
                onChange={(e) => setNewMember({ ...newMember, salary: e.target.value })}
                placeholder="Enter salary amount"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMember}>
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
