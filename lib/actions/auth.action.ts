"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";


const ONE_WEEK = 7 * 24 * 60 * 60;


/* SIGN UP */
export const signUp = async (params: SignUpParams) => {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get()

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead."
      }
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in to continue."
    }

  } catch (e: any) {
    console.error("Error during sign up:", e);

    if (e.code === "auth/email-already-in-use") {
        return {
            success: false,
            message: "Email is already in use. Please try a different email."
        }
    }

    return {
        success: false,
        message: "An error occurred during sign up. Please try again later."
    }
  }
};


/* SIGN IN */
export const signIn = async (params: SignInParams) => {
  const {email, idToken} = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User not found. Please sign up first."
      }
    }
    
    // if user exists, set session cookie
    await setSessionCookie(idToken);
  } catch (e) {
    console.error("Error during sign in:", e);

    return {
      success: false,
      message: "An error occurred during sign in. Please try again."
    }
  }
}


/* SET SESSION COOKIE */
export const setSessionCookie = async (idToken: string) => {
  const cookieStore = await cookies()

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000 // 7 days in milliseconds
  })

  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_WEEK, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    path: '/',
    sameSite: 'lax', // Adjust as needed
  })
}


/* GETTING CURRENT USER */
export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) {
    return null; // No session cookie found
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

    if (!userRecord.exists) {
      return null; // User not found in the database
    }

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User; // Return user data with id
  } catch (e) {
    console.error("Error getting current user:", e);
    return null; // Error occurred, return null
  }
}


/* IS AUTHENTICATED OR NOT */
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
}