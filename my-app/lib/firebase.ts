// lib/firebase.ts
'use client'

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// This config is safe to expose client-side — it's not a secret.
// Firebase project access is controlled by Security Rules, not by hiding this.
const firebaseConfig = {
  apiKey: 'AIzaSyBnAEPgvUzkF8Ej2kcf9iQIaBPJy9teKIk',
  authDomain: 'takeuforward-939b9.firebaseapp.com',
  projectId: 'takeuforward-939b9',
  storageBucket: 'takeuforward-939b9.firebasestorage.app',
  messagingSenderId: '389493689579',
  appId: '1:389493689579:web:08edc0bd03c4a1531c02ae',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()