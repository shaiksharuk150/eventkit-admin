import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/visitors')
  return null
}
 