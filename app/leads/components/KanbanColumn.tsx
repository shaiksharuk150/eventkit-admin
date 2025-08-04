
'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Lead, LeadStatus } from '../../../types/lead'
import { KanbanCard } from './KanbanCard'
import { cn } from '@/lib/utils'

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-100 border-blue-300',
  prospect: 'bg-yellow-100 border-yellow-300',
  demo: 'bg-purple-100 border-purple-300',
  opportunity: 'bg-green-100 border-green-300',
  'not-interested': 'bg-red-100 border-red-300',
}

export function KanbanColumn({
  status,
  leads,
  onEdit,
  onDelete,
}: {
  status: LeadStatus
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (leadId: string) => void
}) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: { type: 'Column', status },
  })

  return (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-md border w-full border-gray-200">
      <div
        className={cn(
          'flex justify-between items-center px-4 py-2 font-medium text-sm capitalize',
          'border-b',
          statusColors[status]
        )}
      >
        <span>{status}</span>
        <div className="bg-white text-xs text-gray-700 rounded-full w-6 h-6 flex items-center justify-center font-semibold border border-gray-300">
          {leads.length}
        </div>
      </div>

      <div
  ref={setNodeRef}
  className={cn(
    "p-2 bg-white flex-1 transition-all",
    leads.length === 0 ? "min-h-[150px]" : "auto"
  )}
>
        {leads.length ? (
          <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {leads.map((lead) => (
                <KanbanCard key={lead.id} lead={lead} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          </SortableContext>
        ) : (
          <div className="flex items-center justify-center text-sm text-gray-400 text-center px-2">
            No leads in {status}
          </div>
        )}
      </div>
    </div>
  )
}
