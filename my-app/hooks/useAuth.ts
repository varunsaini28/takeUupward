// hooks/useAuth.ts
'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { api } from '@/lib/api'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const signIn = async () => {
    const cred = await signInWithPopup(auth, googleProvider)
    // Upsert into Mongo right after sign-in so payment/order calls
    // always have a matching user document to attach to.
    await api.syncUser(cred.user.displayName || '', cred.user.photoURL || '')
    return cred.user
  }

  const signOutUser = () => signOut(auth)

  return { user, loading, signIn, signOut: signOutUser }
}