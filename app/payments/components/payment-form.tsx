"use client"

import * as React from "react"
import { z } from "zod"
import { toast } from "sonner"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { type Payment, paymentSchema } from "@/types"

export type { Payment };
export function PaymentForm({
  children,
  payment,
  onSave,
}: {
  children: React.ReactNode
  payment?: Payment
  onSave: (payment: Omit<Payment, "payment_id">) => void
}) {
  const [formData, setFormData] = React.useState<Omit<Payment, "payment_id">>(
    payment || {
      account_id: "",
      amount: 0,
      transaction_date: "",
      payment_method: "Card",
      status: "Completed",
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // we need to add payment_id for validation to work, but we dont have it yet
    const result = paymentSchema.safeParse({ ...formData, payment_id: crypto.randomUUID() })
    if (result.success) {
      onSave(formData)
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    } else {
      const errors = result.error.flatten().fieldErrors
      Object.values(errors).forEach((error) => {
        if (error) {
          toast.error(error[0])
        }
      })
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{payment ? "Edit Payment" : "Add Payment"}</SheetTitle>
          <SheetDescription>
            {payment
              ? "Edit the payment details."
              : "Add a new payment to the system."}
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <form id="payment-form" onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account_id">Account ID</Label>
              <Input
                id="account_id"
                name="account_id"
                value={formData.account_id}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({...prev, amount: parseInt(e.target.value, 10)}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction_date">Transaction Date</Label>
              <Input
                id="transaction_date"
                name="transaction_date"
                type="date"
                value={formData.transaction_date}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                name="payment_method"
                value={formData.payment_method}
                onValueChange={(value) => handleSelectChange(value, "payment_method")}
              >
                <SelectTrigger id="payment_method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" form="payment-form">Save</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}