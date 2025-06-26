
import React, { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Project, ProjectTemplate } from '../types';
import { Search, Filter, Calendar, DollarSign, Clock, User, Tag, Grid, List, Plus, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Projects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      status: 'In Progress',
      dueDate: '2024-06-30',
      progress: 75,
      priority: 'High',
      description: 'Complete redesign of company website with modern UI/UX',
      budget: 15000,
      estimatedHours: 120,
      actualHours: 90,
      clientName: 'Tech Corp',
      tags: ['web', 'design', 'frontend'],
      createdDate: '2024-03-01',
      managerId: '1'
    },
    {
      id: '2',
      name: 'Marketing Campaign',
      status: 'Not Started',
      dueDate: '2024-07-15',
      progress: 0,
      priority: 'Medium',
      description: 'Q3 marketing campaign for product launch',
      budget: 8000,
      estimatedHours: 80,
      clientName: 'StartupXYZ',
      tags: ['marketing', 'campaign'],
      createdDate: '2024-03-05',
      managerId: '2'
    },
    {
      id: '3',
      name: 'Mobile App Development',
      status: 'In Progress',
      dueDate: '2024-05-20',
      progress: 60,
      priority: 'High',
      description: 'Native mobile app for iOS and Android',
      budget: 25000,
      estimatedHours: 200,
      actualHours: 120,
      clientName: 'Mobile Solutions Inc',
      tags: ['mobile', 'app', 'development'],
      createdDate: '2024-02-15',
      managerId: '3'
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [newProject, setNewProject] = useState({
    name: '',
    status: 'Not Started' as Project['status'],
    dueDate: '',
    progress: 0,
    priority: 'Medium' as Project['priority'],
    description: '',
    budget: 0,
    estimatedHours: 0,
    clientName: '',
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState('');

  const templates: ProjectTemplate[] = [
    {
      id: '1',
      name: 'Website Development',
      description: 'Standard website development workflow',
      category: 'Development',
      estimatedDuration: 60,
      tasks: [
        { name: 'Requirements Gathering', assignee: '', dueDate: '', status: 'Not Started', priority: 'High', description: 'Collect project requirements' },
        { name: 'Design Mockups', assignee: '', dueDate: '', status: 'Not Started', priority: 'High', description: 'Create visual designs' },
        { name: 'Frontend Development', assignee: '', dueDate: '', status: 'Not Started', priority: 'Medium', description: 'Build user interface' },
        { name: 'Backend Development', assignee: '', dueDate: '', status: 'Not Started', priority: 'Medium', description: 'Develop server-side logic' },
        { name: 'Testing & QA', assignee: '', dueDate: '', status: 'Not Started', priority: 'High', description: 'Test and fix issues' }
      ]
    },
    {
      id: '2',
      name: 'Marketing Campaign',
      description: 'Complete marketing campaign setup',
      category: 'Marketing',
      estimatedDuration: 30,
      tasks: [
        { name: 'Market Research', assignee: '', dueDate: '', status: 'Not Started', priority: 'High', description: 'Research target market' },
        { name: 'Content Creation', assignee: '', dueDate: '', status: 'Not Started', priority: 'Medium', description: 'Create marketing content' },
        { name: 'Campaign Launch', assignee: '', dueDate: '', status: 'Not Started', priority: 'High', description: 'Execute campaign' },
        { name: 'Performance Analysis', assignee: '', dueDate: '', status: 'Not Started', priority: 'Medium', description: 'Analyze results' }
      ]
    }
  ];

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(project => {
      project.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             project.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || project.priority === priorityFilter;
        const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => project.tags?.includes(tag));
        
        return matchesSearch && matchesStatus && matchesPriority && matchesTags;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'dueDate':
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          case 'priority':
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return (priorityOrder[b.priority || 'Medium'] || 0) - (priorityOrder[a.priority || 'Medium'] || 0);
          case 'progress':
            return b.progress - a.progress;
          default:
            return 0;
        }
      });
  }, [projects, searchTerm, statusFilter, priorityFilter, selectedTags, sortBy]);

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      ...newProject,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    
    setProjects([...projects, project]);
    setNewProject({ 
      name: '', 
      status: 'Not Started', 
      dueDate: '', 
      progress: 0, 
      priority: 'Medium',
      description: '',
      budget: 0,
      estimatedHours: 0,
      clientName: '',
      tags: []
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Project created successfully",
    });
  };

  const addTag = () => {
    if (newTag && !newProject.tags.includes(newTag)) {
      setNewProject({
        ...newProject,
        tags: [...newProject.tags, newTag]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewProject({
      ...newProject,
      tags: newProject.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getStatusColor = (status: Project['status']) => {
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

  const getPriorityColor = (priority: Project['priority']) => {
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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader 
        title="Projects" 
        buttonText="New Project"
        onButtonClick={() => setIsDialogOpen(true)}
      />

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects, clients, or descriptions..."
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge 
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedTags(prev => 
                  prev.includes(tag) 
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                )}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Projects Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className={`hover:shadow-lg transition-shadow ${isOverdue(project.dueDate) && project.status !== 'Completed' ? 'border-red-200 dark:border-red-800' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    {project.clientName && (
                      <CardDescription className="mt-1">
                        <User className="w-3 h-3 inline mr-1" />
                        {project.clientName}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    {project.priority && (
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(project.dueDate).toLocaleDateString()}
                      {isOverdue(project.dueDate) && project.status !== 'Completed' && (
                        <span className="text-red-500 ml-2 text-xs">Overdue</span>
                      )}
                    </div>
                    {project.budget && (
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${project.budget.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  {project.estimatedHours && (
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {project.actualHours || 0} / {project.estimatedHours}h
                      </div>
                    </div>
                  )}
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Project</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Client</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Priority</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Due Date</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Progress</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">Budget</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-gray-900 dark:text-white font-medium">{project.name}</div>
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {project.clientName || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      {project.priority && (
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        {new Date(project.dueDate).toLocaleDateString()}
                        {isOverdue(project.dueDate) && project.status !== 'Completed' && (
                          <span className="text-red-500 ml-2 text-xs">Overdue</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3rem]">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {project.budget ? `$${project.budget.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="template">Use Template</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    placeholder="Enter client name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="projectStatus">Status</Label>
                  <Select 
                    value={newProject.status} 
                    onValueChange={(value: Project['status']) => setNewProject({ ...newProject, status: value })}
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
                
                <div>
                  <Label htmlFor="projectPriority">Priority</Label>
                  <Select 
                    value={newProject.priority} 
                    onValueChange={(value: Project['priority']) => setNewProject({ ...newProject, priority: value })}
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
                  <Label htmlFor="projectDueDate">Due Date *</Label>
                  <Input
                    id="projectDueDate"
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="projectBudget">Budget ($)</Label>
                  <Input
                    id="projectBudget"
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: parseInt(e.target.value) || 0 })}
                    placeholder="Enter budget"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="projectDescription">Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={newProject.estimatedHours}
                    onChange={(e) => setNewProject({ ...newProject, estimatedHours: parseInt(e.target.value) || 0 })}
                    placeholder="Enter estimated hours"
                  />
                </div>
                
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {newProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newProject.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
                  Create Project
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="template" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(template => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div>Category: {template.category}</div>
                        <div>Estimated Duration: {template.estimatedDuration} days</div>
                        <div>Tasks: {template.tasks.length}</div>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => {
                          setNewProject({
                            ...newProject,
                            name: template.name,
                            estimatedHours: template.estimatedDuration * 8,
                            description: template.description
                          });
                        }}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
