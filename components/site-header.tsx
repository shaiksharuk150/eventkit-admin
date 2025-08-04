'use client'

import { usePathname } from 'next/navigation'
import { LogOutIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'

export function SiteHeader() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/visitors':
        return 'Visitors'
      case '/dashboard':
        return 'Dashboard'
      default:
        return 'EventKit Admin'
    }
  }

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle(pathname)}</h1>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
