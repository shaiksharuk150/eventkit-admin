export type Lead = {
  id: string
  user_id: string
  name: string
  email: string
  status: 'new' | 'prospect' | 'demo' | 'opportunity' | 'not-interested'
  roles: string
  department: string
  offPh?: string
  perPh?: string
  aadhar_number?: string
  date_of_birth?: string
  company_id?: string
  orgName?: string
}

export const LEAD_STATUSES = [
  'new',
  'prospect',
  'demo',
  'opportunity',
  'not-interested',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]
