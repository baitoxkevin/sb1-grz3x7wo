"use client"

import * as React from "react"
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { cn } from "@/lib/utils"

interface KanbanProviderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDragEnd'> {
  onDragEnd: (event: DragEndEvent) => void
}

const KanbanProvider = React.forwardRef<HTMLDivElement, KanbanProviderProps>(
  ({ className, onDragEnd, children, ...props }, ref) => {
    const mouseSensor = useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
    const sensors = useSensors(mouseSensor)

    return (
      <DndContext 
        sensors={sensors} 
        onDragEnd={onDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div
          ref={ref}
          className={cn("flex gap-4 overflow-x-auto p-4", className)}
          {...props}
        >
          {children}
        </div>
      </DndContext>
    )
  }
)
KanbanProvider.displayName = "KanbanProvider"

interface KanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
}

const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ className, id, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        className={cn("flex-1 rounded-lg border bg-card p-4", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
KanbanBoard.displayName = "KanbanBoard"

interface KanbanHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  color?: string
}

const KanbanHeader = React.forwardRef<HTMLDivElement, KanbanHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mb-4", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
KanbanHeader.displayName = "KanbanHeader"

interface KanbanCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: Array<{
    id: string;
    name: string;
    parent: string;
    index: number;
  }>;
}

const KanbanCards = React.forwardRef<HTMLDivElement, KanbanCardsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <SortableContext items={props.items || []} strategy={verticalListSortingStrategy}>
        <div
          ref={ref}
          className={cn("space-y-4", className)}
          {...props}
        >
          {children}
        </div>
      </SortableContext>
    )
  }
)
KanbanCards.displayName = "KanbanCards"

interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  name: string
  parent: string
  index: number
}

const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background p-4 shadow-sm transition-all hover:shadow-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
KanbanCard.displayName = "KanbanCard"

export {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
}
