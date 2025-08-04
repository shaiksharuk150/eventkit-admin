import { VisitorsTable } from './components/visitors-table'
import { visitorsData } from './data'

export default function VisitorsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Visitors</h2>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <VisitorsTable data={visitorsData} />
      </div>
    </div>
  )
} 