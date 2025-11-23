import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Mock user type for development without Firebase
export interface MockUser {
  uid: string;
  email: string | null;
  displayName?: string;
  getIdToken: () => Promise<string>;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let auth;

// Check if we should use mock auth (development mode without valid Firebase creds)
const isUsingMockAuth = 
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('dev-') ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('AIza');

try {
  if (!isUsingMockAuth) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
} catch (err) {
  console.warn('Firebase initialization failed, using mock auth:', err);
}

export { isUsingMockAuth };
export { auth };
export default app;
