'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown, MoreHorizontalIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/ui/data-table'
import { Lead, LeadStatus } from '@/types/lead'
import { Checkbox } from "@/components/ui/checkbox"

interface LeadsTableProps {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (leadId: string) => void
  loading: boolean
  onAdd: () => void
}

export function LeadsTable({ leads, onEdit, onDelete, loading, onAdd }: LeadsTableProps) {
  const columns: ColumnDef<Lead>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'roles',
      header: 'Role',
    },
    {
        accessorKey: 'orgName',
        header: 'Org Name',
    },
    {
        accessorKey: 'department',
        header: 'Department',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as LeadStatus
        const statusClasses: Record<LeadStatus, string> = {
            'new': 'bg-blue-100 text-blue-800',
            'prospect': 'bg-yellow-100 text-yellow-800',
            'demo': 'bg-purple-100 text-purple-800',
            'opportunity': 'bg-green-100 text-green-800',
            'not-interested': 'bg-red-100 text-red-800',
        }
        return (
          <span
            className={`px-2 py-1 w-500 rounded-full text-xs font-medium ${statusClasses[status]}`}
          >
            {status}
          </span>
        )
      },
    },
    {
        accessorKey: "perPh",
        header: "Personal Ph",
      },
      {
        accessorKey: "offPh",
        header: "Official Phone",
      },
      {
        accessorKey: "aadhar_number",
        header: "Aadhar",
      },
      {
        accessorKey: "date_of_birth",
        header: "DOB",
      },
    {
      id: 'actions',
      cell: ({ row }) => {
        const lead = row.original

        return (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(lead)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onDelete(lead.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const addButton = (
    <Button onClick={onAdd} className="bg-[#C2C4FF] text-black hover:bg-[#C2C4FF]/90">
      <PlusIcon className="mr-2 h-4 w-4" />
      Add Lead
    </Button>
  )

  return (
    <div>
        <DataTable
            columns={columns}
            data={leads}
            filterColumnId="name"
            filterPlaceholder="Filter by name..."
            loading={loading}
            meta={{
              addButton,
            }}
        />
    </div>
  )
} 