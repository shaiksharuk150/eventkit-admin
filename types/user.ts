
import type { Account } from "./account"

export interface User {
    user_id: string
    name: string
    email: string
    status: string
    roles: string  // Keep as 'roles' to match columns
    department: string
    offPh?: string
    perPh?: string
    aadhar_number?: string
    date_of_birth?: string
    company_id?: string
    orgName?: string
    accounts: Account[] // 👈 this line
}
