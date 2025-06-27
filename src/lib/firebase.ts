import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaeS6YRf7B72x09lhWMPzv-Rh9zZHxjd0",
  authDomain: "blurmy-561d3.firebaseapp.com",
  projectId: "blurmy-561d3",
  storageBucket: "blurmy-561d3.firebasestorage.app",
  messagingSenderId: "116277489351",
  appId: "1:116277489351:web:930da1cc1f4c65a6fc98e2",
  measurementId: "G-KLYK62CN2V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions for user profile
export interface UserProfile {
  uid: string;
  email: string;
  rawProfileData: string;
  apiKey: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createUserProfile = async (
  profile: Omit<UserProfile, "createdAt" | "updatedAt">
) => {
  try {
    const userRef = doc(db, "users", profile.uid);
    const now = new Date();
    await setDoc(userRef, {
      ...profile,
      createdAt: now,
      updatedAt: now,
    });
    return true;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export default app;
