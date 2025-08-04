'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetBody,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Lead, LEAD_STATUSES } from '../../../types/lead'
import { toast } from 'react-toastify'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  status: z.enum(LEAD_STATUSES),
  roles: z.string().min(2, { message: 'Role must be at least 2 characters.' }),
  department: z
    .string()
    .min(2, { message: 'Department must be at least 2 characters.' }),
  offPh: z.string().optional(),
  perPh: z.string().optional(),
  aadhar_number: z.string().optional(),
  date_of_birth: z.string().optional(),
  company_id: z.string().optional(),
  orgName: z.string().optional(),
})

type LeadFormValues = z.infer<typeof formSchema>

interface LeadFormProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  lead?: Lead
  onSuccess: () => void
}

export function LeadForm({
  isOpen,
  setIsOpen,
  lead,
  onSuccess,
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      roles: '',
      department: '',
      offPh: '',
      perPh: '',
      aadhar_number: '',
      date_of_birth: '',
      company_id: '',
      orgName: '',
      status: 'new',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (lead) {
        form.reset(lead)
      } else {
        form.reset({
          name: '',
          email: '',
          roles: '',
          department: '',
          offPh: '',
          perPh: '',
          aadhar_number: '',
          date_of_birth: '',
          company_id: '',
          orgName: '',
          status: 'new',
        })
      }
    }
  }, [isOpen, lead, form])

  const onSubmit = async (values: LeadFormValues) => {
    setIsSubmitting(true)
    
    try {
      const url = lead ? `/api/leads/${lead.id}` : '/api/leads'
      const method = lead ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${lead ? 'update' : 'add'} lead`)
      }

      onSuccess()
      setIsOpen(false)
      
      // Wait for sheet to close before showing toast
      setTimeout(() => {
        toast.success(`Lead ${lead ? 'updated' : 'added'} successfully`)
      }, 300)
    } catch (error) {
      console.error('Error saving lead:', error)
      toast.error(`Failed to ${lead ? 'update' : 'add'} lead`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{lead ? 'Edit Lead' : 'Add Lead'}</SheetTitle>
          <SheetDescription>
            {lead
              ? "Update the lead's details."
              : 'Create a new lead to track.'}
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Form {...form}>
            <form id="lead-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Sales Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Sales" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="orgName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="offPh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="perPh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 098 765 432" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="aadhar_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234 5678 9012" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LEAD_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </SheetBody>
        <SheetFooter>
          <Button type="submit" form="lead-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {lead ? "Updating..." : "Creating..."}
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