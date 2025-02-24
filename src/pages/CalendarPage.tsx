import { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays, isSameMonth, isSameDay, isAfter, isBefore, subMonths, addMonths } from 'date-fns';
import { Card, CardContent } from '../components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ListIcon,
  PlusIcon,
  Clock, 
  Users, 
  MapPin
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useCalendarCache } from '../hooks/use-calendar-cache';
import { CalendarSkeleton } from '../components/calendar-skeleton';
import EditProjectDialog from '../components/EditProjectDialog';
import NewProjectDialog from '../components/NewProjectDialog';
import type { Project } from '@/lib/types';

const eventColors = {
  'roving': 'bg-red-200 text-red-800',
  'roadshow': 'bg-blue-200 text-blue-800',
  'in-store': 'bg-purple-200 text-purple-800',
  'ad-hoc': 'bg-yellow-200 text-yellow-800',
  'corporate': 'bg-green-200 text-green-800',
  'wedding': 'bg-pink-200 text-pink-800',
  'concert': 'bg-indigo-200 text-indigo-800',
  'conference': 'bg-orange-200 text-orange-800',
  'other': 'bg-gray-200 text-gray-800',
} as const;

const formatTimeString = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return format(date, 'h:mm a');
};

const projectsOverlap = (a: Project, b: Project) => {
  const aStart = new Date(a.start_date);
  const aEnd = a.end_date ? new Date(a.end_date) : aStart;
  const bStart = new Date(b.start_date);
  const bEnd = b.end_date ? new Date(b.end_date) : bStart;

  return aStart <= bEnd && aEnd >= bStart;
};



const groupOverlappingProjects = (projects: Project[]) => {
  const groups: Project[][] = [];
  
  projects.forEach(project => {
    let added = false;
    for (const group of groups) {
      if (!group.some(p => projectsOverlap(p, project))) {
        group.push(project);
        added = true;
        break;
      }
    }
    if (!added) {
      groups.push([project]);
    }
  });
  
  return groups;
};

