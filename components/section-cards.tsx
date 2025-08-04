import { UsersIcon, TrendingUpIcon } from "lucide-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3 lg:px-6">
      <Card>
        <CardHeader className="relative">
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            1,234
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <TrendingUpIcon className="size-4" />
            +12.5% this month
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="relative">
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            45,678
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <TrendingUpIcon className="size-4" />
            +5.2% this month
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="relative">
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            5,678
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <UsersIcon className="size-4" />
            +10% from last month
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
