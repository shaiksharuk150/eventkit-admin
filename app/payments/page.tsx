"use client"

import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { PaymentForm } from "./components/payment-form"
import { type Payment } from "@/types"
import { columns } from "./columns"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await fetch("/api/payments")
        if (!response.ok) {
          throw new Error("Failed to fetch payments")
        }
        const data = await response.json()
        setPayments(data)
      } catch (error: any) {
        toast.error(error.message)
      }
    }
    fetchPayments()
  }, [])

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <DataTable
        columns={columns}
        data={payments}
        filterColumnId="payment_id"
        filterPlaceholder="Filter by payment ID..."
        meta={{
          setData: setPayments,
        }}
        addButton={
          <PaymentForm
            onSave={async (newPayment: Omit<Payment, "payment_id">) => {
              try {
                const response = await fetch("/api/payments", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newPayment),
                })
                if (!response.ok) {
                  const errorData = await response.json()
                  throw new Error(errorData.error || "Failed to create payment")
                }
                const createdPayment = await response.json()
                setPayments((prev) => [...prev, ...createdPayment])
                toast.success("Payment created successfully")
              } catch (error: any) {
                toast.error(error.message)
              }
            }}
          >
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Payment
            </Button>
          </PaymentForm>
        }
      />
    </div>
  )
} 