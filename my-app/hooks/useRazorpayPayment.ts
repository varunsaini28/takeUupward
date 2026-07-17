// hooks/useRazorpayPayment.ts
'use client'

import { useCallback } from 'react'
import { api } from '@/lib/api'

declare global {
  interface Window {
    Razorpay: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function useRazorpayPayment() {
  // Kicks off: create order on backend -> open Checkout.js -> verify on
  // success -> caller decides what happens next (e.g. router.push).
  const pay = useCallback(
    async (courseId: string, userEmail: string, onSuccess: () => void, onError: (msg: string) => void) => {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        onError('Could not load Razorpay checkout. Check your connection.')
        return
      }

      let order
      try {
        order = await api.createOrder(courseId)
      } catch (e: any) {
        onError(e.message || 'Could not start payment')
        return
      }

      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: 'Cloud Computing Course',
        description: 'Course access',
        prefill: { email: userEmail },
        theme: { color: '#FFB648' },
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) => {
          try {
            await api.verifyPayment(response)
            onSuccess()
          } catch (e: any) {
            onError(e.message || 'Payment verification failed')
          }
        },
        modal: {
          ondismiss: () => onError('Payment cancelled'),
        },
      })

      rzp.open()
    },
    []
  )

  return { pay }
}