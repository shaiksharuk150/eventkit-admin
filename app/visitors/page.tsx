"use client"

import { useEffect, useState } from 'react'
import { VisitorsTable } from './components/visitors-table'
import { Visitor } from '@/app/visitors/data'
import { streamCurrentUserVisitors, getCurrentUserData } from '../../dbQueryFirebase'
import { useAuth } from '@/components/auth-provider'

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        const userDataFromFirebase = await getCurrentUserData(user.uid)
        setUserData(userDataFromFirebase)
        
        // Now stream visitors for this user
        const unsubscribe = streamCurrentUserVisitors(
          userDataFromFirebase,
          (querySnapshot: any) => {
            const response = querySnapshot.docs.map((docSnapshot: any) => {
              return { ...docSnapshot.data(), docId: docSnapshot.id } as Visitor
            })
            console.log('Visitors data:', response)
            setVisitors(response)
            setLoading(false)
          },
          (error: any) => {
            console.error('Error fetching visitors:', error)
            setLoading(false)
          }
        )

        return () => {
          if (unsubscribe) {
            unsubscribe()
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600">Loading visitors...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Visitors Table */}
      <VisitorsTable data={visitors} userData={userData} />
    </div>
  )
} 