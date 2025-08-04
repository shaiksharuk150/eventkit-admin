"use client"

import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { AccountForm } from "./components/account-form"
import { type Account } from "@/types"
import { columns } from "./columns"
import { showToast } from "@/lib/toast"
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

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState<Account[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddAccountForm, setShowAddAccountForm] = useState(false)

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true)
        const response = await fetch("/api/accounts")
        if (!response.ok) {
          throw new Error("Failed to fetch accounts")
        }
        const data = await response.json()
        setAccounts(data)
      } catch (error: any) {
        showToast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAccounts()
  }, [])

  const handleCreateAccount = (newAccount: Account) => {
    setAccounts((prev) => [newAccount, ...prev])
  }

  const handleDeleteSelected = async () => {
    if (!selectedRows.length) return;
    setIsDeleting(true);
    try {
      const deletePromises = selectedRows.map(account =>
        fetch(`/api/accounts?id=${account.account_id}`, { method: 'DELETE' })
      );
      const results = await Promise.allSettled(deletePromises);
      const failedDeletes = results.filter(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
      );
      if (failedDeletes.length > 0) {
        throw new Error(`${failedDeletes.length} accounts failed to delete`);
      }
      setAccounts(prev => prev.filter(account =>
        !selectedRows.some(selected => selected.account_id === account.account_id)
      ));
      setSelectedRows([]);
      showToast.success(`${selectedRows.length} accounts deleted successfully`);
    } catch (error: any) {
      showToast.error(error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Accounts</h1>
        {selectedRows.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Deleting...
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4" />
                Delete Selected ({selectedRows.length})
              </>
            )}
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={accounts}
        filterColumnId="company_id"
        filterPlaceholder="Filter by company id..."
        meta={{
          setData: setAccounts,
          selectedRows,
          setSelectedRows,
          addButton: (
            <Button onClick={() => setShowAddAccountForm(true)}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Account
            </Button>
          ),
        }}
        loading={loading}
      />
      <AccountForm
        open={showAddAccountForm}
        onOpenChange={setShowAddAccountForm}
        onSave={handleCreateAccount}
      />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedRows.length} selected accounts
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}