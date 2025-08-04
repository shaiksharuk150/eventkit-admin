import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD79M89HGlUGS1ytNN1eLgvQl19XjoOX14',
  authDomain: 'eventmanagement-6e9dc.firebaseapp.com',
  projectId: 'eventmanagement-6e9dc',
  storageBucket: 'eventmanagement-6e9dc.appspot.com',
  messagingSenderId: '416889387779',
  appId: '1:416889387779:web:fece1160b340a061658736',
  measurementId: 'G-3SQD5HFSRN',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;