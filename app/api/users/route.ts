import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
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
} from "firebase/firestore";
import { type User } from "@/types";

const COLLECTION_NAME = "users";

// GET all users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // If ID is provided, get single user
    if (id) {
      const userRef = doc(db, COLLECTION_NAME, id);
      const userSnap = await getDoc(userRef);
        
      if (!userSnap.exists()) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      
      const user = {
        ...userSnap.data(),
        user_id: userSnap.id,
      } as User;
      
      return NextResponse.json(user);
    }

      // Get all users
    const usersRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map(doc => ({
      ...doc.data(),
      user_id: doc.id,
    })) as User[];

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
      }
}

// POST - Create new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'roles'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
}

    // Check if email already exists
    const usersRef = collection(db, COLLECTION_NAME);
    const q = query(usersRef, where("email", "==", body.email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Add new user
    const docRef = await addDoc(usersRef, {
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    
    const newUser = {
      ...body,
      user_id: docRef.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { user_id, ...updateData } = body;
    
    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userRef = doc(db, COLLECTION_NAME, user_id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // If email is being updated, check for duplicates
    if (updateData.email) {
      const usersRef = collection(db, COLLECTION_NAME);
      const q = query(
        usersRef, 
        where("email", "==", updateData.email)
      );
      const querySnapshot = await getDocs(q);
      
      const duplicateUser = querySnapshot.docs.find(
        doc => doc.id !== user_id
      );
      
      if (duplicateUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
    }
    }

    // Update user
    await updateDoc(userRef, {
      ...updateData,
      updated_at: new Date().toISOString(),
    });

    const updatedUser = {
      ...updateData,
      user_id,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const userRef = doc(db, COLLECTION_NAME, id);
    const userSnap = await getDoc(userRef);
      
    if (!userSnap.exists()) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Delete user
    await deleteDoc(userRef);

    return NextResponse.json({ 
      success: true,
      message: "User deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
