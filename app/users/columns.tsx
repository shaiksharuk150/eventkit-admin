"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon, ArrowUpDown } from "lucide-react"
import { showToast } from "@/lib/toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { type User } from "@/types"
import { UserForm } from "./components/user-form"
import React from "react"

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorFn: (row) => (row.accounts?.[0]?.company_id || row.accounts?.[0]?.orgId)  ?? "N/A",
    header: "Company ID",
  },
  {
    accessorFn: (row) => row.accounts?.[0]?.company_name ?? "N/A",
    header: "Company Name",
  },
  {
   accessorFn: (row) => row.department?.[0] ?? "N/A",
    header: "Department",
  },
  {
    accessorFn: (row) => row.roles?.[0] ?? "N/A",   
     header: "Role",
  },
 
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const isActive = status === "Active"
  
      return (
        <Badge
        className={`font-normal ${isActive ? "bg-[#C2C4FF] text-black hover:bg-[#C2C4FF]/90" : "bg-destructive text-white hover:bg-destructive/80"}`}
        >
          {status}
        </Badge>
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
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original
      const setData = (table.options.meta as any)?.setData
      const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
      const [isMenuOpen, setIsMenuOpen] = React.useState(false)
      const [showUserForm, setShowUserForm] = React.useState(false)

      return (
        <>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  setShowUserForm(true)
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setShowDeleteDialog(true)
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <UserForm
            user={user}
            open={showUserForm}
            onOpenChange={setShowUserForm}
            onSave={async (updatedUser) => {
              const updatedData = { ...updatedUser, user_id: user.user_id }
              setData((prev: User[]) =>
                prev.map((u) => (u.user_id === user.user_id ? updatedData : u))
              )
            }}
          />

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user
                  and remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/users?id=${user.user_id}`, {
                        method: 'DELETE',
                      });
                      
                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to delete user');
                      }
                      
                      setData((prev: User[]) => prev.filter((u) => u.user_id !== user.user_id));
                      showToast.success("User deleted successfully");
                    } catch (error: any) {
                      console.error('Delete error:', error);
                      showToast.error(error.message);
                    } finally {
                      setShowDeleteDialog(false);
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )
    },
  },
]


