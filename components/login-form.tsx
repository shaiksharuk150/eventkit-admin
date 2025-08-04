'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

interface LoginFormProps extends React.ComponentProps<'div'> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const success = await login(email.trim(), password)
    
    setLoading(false)

    if (success) {
      router.replace('/visitors')
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <EventKitLogo className="w-16 h-16 mb-4" />
                <h1 className="text-2xl font-bold">Welcome to Stalls CRM</h1>
                <p className="text-muted-foreground text-balance">
                  Sign in to your account
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-destructive text-sm text-center">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/stalls_crm.png"
              alt="Stalls CRM"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{' '}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
} 