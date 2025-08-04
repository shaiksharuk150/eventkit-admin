import { db } from '@/lib/firebase'
import { doc, updateDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updatedData = await request.json()
    const leadDoc = doc(db, 'leads', id)
    await updateDoc(leadDoc, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    })
    return NextResponse.json({ message: 'Lead updated successfully' })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const leadDoc = doc(db, 'leads', id)
    await deleteDoc(leadDoc)
    return NextResponse.json({ message: 'Lead deleted successfully' })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
} 