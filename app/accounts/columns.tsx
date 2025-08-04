"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { showToast } from "@/lib/toast"
import React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, type Account } from "@/types"
import { AccountForm } from "./components/account-form"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export const columns: ColumnDef<Account>[] = [
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
  accessorKey: "company_name",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Name
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => row.original?.company_name ?? "-",
},

  {
    accessorKey: "company_id",
    header: "Company Id",
  },
  {
    accessorKey: "contact_phone",
    header: "Contact No",
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
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "plan_renewals_on",
    header: "Plan Renewals On",
  },
  {
    accessorKey: "users_count",
    header: "Users Count",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const account = row.original
      const setData = (table.options.meta as any)?.setData
      const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
      const [showAccountForm, setShowAccountForm] = React.useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setShowAccountForm(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AccountForm
            account={account}
            open={showAccountForm}
            onOpenChange={setShowAccountForm}
            onSave={async (updatedAccount) => {
              const updatedData = { ...updatedAccount, account_id: account.account_id }
              setData((prev: Account[]) =>
                prev.map((a) => (a.account_id === account.account_id ? updatedData : a))
              )
            }}
          />

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the account and remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/accounts?id=${account.account_id}`, {
                        method: 'DELETE',
                      });
                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to delete account');
                      }
                      setData((prev: Account[]) => prev.filter((a) => a.account_id !== account.account_id));
                      showToast.success("Account deleted successfully");
                    } catch (error: any) {
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
