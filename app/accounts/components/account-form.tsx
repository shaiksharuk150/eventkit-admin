"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetBody,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Account } from "@/types"
import { showToast } from "@/lib/toast"

export function AccountForm({
  account,
  onSave,
  open,
  onOpenChange,
}: {
  account?: Account
  onSave: (account: Account) => void | Promise<void>
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [formData, setFormData] = React.useState<Omit<Account, "account_id">>({
    company_id: "",
    company_name: "",
    contact_phone: "",
    status: "Active",
    plan: "",
    plan_renewals_on: "",
    users_count: 0,
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      if (account) {
        setFormData({
          company_id: account.company_id || "",
          company_name: account.company_name || "",
          contact_phone: account.contact_phone || "",
          status: account.status || "Active",
          plan: account.plan || "",
          plan_renewals_on: account.plan_renewals_on || "",
          users_count: account.users_count || 0,
        })
      } else {
        setFormData({
          company_id: "",
          company_name: "",
          contact_phone: "",
          status: "Active",
          plan: "",
          plan_renewals_on: "",
          users_count: 0,
        })
      }
    }
  }, [account, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.company_id || !formData.company_name) {
      showToast.error("Company ID and Company Name are required.")
      return
    }

    setIsSubmitting(true)

    try {
      const isUpdating = !!account?.account_id
      const url = isUpdating ? `/api/accounts?id=${account.account_id}` : '/api/accounts'
      const method = isUpdating ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isUpdating ? { ...formData, account_id: account.account_id } : formData),
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save account.")
      }

      const savedAccount: Account = await response.json()
      await onSave(savedAccount)

      const toastMessage = account ? "Account updated successfully!" : "Account created successfully!"
      onOpenChange(false) 
      
      setTimeout(() => {
        showToast.success(toastMessage)
      }, 300)

    } catch (error: any) {
      showToast.error(error.message)
    } finally {
      setIsSubmitting(false)
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{account ? "Edit Account" : "Add Account"}</SheetTitle>
          <SheetDescription>
            {account
              ? "Edit the account details."
              : "Add a new account to the system."}
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <form id="account-form" onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company_id">Company ID</Label>
              <Input
                id="company_id"
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) => handleSelectChange(value, "status")}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Input
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan_renewals_on">Plan Renewals On</Label>
              <Input
                id="plan_renewals_on"
                name="plan_renewals_on"
                type="date"
                value={formData.plan_renewals_on}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="users_count">Users Count</Label>
              <Input
                id="users_count"
                name="users_count"
                type="number"
                value={formData.users_count?.toString()}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    users_count: parseInt(e.target.value, 10) || 0,
                  }))
                }
              />
            </div>
          </form>
        </SheetBody>
        <SheetFooter>
          <Button type="submit" form="account-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {account ? "Updating..." : "Creating..."}
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