const ProjectTooltip = ({ project }: { project: Project }) => (
  <div className="space-y-2 p-2 max-w-xs">
    <div className="font-medium">{project.title}</div>
    {project.client?.full_name && (
      <div className="text-sm text-muted-foreground">
        {project.client.full_name}
      </div>
    )}
    <div className="grid gap-2 text-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>
          {formatTimeString(project.working_hours_start)} - {formatTimeString(project.working_hours_end)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span>{project.filled_positions}/{project.crew_count} crew members</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span className="line-clamp-2">{project.venue_address}</span>
      </div>
    </div>
  </div>
);

const CalendarView = ({
  date,
  projects,
  onProjectClick,
  onDateRangeSelect,
}: {
  date: Date;
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onDateRangeSelect: (startDate: Date, endDate: Date) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDate, setDragStartDate] = useState<Date | null>(null);
  const [dragEndDate, setDragEndDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const monthStart= startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - (monthStart.getDay() - 1 + 7) % 7);
  const calendarEnd = new Date(monthEnd);
  const daysToAdd = (7 - calendarEnd.getDay()) % 7;
  calendarEnd.setDate(calendarEnd.getDate() + daysToAdd);
  const daysInMonth = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const handleMouseDown = (day: Date) => {
    setIsDragging(true);
    setDragStartDate(day);
    setDragEndDate(day);
    setSelectedDates([day]);
  };

  const handleMouseMove = (day: Date) => {
    if (isDragging && dragStartDate) {
      setDragEndDate(day);
      
      const start = dragStartDate < day ? dragStartDate : day;
      const end = dragStartDate < day ? day : dragStartDate;
      
      const datesInRange = eachDayOfInterval({ start, end });
      setSelectedDates(datesInRange);
    }
  };

  const handleMouseUp = useCallback(() => {
    if (isDragging && dragStartDate && dragEndDate) {
      const start = dragStartDate < dragEndDate ? dragStartDate : dragEndDate;
      const end = dragStartDate < dragEndDate ? dragEndDate : dragStartDate;
      onDateRangeSelect(start, end);
    }
    setIsDragging(false);
    setDragStartDate(null);
    setDragEndDate(null);
    setSelectedDates([]);
  }, [isDragging, dragStartDate, dragEndDate, onDateRangeSelect]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStartDate, dragEndDate, handleMouseUp]);

  const isDateSelected = (day: Date) => {
    return selectedDates.some(selectedDate => 
      isSameDay(selectedDate, day)
    );
  };

  const today = new Date();
  const weeks = Math.ceil(daysInMonth.length / 7);

  return (
    <Card className="absolute inset-0 rounded-xl border bg-card text-card-foreground shadow overflow-auto touch-pan-y">
      <CardContent className="p-1 sm:p-2">
        <div className="grid grid-cols-7 gap-px sm:gap-1 md:gap-2 min-h-full">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div 
              key={day} 
              className="h-8 sm:h-10 flex items-center justify-center sticky top-0 bg-card z-10 first:rounded-tl-lg last:rounded-tr-lg text-center"
              role="columnheader"
            >
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {window.innerWidth < 640 ? day.slice(0, 1) : day}
              </span>
            </div>
          ))}

          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="col-span-7 relative">
              <div className="grid grid-cols-7 gap-px sm:gap-1 md:gap-2">
                {daysInMonth.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day) => {
                  const isToday = day.getDate() === today.getDate() && 
                                day.getMonth() === today.getMonth() && 
                                day.getFullYear() === today.getFullYear();
                  const isCurrentMonth = isSameMonth(day, date);
                  const isHighlighted = isDateSelected(day);
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`relative border p-1 sm:p-2 rounded-lg cursor-pointer select-none
                        transition-colors duration-200 min-h-[120px] sm:min-h-[140px] md:min-h-[160px]
                        ${!isCurrentMonth ? 'bg-muted/50 text-muted-foreground' : ''}
                        ${isHighlighted ? 'bg-primary/10 border-primary' : 'border-muted'}
                        hover:bg-muted/30 active:bg-muted/50
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                      `}
                      role="gridcell"
                      tabIndex={0}
                      aria-label={format(day, 'EEEE, MMMM d, yyyy')}
                      onMouseDown={() => handleMouseDown(day)}
                      onMouseEnter={() => handleMouseMove(day)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleMouseDown(day);
                          handleMouseUp();
                        }
                      }}
                    >
                      <div className="flex justify-end mb-1">
                        <div className={`
                          relative flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8
                          ${isToday ? 'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-primary' : ''}
                        `}>
                          <span className="text-sm sm:text-base font-medium relative z-10">{day.getDate()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute inset-0 pointer-events-none">
                {(() => {
                  const weekStart = new Date(daysInMonth[weekIndex * 7]);
                  const weekProjects = projects.filter(project => {
                    const startDate = new Date(project.start_date);
                    const endDate = project.end_date ? new Date(project.end_date) : startDate;
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    
                    return startDate <= weekEnd && endDate >= weekStart;
                  });
                  
                  const groups = groupOverlappingProjects(weekProjects);
                  
                  return groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="absolute inset-0">
                      {group.map((project) => {
                        const startDate = new Date(project.start_date);
                        const endDate = project.end_date ? new Date(project.end_date) : startDate;
                        
                        const projectStartDay = Math.max(0, Math.floor((startDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)));
                        const projectEndDay = Math.min(6, Math.floor((endDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)));
                        
                        const left = `${(projectStartDay / 7) * 100}%`;
                        const width = `${((projectEndDay - projectStartDay + 1) / 7) * 100}%`;
                        
                        const heightPerProject = 20;
                        const top = 32 + (groupIndex * heightPerProject);
                        
                        const maxEvents = Math.floor((window.innerWidth < 640 ? 3 : window.innerWidth < 1024 ? 4 : 5));
                        if (groupIndex >= maxEvents) {
                          if (groupIndex === maxEvents) {
                            return (
                              <div
                                key="more"
                                className="absolute left-0 right-0 text-center text-xs text-muted-foreground"
                                style={{ top: `${top + 5}px` }}
                              >
                                +{group.length - maxEvents + 1} more
                              </div>
                            );
                          }
                          return null;
                        }
                        
                        return (
                          <TooltipProvider key={project.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute pointer-events-auto"
                                  style={{
                                    left,
                                    width,
                                    top: `${top}px`,
                                    height: `${heightPerProject - 2}px`,
                                    paddingLeft: '2px',
                                    paddingRight: '2px'
                                  }}
                                >
                                  <div 
                                    className={`
                                      rounded-md border shadow h-full
                                      px-2 py-1 cursor-pointer hover:opacity-80 transition-opacity
                                      flex items-center overflow-hidden touch-none
                                      ${eventColors[project.event_type as keyof typeof eventColors]}
                                    `}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onProjectClick(project);
                                    }}
                                  >
                                    <div className="flex-1 min-w-0 flex items-center gap-1">
                                      <div className="w-2 h-2 rounded-full bg-current opacity-70 flex-shrink-0" />
                                      <div className="text-xs font-medium truncate">
                                        <span className="hidden sm:inline">{project.title}</span>
                                        <span className="sm:hidden">{project.title.slice(0, 12)}{project.title.length > 12 ? '...' : ''}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" align="start">
                                <ProjectTooltip project={project} />
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ListView = ({
  date,
  projects,
  onProjectClick,
}: {
  date: Date;
  projects: Project[];
  onProjectClick: (project: Project) => void;
}) => {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });

  const calculatePosition = (project: Project, column: number = 0) => {
    const startDate = new Date(project.start_date);
    const endDate = project.end_date ? new Date(project.end_date) : startDate;
    const monthStart = startOfMonth(date);
    
    const startDays = Math.max(0, differenceInDays(startDate, monthStart));
    const duration = differenceInDays(endDate, startDate) + 1;
    
    return {
      top: `${startDays * 48 + 10}px`,
      height: `${duration * 48 - 10}px`,
      left: `${column * 160}px`,
    };
  };

  const projectsWithColumns = projects.reduce((acc: { project: Project; column: number }[], project) => {
    let column = 0;
    while (acc.some(p => p.column === column && projectsOverlap(p.project, project))) {
      column++;
    }
    acc.push({ project, column });
    return acc;
  }, []);

  return (
    <Card className="h-full rounded-xl border bg-card text-card-foreground shadow">
      <CardContent className="p-0">
        <div className="grid grid-cols-[100px_1fr] divide-x">
          <div className="sticky left-0 bg-background z-10 flex flex-col">
            {daysInMonth.map((day) => (
              <div 
                key={day.toISOString()}
                className="flex items-center justify-center h-12 border-b last:border-b-0"
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">
                    {day.getDate()}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase">
                    {format(day, 'EEE')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative min-h-full pl-4">
            <div className="absolute inset-0">
              {daysInMonth.map((day) => (
                <div 
                  key={day.toISOString()}
                  className="h-12 border-b last:border-b-0"
                />
              ))}
            </div>

            <div className="relative">
              {projectsWithColumns.map(({ project, column }) => {
                const position = calculatePosition(project, column);
                
                return (
                  <TooltipProvider key={project.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute"
                          style={{
                            ...position,
                            width: '150px'
                          }}
                        >
                          <div 
                            className={`
                              rounded-xl border bg-card text-card-foreground shadow h-full
                              px-3 cursor-pointer hover:opacity-80 transition-opacity
                              ${eventColors[project.event_type as keyof typeof eventColors]}
                              flex flex-col justify-center items-center text-center
                            `}
                            onClick={() => onProjectClick(project)}
                          >
                            <div className="space-y-1">
                              <div className="font-medium text-xs">
                                {project.title}
                              </div>
                              {project.client?.full_name && (
                                <div className="text-[10px] opacity-75">
                                  {project.client.full_name}
                                </div>
                              )}
                              <div className="text-[10px] opacity-75">
                                {formatTimeString(project.working_hours_start)} - {formatTimeString(project.working_hours_end)}
                              </div>
                              <div className="text-[10px] opacity-75">
                                {project.filled_positions}/{project.crew_count} crew
                              </div>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="start">
                        <ProjectTooltip project={project} />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const { getMonthData, invalidateCache, isLoading } = useCalendarCache();
  const { toast } = useToast();

  const loadProjects = useCallback(async () => {
    try {
      const data = await getMonthData(date);
      const typedProjects = data.map(project => ({
        ...project,
        start_date: new Date(project.start_date),
        end_date: project.end_date ? new Date(project.end_date) : null
      }));
      setProjects(typedProjects as unknown as Project[]);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: 'Error loading projects',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  }, [date, getMonthData, toast, setProjects]);

  useEffect(() => {
    void loadProjects();
  }, [date, loadProjects]);

  const handleProjectUpdate = () => {
    invalidateCache(date);
    loadProjects();
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };

  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    setSelectedDateRange({ start: startDate, end: endDate });
    setNewProjectDialogOpen(true);
  };

  const getFilteredProjects = () => {
    if (view === 'calendar') {
      // For calendar view, show all projects that overlap with the current month
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      return projects.filter(project => {
        const projectStart = new Date(project.start_date);
        const projectEnd = project.end_date ? new Date(project.end_date) : projectStart;
        
        return (
          (isAfter(projectStart, monthStart) || isSameDay(projectStart, monthStart)) &&
          (isBefore(projectStart, monthEnd) || isSameDay(projectStart, monthEnd)) ||
          (isAfter(projectEnd, monthStart) || isSameDay(projectEnd, monthStart)) &&
          (isBefore(projectEnd, monthEnd) || isSameDay(projectEnd, monthEnd)) ||
          (isBefore(projectStart, monthStart) && isAfter(projectEnd, monthEnd))
        );
      });
    } else {
      // For list view, show all projects in the current month
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      return projects.filter(project => {
        const projectStart = new Date(project.start_date);
        return (
          (isAfter(projectStart, monthStart) || isSameDay(projectStart, monthStart)) &&
          (isBefore(projectStart, monthEnd) || isSameDay(projectStart, monthEnd))
        );
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-2 sm:p-4 rounded-none md:rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 sm:gap-4 w-full h-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          {/* Header skeleton */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-11 w-11 bg-muted/30 rounded-md animate-pulse" />
            <div className="h-8 w-32 bg-muted/30 rounded-md animate-pulse" />
            <div className="h-11 w-11 bg-muted/30 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-auto relative">
          <CalendarSkeleton />
        </div>
      </div>
    );
  }

  const filteredProjects = getFilteredProjects();

  return (
    <div className="flex flex-1 overflow-hidden w-full h-full">
      <div className="p-2 sm:p-4 rounded-none md:rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 sm:gap-4 w-full h-full min-h-0">
        <div className="flex flex-col gap-2 sm:gap-4 min-h-0 flex-1 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                className="h-11 w-11 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Previous month"
                onClick={() => setDate(prev => subMonths(prev, 1))}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <h3 className="text-base sm:text-lg font-semibold min-w-[120px] text-center">
                {format(date, 'MMMM yyyy')}
              </h3>
              <button
                className="h-11 w-11 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Next month"
                onClick={() => setDate(prev => addMonths(prev, 1))}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="bg-muted/50 rounded-lg p-0.5">
                <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'list')}>
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="calendar" className="data-[state=active]:bg-background">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Calendar
                    </TabsTrigger>
                    <TabsTrigger value="list" className="data-[state=active]:bg-background">
                      <ListIcon className="h-4 w-4 mr-2" />
                      List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <button 
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={() => setNewProjectDialogOpen(true)}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Project
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-auto relative">
            {view === 'calendar' ? (
              <CalendarView
                date={date}
                projects={filteredProjects}
                onProjectClick={handleProjectClick}
                onDateRangeSelect={handleDateRangeSelect}
              />
            ) : (
              <ListView
                date={date}
                projects={filteredProjects}
                onProjectClick={handleProjectClick}
              />
            )}
          </div>
        </div>
      </div>
      {selectedProject && (
        <EditProjectDialog
          project={selectedProject}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onProjectUpdated={handleProjectUpdate}
        />
      )}
      <NewProjectDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
        onProjectAdded={handleProjectUpdate}
        initialDates={selectedDateRange}
      />
    </div>
  );
}
