export interface Visitor {
  id: string
  name: string
  email: string
  phone: string
  company: string
  visitDate: string
  status: 'checked-in' | 'checked-out' | 'scheduled' | 'cancelled'
  purpose: string
  host: string
  badgeNumber: string
}

export const visitorsData: Visitor[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Solutions Inc.",
    visitDate: "2024-01-15T09:00:00Z",
    status: "checked-in",
    purpose: "Business Meeting",
    host: "Sarah Johnson",
    badgeNumber: "V001"
  },
  {
    id: "2",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    phone: "+1 (555) 234-5678",
    company: "Marketing Pro",
    visitDate: "2024-01-15T10:30:00Z",
    status: "scheduled",
    purpose: "Product Demo",
    host: "Mike Wilson",
    badgeNumber: "V002"
  },
  {
    id: "3",
    name: "Robert Chen",
    email: "robert.chen@startup.io",
    phone: "+1 (555) 345-6789",
    company: "Innovation Labs",
    visitDate: "2024-01-15T08:45:00Z",
    status: "checked-out",
    purpose: "Interview",
    host: "Lisa Brown",
    badgeNumber: "V003"
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria.garcia@consulting.com",
    phone: "+1 (555) 456-7890",
    company: "Global Consulting",
    visitDate: "2024-01-15T14:00:00Z",
    status: "cancelled",
    purpose: "Strategy Session",
    host: "David Lee",
    badgeNumber: "V004"
  },
  {
    id: "5",
    name: "James Wilson",
    email: "james.wilson@enterprise.com",
    phone: "+1 (555) 567-8901",
    company: "Enterprise Corp",
    visitDate: "2024-01-15T11:15:00Z",
    status: "checked-in",
    purpose: "Contract Review",
    host: "Jennifer Adams",
    badgeNumber: "V005"
  },
  {
    id: "6",
    name: "Sarah Thompson",
    email: "sarah.thompson@design.com",
    phone: "+1 (555) 678-9012",
    company: "Creative Design",
    visitDate: "2024-01-15T13:30:00Z",
    status: "scheduled",
    purpose: "Design Review",
    host: "Alex Turner",
    badgeNumber: "V006"
  },
  {
    id: "7",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@finance.com",
    phone: "+1 (555) 789-0123",
    company: "Financial Partners",
    visitDate: "2024-01-15T09:30:00Z",
    status: "checked-out",
    purpose: "Investment Discussion",
    host: "Rachel Green",
    badgeNumber: "V007"
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "lisa.anderson@tech.com",
    phone: "+1 (555) 890-1234",
    company: "Tech Innovations",
    visitDate: "2024-01-15T15:00:00Z",
    status: "checked-in",
    purpose: "Partnership Meeting",
    host: "Tom Harris",
    badgeNumber: "V008"
  },
  {
    id: "9",
    name: "David Kim",
    email: "david.kim@research.com",
    phone: "+1 (555) 901-2345",
    company: "Research Institute",
    visitDate: "2024-01-15T12:00:00Z",
    status: "scheduled",
    purpose: "Research Collaboration",
    host: "Emma White",
    badgeNumber: "V009"
  },
  {
    id: "10",
    name: "Amanda Foster",
    email: "amanda.foster@legal.com",
    phone: "+1 (555) 012-3456",
    company: "Legal Associates",
    visitDate: "2024-01-15T16:30:00Z",
    status: "cancelled",
    purpose: "Legal Consultation",
    host: "Chris Martin",
    badgeNumber: "V010"
  }
] 