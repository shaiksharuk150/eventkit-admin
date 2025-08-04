import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const leadsCollection = collection(db, 'leads')
    const leadsSnapshot = await getDocs(leadsCollection)
    const leads = leadsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const leadData = await request.json()
    const leadsCollection = collection(db, 'leads')
    const newLead = {
      ...leadData,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    const docRef = await addDoc(leadsCollection, newLead)
    return NextResponse.json({ id: docRef.id, ...newLead }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
