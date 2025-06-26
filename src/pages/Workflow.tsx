
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Workflow, WorkflowStep } from '../types';
import { ChevronDown, ChevronRight, Plus, Play, Pause, CheckCircle } from 'lucide-react';

const WorkflowPage = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Website Development Workflow',
      description: 'Complete workflow for developing a new website',
      status: 'active',
      createdDate: '2024-03-01',
      steps: [
        {
          id: '1',
          name: 'Requirements Gathering',
          description: 'Collect and document project requirements',
          assigneeId: '1',
          status: 'completed',
          dueDate: '2024-03-15'
        },
        {
          id: '2',
          name: 'Design Mockups',
          description: 'Create visual designs and wireframes',
          assigneeId: '2',
          status: 'in-progress',
          dueDate: '2024-03-25'
        },
        {
          id: '3',
          name: 'Development',
          description: 'Build the website based on approved designs',
          assigneeId: '3',
          status: 'pending',
          dueDate: '2024-04-10',
          dependencies: ['2']
        },
        {
          id: '4',
          name: 'Testing & QA',
          description: 'Test functionality and fix any issues',
          assigneeId: '1',
          status: 'pending',
          dueDate: '2024-04-20',
          dependencies: ['3']
        }
      ]
    },
    {
      id: '2',
      name: 'Marketing Campaign Launch',
      description: 'End-to-end marketing campaign workflow',
      status: 'active',
      createdDate: '2024-03-05',
      steps: [
        {
          id: '5',
          name: 'Campaign Strategy',
          description: 'Define campaign goals and target audience',
          assigneeId: '4',
          status: 'completed',
          dueDate: '2024-03-10'
        },
        {
          id: '6',
          name: 'Content Creation',
          description: 'Create marketing materials and content',
          assigneeId: '2',
          status: 'in-progress',
          dueDate: '2024-03-20'
        },
        {
          id: '7',
          name: 'Campaign Launch',
          description: 'Execute the marketing campaign',
          assigneeId: '4',
          status: 'pending',
          dueDate: '2024-03-30',
          dependencies: ['6']
        }
      ]
    }
  ]);

  const [expandedWorkflows, setExpandedWorkflows] = useState<Set<string>>(new Set(['1']));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    steps: [] as Omit<WorkflowStep, 'id'>[]
  });

  const teamMembers = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Brown' },
    { id: '3', name: 'Michael Lee' },
    { id: '4', name: 'Emily Davis' }
  ];

  const toggleWorkflow = (workflowId: string) => {
    const newExpanded = new Set(expandedWorkflows);
    if (newExpanded.has(workflowId)) {
      newExpanded.delete(workflowId);
    } else {
      newExpanded.add(workflowId);
    }
    setExpandedWorkflows(newExpanded);
  };

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Pause className="w-4 h-4 text-gray-400" />;
      default:
        return <Pause className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleCreateWorkflow = () => {
    const workflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      steps: newWorkflow.steps.map((step, index) => ({
        ...step,
        id: `${Date.now()}-${index}`
      }))
    };
    
    setWorkflows([...workflows, workflow]);
    setNewWorkflow({ name: '', description: '', steps: [] });
    setIsDialogOpen(false);
  };

  const addStep = () => {
    setNewWorkflow({
      ...newWorkflow,
      steps: [...newWorkflow.steps, {
        name: '',
        description: '',
        assigneeId: '',
        status: 'pending',
        dueDate: ''
      }]
    });
  };

  const updateStep = (index: number, field: keyof Omit<WorkflowStep, 'id'>, value: any) => {
    const updatedSteps = [...newWorkflow.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setNewWorkflow({ ...newWorkflow, steps: updatedSteps });
  };

  const removeStep = (index: number) => {
    const updatedSteps = newWorkflow.steps.filter((_, i) => i !== index);
    setNewWorkflow({ ...newWorkflow, steps: updatedSteps });
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader 
        title="Workflow" 
        buttonText="New Workflow"
        onButtonClick={() => setIsDialogOpen(true)}
      />

      <div className="space-y-6">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => toggleWorkflow(workflow.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {expandedWorkflows.has(workflow.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {workflow.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {workflow.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    workflow.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : workflow.status === 'completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {workflow.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {workflow.steps.length} steps
                  </span>
                </div>
              </div>
            </div>

            {expandedWorkflows.has(workflow.id) && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="space-y-4">
                  {workflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {step.name}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(step.status)}`}>
                            {step.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {step.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            Assignee: {teamMembers.find(m => m.id === step.assigneeId)?.name}
                          </span>
                          <span>Due: {step.dueDate}</span>
                          {step.dependencies && step.dependencies.length > 0 && (
                            <span>Dependencies: {step.dependencies.length}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="workflowName">Workflow Name</Label>
              <Input
                id="workflowName"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <Label htmlFor="workflowDescription">Description</Label>
              <Textarea
                id="workflowDescription"
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                placeholder="Enter workflow description"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Workflow Steps</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addStep}
                  className="flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Step</span>
                </Button>
              </div>
              
              <div className="space-y-4">
                {newWorkflow.steps.map((step, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Step {index + 1}</h4>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeStep(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Step Name</Label>
                        <Input
                          value={step.name}
                          onChange={(e) => updateStep(index, 'name', e.target.value)}
                          placeholder="Enter step name"
                        />
                      </div>
                      <div>
                        <Label>Assignee</Label>
                        <Select 
                          value={step.assigneeId} 
                          onValueChange={(value) => updateStep(index, 'assigneeId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => updateStep(index, 'description', e.target.value)}
                          placeholder="Enter step description"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={step.dueDate}
                          onChange={(e) => updateStep(index, 'dueDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkflow}>
                Create Workflow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowPage;
