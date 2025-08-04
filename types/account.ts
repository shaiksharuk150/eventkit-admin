export interface Account {
  orgId: string
  account_id: string
  company_id: string
  company_name: string
  contact_phone?: string
  status: string
  plan?: string
  plan_renewals_on?: string
  users_count?: number
}