'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { toast } from 'sonner'

import { Lead, LeadStatus, LEAD_STATUSES } from '../../../types/lead'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { Skeleton } from '@/components/ui/skeleton'

interface KanbanBoardProps {
  leads: Lead[]
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>
  onEditLead: (lead: Lead) => void
  onDeleteLead: (leadId: string) => void
  loading: boolean
}

export function KanbanBoard({
  leads,
  setLeads,
  onEditLead,
  onDeleteLead,
  loading,
}: KanbanBoardProps) {
  const [activeLead, setActiveLead] = useState<Lead | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveLead(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const isActiveALead = active.data.current?.type === 'Lead'
    if (!isActiveALead) return

    const activeLeadItem = leads.find((l) => l.id === activeId)
    if (!activeLeadItem) return

    // Determine the new status
    let newStatus: LeadStatus | null = null

    // Check if dropped on a column
    if (over.data.current?.type === 'Column') {
      newStatus = over.data.current.status as LeadStatus
    }
    // Check if dropped on another lead (get the column status from that lead)
    else if (over.data.current?.type === 'Lead') {
      const overLead = leads.find((l) => l.id === overId)
      if (overLead) {
        newStatus = overLead.status
      }
    }

    // Only update if status actually changed
    if (newStatus && activeLeadItem.status !== newStatus) {
      // Optimistic update first
      setLeads((prevLeads) => {
        const leadIndex = prevLeads.findIndex((l) => l.id === activeId)
        if (leadIndex === -1) return prevLeads
        const newLeads = [...prevLeads]
        newLeads[leadIndex] = { ...newLeads[leadIndex], status: newStatus! }
        return newLeads
      })

      try {
        console.log('Updating lead status:', { activeId, newStatus })

        const response = await fetch(`/api/leads/${activeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })

        console.log('Response status:', response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', errorData)
          throw new Error('Failed to update lead status')
        }

        const result = await response.json()
        console.log('Update result:', result)

        toast.success(`${activeLeadItem.name} moved to ${newStatus}`)
      } catch (error) {
        console.error('Error updating lead status:', error)
        toast.error('Failed to move lead')

        // Revert the optimistic update on error
        setLeads((prevLeads) => {
          const leadIndex = prevLeads.findIndex((l) => l.id === activeId)
          if (leadIndex === -1) return prevLeads
          const newLeads = [...prevLeads]
          newLeads[leadIndex] = { ...newLeads[leadIndex], status: activeLeadItem.status }
          return newLeads
        })
      }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveALead = active.data.current?.type === 'Lead'
    const isOverAColumn = over.data.current?.type === 'Column'
    const isOverALead = over.data.current?.type === 'Lead'

    if (!isActiveALead) return

    // Lead over column - just visual feedback, actual update happens in handleDragEnd
    if (isActiveALead && isOverAColumn) {
      // Don't update state here, let handleDragEnd handle the persistence
      return
    }

    // Lead over lead - reorder within the same column or move to different column
    if (isActiveALead && isOverALead) {
      setLeads((leads) => {
        const activeIndex = leads.findIndex((l) => l.id === activeId)
        const overIndex = leads.findIndex((l) => l.id === overId)

        if (activeIndex === -1 || overIndex === -1) return leads

        const activeLead = leads[activeIndex]
        const overLead = leads[overIndex]

        // If leads are in different columns, move the active lead to the over lead's column
        if (activeLead.status !== overLead.status) {
          const newLeads = [...leads]
          newLeads[activeIndex] = { ...activeLead, status: overLead.status }
          return arrayMove(newLeads, activeIndex, overIndex)
        }

        // Same column, just reorder
        return arrayMove(leads, activeIndex, overIndex)
      })
    }
  }

  const handleDragStart = (event: any) => {
    if (event.active.data.current?.type === 'Lead') {
      setActiveLead(event.active.data.current.lead)
    }
  }

  const leadsByStatus = (status: LeadStatus) =>
    leads.filter((lead) => lead.status === status)

  if (loading) {
    return (
      <div className="flex gap-4 items-start w-full overflow-x-auto">
        {LEAD_STATUSES.map((status) => (
          <div key={status} className="flex flex-col rounded-xl overflow-hidden shadow-md border w-full border-gray-200">
            <div className="flex justify-between items-center px-4 py-2 font-medium text-sm capitalize border-b">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div className="p-2 bg-white flex-1">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-24 w-full rounded-s" />
                <Skeleton className="h-24 w-full rounded-s" />
                <Skeleton className="h-24 w-full rounded-s" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 items-start w-full overflow-x-auto">
          {LEAD_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              leads={leadsByStatus(status)}
              onEdit={onEditLead}
              onDelete={onDeleteLead}
            />
          ))}
        </div>
        <DragOverlay>
          {activeLead ? (
            <KanbanCard
              lead={activeLead}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
