"use client"

import * as React from "react"
import {
  Building2,
  Users,
} from "lucide-react"

import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'

// EventKit Logo Component
function EventKitLogo({ className }: { className?: string }) {
  return (
    <svg 
      width="31" 
      height="30" 
      viewBox="0 0 31 30" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_i_10612_1961)">
        <path d="M15.6406 0C21.6032 0 24.5848 0.000215621 26.7383 1.41016C27.7318 2.06072 28.5809 2.90974 29.2314 3.90332C30.641 6.0567 30.6406 9.03801 30.6406 15C30.6406 20.9625 30.6413 23.9442 29.2314 26.0977C28.5809 27.0913 27.7319 27.9402 26.7383 28.5908C24.5848 30.0007 21.6031 30 15.6406 30C9.67864 30 6.69733 30.0004 4.54395 28.5908C3.55037 27.9403 2.70134 27.0912 2.05078 26.0977C0.640841 23.9442 0.640625 20.9626 0.640625 15C0.640625 9.03774 0.641012 6.05672 2.05078 3.90332C2.70136 2.90967 3.5503 2.06073 4.54395 1.41016C6.69735 0.000386862 9.67837 1.22686e-10 15.6406 0ZM17.9834 6.00879C16.3437 5.5202 14.5653 5.75567 13.0117 6.5293C10.2536 7.90278 8.16347 10.9453 8.07715 15.127C7.09883 14.9765 6.25286 14.7146 5.59961 14.3584C4.79413 13.9192 3.77415 14.1963 3.32129 14.9775C2.86847 15.7588 3.1545 16.7483 3.95996 17.1875C5.2596 17.8961 6.81703 18.2849 8.41211 18.4395C8.86697 20.4272 9.76537 21.9935 11.1084 23.0156C12.7858 24.2921 14.8575 24.4938 16.8213 23.9951C20.6519 23.0223 24.4669 19.3525 26.4229 14.3164C26.7486 13.4777 26.312 12.5415 25.4473 12.2256C24.5826 11.9097 23.6178 12.3334 23.292 13.1719C21.598 17.5337 18.4626 20.2233 15.9746 20.8555C14.7793 21.159 13.8493 20.975 13.1748 20.4619C12.6988 20.0997 12.2136 19.4698 11.8721 18.4375C13.242 18.3125 14.6057 18.0462 15.8643 17.6533C17.7528 17.0636 19.5689 16.1379 20.7695 14.8203C22.0478 13.4175 22.6108 11.5571 21.7764 9.52734C21.0329 7.71876 19.6585 6.50797 17.9834 6.00879ZM14.54 9.41602C15.4343 8.97075 16.3129 8.90629 17.001 9.11133C17.6535 9.30588 18.2785 9.78204 18.668 10.7295C18.9667 11.4561 18.8329 12.0441 18.2617 12.6709C17.613 13.3827 16.4269 14.0686 14.8389 14.5645C13.7728 14.8973 12.598 15.1212 11.4209 15.2188C11.4724 12.0625 13.0223 10.1718 14.54 9.41602Z" fill="url(#paint0_linear_10612_1961)"/>
      </g>
      <defs>
        <filter id="filter0_i_10612_1961" x="0.640625" y="0" width="30" height="34" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_10612_1961"/>
        </filter>
        <linearGradient id="paint0_linear_10612_1961" x1="25.2397" y1="7.31248e-07" x2="-0.431018" y2="12.0517" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AEECF6"/>
          <stop offset="1" stopColor="#94B5ED"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

const data = {
  navMain: [
    {
      title: "Visitors",
      url: "/visitors",
      icon: Users,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-4 bg-transparent hover:bg-transparent"
            >
              <a href="#" className="flex items-center space-x-3">
                <div className="h-10 w-10 flex items-center justify-center">
                  <EventKitLogo className="h-8 w-8" />
                </div>
                <span className="text-lg font-bold text-gray-900">Stalls CRM</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild
                className="group relative px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900"
              >
                <a href={item.url} className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6">
                    <item.icon className="h-5 w-5 text-gray-600 group-hover:text-gray-800 group-data-[state=open]:text-gray-800 transition-colors" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 group-data-[state=open]:text-gray-900 transition-colors">
                      {item.title}
                    </span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-100 bg-gray-50/50">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
