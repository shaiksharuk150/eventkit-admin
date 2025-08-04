// "use client"

// import * as React from "react"
// import { z } from "zod"
// import { toast } from "sonner"
// import {
//   Sheet,
//   SheetClose,
//   SheetBody,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// // import { SheetBody } from "./sheet"

// export const accountSchema = z.object({
//   id: z.number().optional(),
//   companyName: z.string().min(1, "Company name is required"),
//   contactPH: z.string().min(1, "Contact phone is required"),
//   companyId: z.string().min(1, "Company id is required"),
//   status: z.enum(["Active", "Inactive", "Pending"]),
//   plan: z.string().min(1, "Plan is required"),
//   planRenewalsOn: z.string().min(1, "Renewal date is required"),
//   usersCount: z.number().min(0, "Users count must be a positive number"),
// })

// export type Account = z.infer<typeof accountSchema>

// export function AccountForm({
//   children,
//   account,
//   onSave,
// }: {
//   children: React.ReactNode
//   account?: Account
//   onSave: (account: Account) => void
// }) {
//   const [formData, setFormData] = React.useState<Account>(
//     account || {
//       companyName: "",
//       contactPH: "",
//       companyId: "",
//       status: "Active",
//       plan: "",
//       planRenewalsOn: "",
//       usersCount: 0,
//     }
//   )

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "number" ? parseInt(value) : value,
//     }))
//   }

//   const handleSelectChange = (value: string, name: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     const result = accountSchema.safeParse(formData)
//     if (result.success) {
//       onSave({ ...formData, id: account?.id })
//       if (document.activeElement instanceof HTMLElement) {
//         document.activeElement.blur()
//       }
//     } else {
//       const errors = result.error.flatten().fieldErrors
//       Object.values(errors).forEach((error) => {
//         if (error) {
//           toast.error(error[0])
//         }
//       })
//     }
//   }

//   return (
//     <Sheet>
//       <SheetTrigger asChild>{children}</SheetTrigger>
//       <SheetContent>
//         <SheetHeader>
//           <SheetTitle>{account ? "Edit Account" : "Add Account"}</SheetTitle>
//           <SheetDescription>
//             {account
//               ? "Edit the account details."
//               : "Add a new account to the system."}
//           </SheetDescription>
//         </SheetHeader>
//         <SheetBody>
//           <form id="account-form" onSubmit={handleSubmit} className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="companyName">Company Name</Label>
//               <Input
//                 id="companyName"
//                 name="companyName"
//                 value={formData.companyName}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="contactPH">Contact PH</Label>
//               <Input
//                 id="contactPH"
//                 name="contactPH"
//                 value={formData.contactPH}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="companyCode">Company Code</Label>
//               <Input
//                 id="companyCode"
//                 name="companyCode"
//                 value={formData.companyCode}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="status">Status</Label>
//               <Select
//                 name="status"
//                 value={formData.status}
//                 onValueChange={(value) => handleSelectChange(value, "status")}
//               >
//                 <SelectTrigger id="status">
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Active">Active</SelectItem>
//                   <SelectItem value="Inactive">Inactive</SelectItem>
//                   <SelectItem value="Pending">Pending</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="plan">Plan</Label>
//               <Input
//                 id="plan"
//                 name="plan"
//                 value={formData.plan}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="planRenewalsOn">Plan Renewals On</Label>
//               <Input
//                 id="planRenewalsOn"
//                 name="planRenewalsOn"
//                 type="date"
//                 value={formData.planRenewalsOn}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="usersCount">Users Count</Label>
//               <Input
//                 id="usersCount"
//                 name="usersCount"
//                 type="number"
//                 value={formData.usersCount}
//                 onChange={handleChange}
//               />
//             </div>
//           </form>
//         </SheetBody>
//         <SheetFooter>
//           <SheetClose asChild>
//             <Button type="submit" form="account-form">Save</Button>
//           </SheetClose>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   )
// } 