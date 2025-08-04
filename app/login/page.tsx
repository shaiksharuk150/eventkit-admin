import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
} 