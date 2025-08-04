'use client'

import { usePathname } from 'next/navigation'
import { LogOutIcon, UserCircle, ChevronDown } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getCurrentUserData } from '@/dbQueryFirebase'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SiteHeader() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return
      
      try {
        const userDataFromFirebase = await getCurrentUserData(user.uid)
        setUserData(userDataFromFirebase)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [user])

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/visitors':
        return 'Visitors'
      case '/dashboard':
        return 'Dashboard'
      default:
        return 'Stalls CRM'
    }
  }

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  // Use the complete user data if available, otherwise fall back to basic auth data
  const displayName = userData?.name || user?.displayName || user?.email?.split('@')[0] || 'User'
  const initial = displayName?.charAt(0)?.toUpperCase() || '?'
  
  // Generate consistent color based on name
  const colors = [
    'bg-gradient-to-r from-emerald-500 to-emerald-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'bg-gradient-to-r from-red-500 to-red-600',
    'bg-gradient-to-r from-yellow-500 to-yellow-600',
    'bg-gradient-to-r from-indigo-500 to-indigo-600',
    'bg-gradient-to-r from-pink-500 to-pink-600',
    'bg-gradient-to-r from-teal-500 to-teal-600',
    'bg-gradient-to-r from-amber-500 to-amber-600',
    'bg-gradient-to-r from-cyan-500 to-cyan-600',
  ]
  
  const colorIndex = displayName?.charCodeAt(0) % colors.length || 0
  const avatarColor = colors[colorIndex]

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle(pathname)}</h1>
        <div className="ml-auto flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-8">
                <div className={`h-6 w-6 rounded-full ${avatarColor} flex items-center justify-center`}>
                  <span className="text-white text-xs font-medium">
                    {initial}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{displayName}</span>
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userData?.email || user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
