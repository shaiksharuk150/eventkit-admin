import { collection, query, where, onSnapshot, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from './lib/firebase' // Adjust the import path as needed

// Get current logged-in user data
export const getCurrentUserData = async (uid: string) => {
  try {
    const userDoc = doc(db, 'users', uid)
    const userSnapshot = await getDoc(userDoc)
    
    if (userSnapshot.exists()) {
      return { ...userSnapshot.data(), docId: userSnapshot.id }
    } else {
      throw new Error('User not found')
    }
  } catch (error) {
    console.error('Error getting user data:', error)
    throw error
  }
}

// Stream all visitors for the organization
export const streamVisitorsByOrg = (orgId: string, snapshot: any, error: any) => {
  const visitorsQuery = query(collection(db, `${orgId}_visitors`))
  return onSnapshot(visitorsQuery, snapshot, error)
}

// Stream visitors assigned to specific user
export const streamVisitorsByUser = (orgId: string, userEmail: string, snapshot: any, error: any) => {
  const visitorsQuery = query(
    collection(db, `${orgId}_visitors`),
    where('assignedToObj.email', '==', userEmail)
  )
  return onSnapshot(visitorsQuery, snapshot, error)
}

// Stream visitors by user UID
export const streamVisitorsByUserUid = (orgId: string, userUid: string, snapshot: any, error: any) => {
  const visitorsQuery = query(
    collection(db, `${orgId}_visitors`),
    where('assignedToObj.uid', '==', userUid)
  )
  return onSnapshot(visitorsQuery, snapshot, error)
}

// Get visitors assigned to specific user (one-time fetch)
export const getVisitorsByUser = async (orgId: string, userEmail: string) => {
  try {
    const visitorsQuery = query(
      collection(db, `${orgId}_visitors`),
      where('assignedToObj.email', '==', userEmail)
    )
    const querySnapshot = await getDocs(visitorsQuery)
    
    return querySnapshot.docs.map((docSnapshot) => {
      return { ...docSnapshot.data(), docId: docSnapshot.id }
    })
  } catch (error) {
    console.error('Error getting visitors:', error)
    throw error
  }
}

// Get visitors by user UID (one-time fetch)
export const getVisitorsByUserUid = async (orgId: string, userUid: string) => {
  try {
    const visitorsQuery = query(
      collection(db, `${orgId}_visitors`),
      where('assignedToObj.uid', '==', userUid)
    )
    const querySnapshot = await getDocs(visitorsQuery)
    
    return querySnapshot.docs.map((docSnapshot) => {
      return { ...docSnapshot.data(), docId: docSnapshot.id }
    })
  } catch (error) {
    console.error('Error getting visitors:', error)
    throw error
  }
}

// Stream visitors by status for specific user
export const streamVisitorsByStatusAndUser = (
  orgId: string, 
  userEmail: string, 
  status: string, 
  snapshot: any, 
  error: any
) => {
  const visitorsQuery = query(
    collection(db, `${orgId}_visitors`),
    where('assignedToObj.email', '==', userEmail),
    where('Status', '==', status)
  )
  return onSnapshot(visitorsQuery, snapshot, error)
}

// Stream visitors by event for specific user
export const streamVisitorsByEventAndUser = (
  orgId: string, 
  userEmail: string, 
  event: string, 
  snapshot: any, 
  error: any
) => {
  const visitorsQuery = query(
    collection(db, `${orgId}_visitors`),
    where('assignedToObj.email', '==', userEmail),
    where('Event', '==', event)
  )
  return onSnapshot(visitorsQuery, snapshot, error)
}

// Get all users by organization
export const streamUsersByOrg = (orgId: string, snapshot: any, error: any) => {
  const usersQuery = query(
    collection(db, 'users'),
    where('orgId', '==', orgId)
  )
  return onSnapshot(usersQuery, snapshot, error)
}

// Get users by department in organization
export const streamUsersByDeptAndOrg = (
  orgId: string, 
  department: string[], 
  snapshot: any, 
  error: any
) => {
  const usersQuery = query(
    collection(db, 'users'),
    where('orgId', '==', orgId),
    where('department', 'array-contains-any', department)
  )
  return onSnapshot(usersQuery, snapshot, error)
}

// Example usage function for getting current user's visitors
export const getCurrentUserVisitors = async (currentUser: any) => {
  try {
    const { orgId, email, uid } = currentUser
    
    if (!orgId || !email) {
      throw new Error('User organization or email not found')
    }
    
    const visitors = await getVisitorsByUser(orgId, email)
    return visitors
  } catch (error) {
    console.error('Error getting current user visitors:', error)
    throw error
  }
}

// Example usage function for streaming current user's visitors
export const streamCurrentUserVisitors = (currentUser: any, snapshot: any, error: any) => {
  const { orgId, email } = currentUser
  
  if (!orgId || !email) {
    error(new Error('User organization or email not found'))
    return
  }
  
  return streamVisitorsByUser(orgId, email, snapshot, error)
} 