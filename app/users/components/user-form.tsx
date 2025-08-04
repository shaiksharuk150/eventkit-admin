"use client"

import * as React from "react"
import { showToast } from "@/lib/toast"
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
import { type User } from "@/types"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"

export function UserForm({
  user,
  onSave,
  open,
  onOpenChange,
}: {
  user?: User
  onSave: (user: User) => void | Promise<void>
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
const [accounts, setAccounts] = React.useState<any[]>([])
  const [formData, setFormData] = React.useState<Omit<any, 'user_id'>>({
      name: "",
      companyName: "",
      companyId: "",
      email: "",
      status: "Active",
      accounts: [],
      roles: "",
      department: "",
      offPh: "",
      perPh: "",
      aadhar_number: "",
      date_of_birth: "",
  })
  const [availableRoles, setAvailableRoles] = React.useState<string[]>([])
  const [availableDepartments, setAvailableDepartments] = React.useState<string[]>([])  
  const [selectedAccountId, setSelectedAccountId] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      if (user) {
        // Editing an existing user, pre-fill the form
        setFormData({
          name: user.name || "",
          email: user.email || "",
          status: user.status || "Active",
          accounts: user.accounts || [],
          roles: Array.isArray(user.roles) ? user.roles.join(", ") : user.roles || "",
          department: Array.isArray(user.department) ? user.department.join(", ") : user.department || "",
          offPh: user.offPh || "",
          perPh: user.perPh || "",
          aadhar_number: user.aadhar_number || "",
          date_of_birth: user.date_of_birth || "",
        });
        setSelectedAccountId(user.accounts?.[0]?.account_id || "");
      } else {
        // Creating a new user, ensure the form is empty
        setFormData({
          name: "",
          email: "",
          status: "Active",
          accounts: [],
          roles: "",
          department: "",
          offPh: "",
          perPh: "",
          aadhar_number: "",
          date_of_birth: "",
        });
        setSelectedAccountId("");
      }
    }
  }, [user, open]);

React.useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/accounts')
        if (!response.ok) throw new Error('Failed to fetch accounts')
        const data = await response.json()
        setAccounts(data)
      } catch (error) {
        console.error('Error fetching accounts:', error)
        showToast.error('Failed to fetch accounts')
      }
    }
    fetchAccounts()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // Handle roles and department as arrays
    if (name === "roles" || name === "department") {
      setFormData((prev) => ({ ...prev, [name]: value.split(",").map(v => v.trim()) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }
  

 const handleSelectChange = (value: string, name: string) => {
    if (name === 'company') {
      setSelectedAccountId(value)
      // Update the accounts array with the selected account
      const selectedAccount = accounts.find(acc => acc.account_id === value)
      if (selectedAccount) {
        setFormData(prev => ({
          ...prev,
          accounts: [selectedAccount]
        }))
        setAvailableRoles(selectedAccount.roles || [])
      setAvailableDepartments(selectedAccount.department || [])
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }
const addSignUp = async (data) => {
  const {email} = data
  let password = 111111

}

 const createUser = async (data) => {
    try {
      const userRef = doc(db, 'users', data.uid)
      const docSnap = await getDoc(userRef)
      if (!docSnap.exists()) {
        await setDoc(userRef, data, { merge: true })
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
        return null
      }
    } catch (error) {
      console.log('error in db', error)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
  console.log('form data is', e, formData)
  

  const {email, offPh} = formData
    let password = offPh
       let createdUserResp =  await createUserWithEmailAndPassword(auth, email, password);
       let uid = createdUserResp.user.uid

         if (createdUserResp?.user?.uid) {
      const user = createdUserResp?.user
     let addedUserDocR =  await createUser({
      // empId: user.empId, 
        uid: user.uid,
        orgName: formData.companyName,
        orgId: formData.companyId,
        department: ['admin'],
        roles: ['admin'],
        name: formData.name,
        email: formData.email,
        offPh: formData.offPh,
        perPh: formData.perPh,
        userStatus: 'active',
        createdOn: Timestamp.now().toMillis()
      })
    }
        setIsSubmitting(false)

  showToast.success('successfully created user')
return 

    try {
      const isUpdating = !!user?.user_id
      const url = isUpdating ? `/api/users?id=${user.user_id}` : '/api/users'
  
      const response = await fetch(url, {
        method: isUpdating ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          roles: typeof formData.roles === 'string' ? formData.roles.split(",").map(r => r.trim()) : formData.roles,
          department: typeof formData.department === 'string' ? formData.department.split(",").map(d => d.trim()) : formData.department,
          user_id: user?.user_id,
          uid: uid
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save user.")
      }
  
      const savedUser: User = await response.json()
      await onSave(savedUser)
  
      // ✅ Wait for form to close before showing toast
      const toastMessage = user ? "User updated successfully!" : "User created successfully!"
      onOpenChange(false) // This triggers the Sheet's close animation
  
      // Wait ~300ms for the animation to complete before showing toast
      setTimeout(() => {
        showToast.success(toastMessage)
      }, 300)
  
    } catch (error: any) {
      console.error("Error saving user:", error)
      showToast.error(error?.message || "Something went wrong while saving.")
    } finally {
      setIsSubmitting(false)
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }
  }
  
  
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{user ? "Edit User" : "Add User"}</SheetTitle>
          <SheetDescription>{user ? "Update user details." : "Create a new user."}</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <form id="user-form" onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                value={selectedAccountId}
                onValueChange={(value) => handleSelectChange(value, 'company')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.account_id} value={account.account_id}>
                      {account.company_name} ({account.company_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            
           
             <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input name="companyName" value={formData.companyName} onChange={handleChange} />
            </div>
              <div className="space-y-2">
              <Label htmlFor="companyId">Company Id</Label>
              <Input name="companyId" value={formData.companyId} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>

             <div className="space-y-2">
              <Label htmlFor="official_phone">Official Phone</Label>
              <Input name="offPh" value={formData.offPh} onChange={handleChange} />
            </div>

               {/* <div className="space-y-2">
              <Label htmlFor="payment">Payment</Label>
              <Select
                value={formData.payment}
                onValueChange={(value) => handleSelectChange(value, "payment")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Yes</SelectItem>
                  <SelectItem value="Inactive">No</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            
           
            {/* <div className="space-y-2">
              <Label htmlFor="roles">Role</Label>
              <Input name="roles" value={formData.roles} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange(value, "status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input name="department" value={formData.department} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="official_phone">Official Phone</Label>
              <Input name="offPh" value={formData.offPh} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personal_phone">Personal Phone</Label>
              <Input name="perPh" value={formData.perPh} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aadhar_number">Aadhar Number</Label>
              <Input name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
            </div> */}
          </form>
        </SheetBody>
        <SheetFooter>
            <Button type="submit" form="user-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {user ? "Updating..." : "Creating..."}
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