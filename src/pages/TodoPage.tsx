import { useState } from 'react';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, ListFilter, ArrowDown, Plus as PlusIcon } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/kanban';
import type { DragEndEvent } from '@dnd-kit/core';
import { format, compareAsc, compareDesc } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useId } from 'react';
import NewTaskDialog from '@/components/NewTaskDialog';

const todoStatuses = [
  { id: "1", name: "Backlog", color: "#6B7280" },
  { id: "2", name: "To Do", color: "#F59E0B" },
  { id: "3", name: "In Progress", color: "#3B82F6" },
  { id: "4", name: "Done", color: "#10B981" },
];

const initialTasks = [
  {
    id: "1",
    name: "Design System Implementation",
    startAt: new Date(),
    endAt: new Date(),
    description: "Implement a comprehensive design system including components, tokens, and documentation.",
    status: todoStatuses[0],
    assignee: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=1",
    },
    priority: "high",
  },
  {
    id: "2",
    name: "User Authentication Flow",
    startAt: new Date(),
    endAt: new Date(),
    description: "Create a secure authentication system with login, registration, and password recovery.",
    status: todoStatuses[1],
    assignee: {
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=2",
    },
    priority: "medium",
  },
  {
    id: "3",
    name: "API Integration",
    startAt: new Date(),
    endAt: new Date(),
    description: "Integrate third-party APIs and implement data synchronization features.",
    status: todoStatuses[2],
    assignee: {
      name: "Emily Wong",
      avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=3",
    },
    priority: "high",
  },
  {
    id: "4",
    name: "Database Schema Design",
    startAt: new Date(),
    endAt: new Date(),
    description: "Design and implement the database schema for the application's core features.",
    status: todoStatuses[3],
    assignee: {
      name: "David Lee",
      avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=4",
    },
    priority: "low",
  },
];

const priorityColors = {
  high: 'bg-red-500/10 text-red-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  low: 'bg-green-500/10 text-green-500',
};

export default function TodoPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [sectionSorting, setSectionSorting] = useState<Record<string, 'priority' | 'date'>>({
    Backlog: 'priority',
    'To Do': 'priority',
    'In Progress': 'priority',
    Done: 'priority'
  });
  const id = useId();

  const handleSort = (sectionName: string) => {
    // Toggle between priority and date sorting
    setSectionSorting(current => ({
      ...current,
      [sectionName]: current[sectionName] === 'priority' ? 'date' : 'priority'
    }));
  };

  const getSortedTasks = (statusName: string) => {
    const statusTasks = tasks.filter(task => task.status.name === statusName);
    const currentSortingState = sectionSorting[statusName];
    
    if (!currentSortingState) return statusTasks;
    
    return [...statusTasks].sort((a, b) => {
      if (currentSortingState === 'priority') {
        // Sort by priority (High to Low)
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - 
               priorityOrder[a.priority as keyof typeof priorityOrder];
      } else {
        // Sort by due date (Earliest to Latest)
        return compareAsc(a.endAt, b.endAt);
      }
    });
  };

  const handleAddTask = (newTask: any) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const status = todoStatuses.find((status) => status.name === over.id);
    if (!status) return;

    setTasks(
      tasks.map((task) => {
        if (task.id === active.id) {
          return { ...task, status };
        }
        return task;
      })
    );
  };

  return (
    <div className="flex flex-col flex-1 p-2 sm:p-4 rounded-none md:rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">To-Do-List Board</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Filters">
                <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-36 p-3">
              <div className="space-y-3">
                <div className="text-xs font-medium text-muted-foreground">Filters</div>
                <form className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id={`${id}-1`} />
                    <Label htmlFor={`${id}-1`} className="font-normal">
                      High Priority
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id={`${id}-2`} />
                    <Label htmlFor={`${id}-2`} className="font-normal">
                      Medium Priority
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id={`${id}-3`} />
                    <Label htmlFor={`${id}-3`} className="font-normal">
                      Low Priority
                    </Label>
                  </div>
                  <div
                    role="separator"
                    aria-orientation="horizontal"
                    className="-mx-3 my-1 h-px bg-border"
                  ></div>
                  <div className="flex justify-between gap-2">
                    <Button size="sm" variant="outline" className="h-7 px-2">
                      Clear
                    </Button>
                    <Button size="sm" className="h-7 px-2">
                      Apply
                    </Button>
                  </div>
                </form>
              </div>
            </PopoverContent>
          </Popover>
          <Button 
            variant="outline" 
            size="icon" 
            aria-label="Add new task"
            onClick={() => setNewTaskDialogOpen(true)}
          >
            <PlusIcon size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <KanbanProvider onDragEnd={handleDragEnd}>
          {todoStatuses.map((status) => (
            <KanbanBoard key={status.name} id={status.name} className="min-h-[600px]">
              <KanbanHeader name={status.name} color={status.color}>
                <div className="flex items-center justify-between w-full">
                  <div className="relative flex items-center w-full">
                    <span className="absolute inset-0 flex items-center justify-center font-medium text-center">{status.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 relative z-10 ml-auto transition-colors text-primary"
                            onClick={() => handleSort(status.name)}
                          >
                            {sectionSorting[status.name] === 'priority' ? (
                              <ArrowDownWideNarrow className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="end" className="text-xs">
                          <p className="font-medium">
                            {sectionSorting[status.name] === 'priority' ? 'Sorted by Priority' : 'Sorted by Due Date'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </KanbanHeader>
              <KanbanCards>
                {getSortedTasks(status.name)
                  .map((task, index) => (
                    <KanbanCard
                      key={task.id}
                      id={task.id}
                      name={task.name}
                      parent={status.name}
                      index={index}
                      className="p-2"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between group/card">
                          <div className="flex flex-col gap-1">
                            <p className="m-0 pl-1 font-medium text-left min-h-[2rem] leading-tight line-clamp-2 text-[clamp(0.84rem,0.84vw,1.05rem)] group-hover/card:text-[clamp(0.95rem,0.95vw,1.2rem)] transition-all duration-200">
                              {task.name}
                            </p>
                          </div>
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback>
                              {task.assignee.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-center px-1 py-1">
                                <p className="text-[0.65rem] text-muted-foreground truncate text-left w-full">
                                  {task.description}
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" align="start">
                              <p className="text-sm">{task.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="flex justify-center w-full mt-1 group-hover/card:mt-2">
                          <div className={`w-full text-center py-1 rounded text-[clamp(0.625rem,0.6vw,0.75rem)] ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[clamp(0.625rem,0.6vw,0.75rem)] text-muted-foreground text-left group-hover/card:text-[clamp(0.75rem,0.75vw,0.9rem)]">
                          <span>Due {format(task.endAt, 'MMM d')}</span>
                          <span id={`assignee-${task.id}`}>{task.assignee.name}</span>
                        </div>
                      </div>
                    </KanbanCard>
                  ))}
              </KanbanCards>
            </KanbanBoard>
          ))}
        </KanbanProvider>
      </div>
      <NewTaskDialog
        open={newTaskDialogOpen}
        onOpenChange={setNewTaskDialogOpen}
        onTaskAdded={handleAddTask}
        statuses={todoStatuses}
      />
    </div>
  );
}