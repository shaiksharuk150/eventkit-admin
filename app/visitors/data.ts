export interface Visitor {
  docId?: string
  Name: string
  Email: string
  Mobile: string
  Event: string
  Status: string
  Note: string
  ProjectId: string
  Date: number
  timestamp: any
  assignedToObj: {
    email: string
    name: string
    uid: string
    role: string
    offPh: string
    namespace: string
  }
  countryCode: string
  intype: string
  location: string
  schedule: string
}

// Mock data removed - will be replaced with Firebase data
export const visitorsData: Visitor[] = [] 