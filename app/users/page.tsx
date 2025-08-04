"use client"

import { useEffect, useState } from "react"
import { PlusIcon, TrashIcon, ChevronDown } from "lucide-react"
import { showToast } from "@/lib/toast"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
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
import { UserForm } from "./components/user-form"
import { type User } from "@/types"
import { columns } from "./columns"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState<User[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddUserForm, setShowAddUserForm] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch users")
      }
      const data = await response.json()
      console.log("fetched data",data )

      setUsers(data)
    } catch (error: any) {
      console.error('Fetch users error:', error)
      showToast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = (newUser: User) => {
    setUsers((prev) => [newUser, ...prev])
  }

  const handleDeleteSelected = async () => {
    if (!selectedRows.length) return;
    
    setIsDeleting(true);
    try {
      const deletePromises = selectedRows.map(user =>
        fetch(`/api/users?id=${user.user_id}`, { method: 'DELETE' })
      );

      const results = await Promise.allSettled(deletePromises);
      
      const failedDeletes = results.filter(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
      );

      if (failedDeletes.length > 0) {
        throw new Error(`${failedDeletes.length} users failed to delete`);
      }

      setUsers(prev => prev.filter(user => 
        !selectedRows.some(selected => selected.user_id === user.user_id)
      ));
      
      setSelectedRows([]);
      showToast.success(`${selectedRows.length} users deleted successfully`);
    } catch (error: any) {
      console.error('Delete users error:', error);
      showToast.error(error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
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
                <TrashIcon className="h-4 w-4" />
                Delete Selected ({selectedRows.length})
              </>
            )}
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={users}
        filterColumnId="name"
        filterPlaceholder="Filter by name..."
        meta={{
          setData: setUsers,
          selectedRows,
          setSelectedRows,
          addButton: (
            <Button className="bg-[#C2C4FF] text-black hover:bg-[#C2C4FF]/90" onClick={() => setShowAddUserForm(true)}>
              <PlusIcon className="h-4 w-4" /> Add User
            </Button>
          ),
        }}
        loading={loading}
      />

      <UserForm
        open={showAddUserForm}
        onOpenChange={setShowAddUserForm}
        onSave={handleCreateUser}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedRows.length} selected users
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
