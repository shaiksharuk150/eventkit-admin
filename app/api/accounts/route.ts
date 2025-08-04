import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';

const COLLECTION_NAME = 'accounts';

// Create Account
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // company_id is required
    if (!body.company_id) {
      return NextResponse.json({ error: 'company_id is required' }, { status: 400 });
    }
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    const newAccount = {
      ...body,
      account_id: docRef.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json(newAccount, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}

// Get Accounts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      // Get a single account by id
      const accountRef = doc(db, COLLECTION_NAME, id);
      const accountSnap = await getDoc(accountRef);
      if (!accountSnap.exists()) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      }
      const account = { ...accountSnap.data(), account_id: accountSnap.id };
      return NextResponse.json(account, { status: 200 });
    } else {
      // Get all accounts
      const accountsRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(accountsRef);
      const accounts = snapshot.docs.map(doc => ({ ...doc.data(), account_id: doc.id }));
      return NextResponse.json(accounts, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}

// Update Account
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }
    const body = await req.json();
    const accountRef = doc(db, COLLECTION_NAME, id);
    const accountSnap = await getDoc(accountRef);
    if (!accountSnap.exists()) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    await updateDoc(accountRef, {
      ...body,
      updated_at: new Date().toISOString(),
    });
    const updatedAccount = { ...body, account_id: id, updated_at: new Date().toISOString() };
    return NextResponse.json(updatedAccount, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}

// Delete Account
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }
    const accountRef = doc(db, COLLECTION_NAME, id);
    const accountSnap = await getDoc(accountRef);
    if (!accountSnap.exists()) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    await deleteDoc(accountRef);
    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
