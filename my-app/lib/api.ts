// lib/api.ts
'use client'

import { auth } from './firebase'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Grabs a fresh ID token from the currently signed-in Firebase user.
// Firebase auto-refreshes it under the hood, so this is cheap to call
// before every request rather than caching it yourself.
async function authHeader(): Promise<HeadersInit> {
  const user = auth.currentUser
  if (!user) throw new Error('Not signed in')
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  // Call once right after Firebase sign-in completes.
  syncUser: async (name: string, photoUrl: string) => {
    const res = await fetch(`${API_BASE}/api/user/sync`, {
      method: 'POST',
      headers: await authHeader(),
      body: JSON.stringify({ name, photo_url: photoUrl }),
    })
    return handle<{ id: string; email: string; name: string }>(res)
  },

  createOrder: async (courseId: string) => {
    const res = await fetch(`${API_BASE}/api/payment/order`, {
      method: 'POST',
      headers: await authHeader(),
      body: JSON.stringify({ course_id: courseId }),
    })
    return handle<{ order_id: string; amount: number; currency: string; key_id: string }>(res)
  },

  verifyPayment: async (payload: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => {
    const res = await fetch(`${API_BASE}/api/payment/verify`, {
      method: 'POST',
      headers: await authHeader(),
      body: JSON.stringify(payload),
    })
    return handle<{ status: string }>(res)
  },

  checkAccess: async (courseId: string) => {
    const res = await fetch(`${API_BASE}/api/course/${courseId}/access`, {
      method: 'GET',
      headers: await authHeader(),
    })
    return handle<{ has_access: boolean }>(res)
  },
}