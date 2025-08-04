'use client'

import { useState, useEffect } from 'react'
import { KanbanBoard } from './components/KanbanBoard'
import { LeadsTable } from './components/LeadsTable'
import { Button } from '@/components/ui/button'
import { LayoutGrid, List, PlusCircle, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Lead } from '@/types/lead'
import { LeadForm } from './components/LeadForm'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

type View = 'kanban' | 'table'


export default function LeadsPage() {
  const [view, setView] = useState<View>('kanban')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null)

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/leads')
      if (!response.ok) throw new Error('Failed to fetch leads')
      const data = await response.json()
      setLeads(data)
    } catch (error) {
      toast.error('Could not fetch leads.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleAddLead = () => {
    setSelectedLead(undefined)
    setIsFormOpen(true)
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsFormOpen(true)
  }

  const handleDeleteLead = (leadId: string) => {
    setLeadToDelete(leadId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (leadToDelete) {
      try {
        const response = await fetch(`/api/leads/${leadToDelete}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete lead')
        toast.success('Lead deleted successfully')
        setLeads((prev) => prev.filter((l) => l.id !== leadToDelete))
        setLeadToDelete(null)
      } catch (error) {
        toast.error('Failed to delete lead')
      } finally {
        setIsDeleteDialogOpen(false)
      }
    }
  }

  return (
    <div className="container mx-auto py-6 px-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Lead Management</h1>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView('kanban')}
              className={cn(
                'px-3 py-1 text-sm font-medium',
                view === 'kanban' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView('table')}
              className={cn(
                'px-3 py-1 text-sm font-medium',
                view === 'table' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {view === 'kanban' && (
            <Button onClick={handleAddLead} className="bg-[#C2C4FF] text-black hover:bg-[#C2C4FF]/90">
              <PlusIcon className="h-4 w-4" />
              Add Lead
            </Button>
          )}
        </div>
      </header>
      
      {view === 'kanban' ? (
        <KanbanBoard 
          leads={leads}
          setLeads={setLeads}
          onEditLead={handleEditLead}
          onDeleteLead={handleDeleteLead}
          loading={loading}
        />
      ) : (
        <LeadsTable 
          leads={leads}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
          loading={loading}
          onAdd={handleAddLead}
        />
      )}

      <LeadForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        lead={selectedLead}
        onSuccess={fetchLeads}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 