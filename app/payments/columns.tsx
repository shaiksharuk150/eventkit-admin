"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontalIcon, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type Payment } from "@/types"
import { PaymentForm } from "./components/payment-form"

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: "payment_id",
    header: "Payment ID",
  },
  {
    accessorKey: "account_id",
    header: "Account ID",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)

        return <div className="text-right font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "transaction_date",
    header: "Transaction Date",
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === "Completed" ? "default" : status === "Pending" ? "secondary" : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const payment = row.original
      const setData = (table.options.meta as any)?.setData

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <PaymentForm
              payment={payment}
              onSave={async (updatedPayment) => {
                try {
                  const response = await fetch(`/api/payments?id=${payment.payment_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedPayment),
                  });
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to update payment');
                  }
                  const result = await response.json();
                  setData((prev: Payment[]) =>
                    prev.map((p) => (p.payment_id === payment.payment_id ? result[0] : p))
                  );
                  toast.success("Payment updated successfully");
                } catch (error: any) {
                  toast.error(error.message);
                }
              }}
            >
              <button className="w-full text-left p-2 text-sm hover:bg-accent">Edit</button>
            </PaymentForm>
            <DropdownMenuItem
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete this payment?")) {
                  try {
                    const response = await fetch(`/api/payments?id=${payment.payment_id}`, {
                      method: 'DELETE',
                    });
                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.error || 'Failed to delete payment');
                    }
                    setData((prev: Payment[]) => prev.filter((p) => p.payment_id !== payment.payment_id));
                    toast.success("Payment deleted successfully");
                  } catch (error: any) {
                    toast.error(error.message);
                  }
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]