
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Play, Pause, Square, Clock, Plus } from 'lucide-react';
import { Task, Project } from '../types';

interface TimeEntry {
  id: string;
  taskId: string;
  taskName: string;
  projectId?: string;
  projectName?: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  description?: string;
  date: string;
}

interface TimeTrackerProps {
  tasks: Task[];
  projects: Project[];
  onTimeEntryAdd: (entry: TimeEntry) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ tasks, projects, onTimeEntryAdd }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [manualEntry, setManualEntry] = useState({
    taskId: '',
    hours: 0,
    minutes: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (!selectedTaskId) return;

    if (isTracking) {
      // Stop tracking
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime!.getTime()) / 1000 / 60); // in minutes
      
      const selectedTask = tasks.find(t => t.id === selectedTaskId);
      const project = projects.find(p => p.id === selectedTask?.projectId);
      
      const entry: TimeEntry = {
        id: Date.now().toString(),
        taskId: selectedTaskId,
        taskName: selectedTask?.name || '',
        projectId: selectedTask?.projectId,
        projectName: project?.name,
        startTime: startTime!.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        date: new Date().toISOString().split('T')[0]
      };
      
      setTimeEntries(prev => [...prev, entry]);
      onTimeEntryAdd(entry);
      
      setIsTracking(false);
      setStartTime(null);
      setElapsedTime(0);
    } else {
      // Start tracking
      setIsTracking(true);
      setStartTime(new Date());
      setElapsedTime(0);
    }
  };

  const handleAddManualEntry = () => {
    if (!manualEntry.taskId || (manualEntry.hours === 0 && manualEntry.minutes === 0)) return;

    const selectedTask = tasks.find(t => t.id === manualEntry.taskId);
    const project = projects.find(p => p.id === selectedTask?.projectId);
    
    const entry: TimeEntry = {
      id: Date.now().toString(),
      taskId: manualEntry.taskId,
      taskName: selectedTask?.name || '',
      projectId: selectedTask?.projectId,
      projectName: project?.name,
      startTime: new Date().toISOString(),
      duration: manualEntry.hours * 60 + manualEntry.minutes,
      description: manualEntry.description,
      date: manualEntry.date
    };
    
    setTimeEntries(prev => [...prev, entry]);
    onTimeEntryAdd(entry);
    
    setManualEntry({
      taskId: '',
      hours: 0,
      minutes: 0,
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(false);
  };

  const getTodayEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    return timeEntries.filter(entry => entry.date === today);
  };

  const getTotalTimeToday = () => {
    const todayEntries = getTodayEntries();
    const totalMinutes = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return totalMinutes;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Time Tracker</span>
        </CardTitle>
        <CardDescription>
          Track time spent on tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
            {formatTime(elapsedTime)}
          </div>
          {isTracking && selectedTaskId && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Tracking: {tasks.find(t => t.id === selectedTaskId)?.name}
            </div>
          )}
        </div>

        {/* Task Selection */}
        <div className="space-y-2">
          <Label>Select Task</Label>
          <Select 
            value={selectedTaskId} 
            onValueChange={setSelectedTaskId}
            disabled={isTracking}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a task to track" />
            </SelectTrigger>
            <SelectContent>
              {tasks.map(task => (
                <SelectItem key={task.id} value={task.id}>
                  {task.name}
                  {task.projectId && (
                    <span className="text-gray-500 ml-2">
                      - {projects.find(p => p.id === task.projectId)?.name}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-2">
          <Button 
            onClick={handleStartStop}
            disabled={!selectedTaskId}
            className="flex-1"
            variant={isTracking ? "destructive" : "default"}
          >
            {isTracking ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Manual Entry
          </Button>
        </div>

        {/* Today's Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Today's Total</span>
            <Badge variant="secondary">
              {Math.floor(getTotalTimeToday() / 60)}h {getTotalTimeToday() % 60}m
            </Badge>
          </div>
          
          {getTodayEntries().length > 0 && (
            <div className="space-y-2">
              {getTodayEntries().slice(-3).map(entry => (
                <div key={entry.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {entry.taskName}
                  </span>
                  <span className="font-medium">
                    {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Manual Entry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Manual Time Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Task</Label>
              <Select 
                value={manualEntry.taskId} 
                onValueChange={(value) => setManualEntry({...manualEntry, taskId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hours</Label>
                <Input
                  type="number"
                  min="0"
                  value={manualEntry.hours}
                  onChange={(e) => setManualEntry({...manualEntry, hours: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Minutes</Label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={manualEntry.minutes}
                  onChange={(e) => setManualEntry({...manualEntry, minutes: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={manualEntry.date}
                onChange={(e) => setManualEntry({...manualEntry, date: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Description (Optional)</Label>
              <Input
                value={manualEntry.description}
                onChange={(e) => setManualEntry({...manualEntry, description: e.target.value})}
                placeholder="What did you work on?"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddManualEntry}>
                Add Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TimeTracker;
