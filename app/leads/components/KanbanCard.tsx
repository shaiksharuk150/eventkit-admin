'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Edit,
  Trash2,
  Mail,
  User,
  Building,
  Phone,
  ChevronDown,
} from 'lucide-react'
import { Lead } from '@/types/lead'
import { cn } from '@/lib/utils'

export function KanbanCard({
  lead,
  onEdit,
  onDelete,
}: {
  lead: Lead
  onEdit: (lead: Lead) => void
  onDelete: (leadId: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: { type: 'Lead', lead },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const handleActionClick = (
    e: React.MouseEvent,
    action: (lead: Lead) => void
  ) => {
    e.stopPropagation()
    action(lead)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(lead.id)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'cursor-grab active:cursor-grabbing transition-shadow bg-white border border-gray-200 rounded-s w-full',
        isDragging && 'opacity-50',
        isExpanded && 'row-span-2' // This might need grid adjustments on parent
      )}
    >
      <div {...attributes} {...listeners}>
        <CardContent className="p-3" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                {lead.name}
              </h4>

            </div>
            <div className="flex items-center ml-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleActionClick(e, onEdit)}
                className="h-5 w-5 hover:bg-blue-100"
              >
                <Edit className="h-1 w-1 ml-1 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteClick}
                className="h-5 w-5 hover:bg-red-100"
              >
                <Trash2 className="h-1 w-1 ml-2 text-red-600" />
              </Button>
              <div
                className={cn(
                  'transform transition-transform duration-200 ml-1',
                  isExpanded && 'rotate-180'
                )}
              >
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-600 mt-2">
            <Phone className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
            <span>{lead.perPh}</span>
          </div>
        </CardContent>
      </div>
      {isExpanded && (
        <div className="px-3 pb-3">
          <div className="border-t border-gray-200 pt-3 mt-2">
            <div className="space-y-2 text-xs">
              <div className="flex items-center text-xs text-gray-600 mt-1">
                <Mail className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-3 w-3 mr-2 text-gray-400" />
                <span className="truncate">{lead.roles}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Building className="h-3 w-3 mr-2 text-gray-400" />
                <span className="truncate">{lead.department}</span>
              </div>
              {lead.orgName && (
                <div className="flex items-center text-gray-600">
                  <Building className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="truncate">{lead.orgName}</span>
                </div>
              )}
              {lead.offPh && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="truncate">Office: {lead.offPh}</span>
                </div>
              )}
              {/* {lead.perPh && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="truncate">Personal: {lead.perPh}</span>
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
