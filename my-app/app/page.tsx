'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Space_Grotesk, Inter } from 'next/font/google'
import { useAuth } from '@/hooks/useAuth'
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment'

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-display' })
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' })

// ---- Signature mark: an ascending trajectory line, echoed in the logo and the hero ----
const AscendMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path d="M4 24 L13 15 L18 20 L28 8" stroke="#FFB648" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 8 H28 V15" stroke="#FFB648" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Decorative pattern only — real UPI/QR payment is handled inside Razorpay
// Checkout.js itself (it has its own UPI tab with a real, order-linked QR).
// This is just visual dressing for the modal, not a functional code.
const QRMark = () => (
  <svg viewBox="0 0 132 132" className="h-full w-full" aria-hidden="true">
    <rect width="132" height="132" rx="12" fill="#F5F3EE" />
    {(() => {
      const cells: React.ReactElement[] = []
      const size = 6
      const gap = 2
      const cols = 14
      const seed = [
        1,1,1,1,1,1,1,0,1,0,1,1,1,1,
        1,0,0,0,0,0,1,0,0,1,0,0,0,1,
        1,0,1,1,1,0,1,0,1,0,1,1,0,1,
        1,0,1,1,1,0,1,1,0,1,0,1,0,1,
        1,0,1,1,1,0,1,0,1,1,1,0,0,1,
        1,0,0,0,0,0,1,0,0,0,1,0,1,1,
        1,1,1,1,1,1,1,0,1,0,0,1,0,1,
        0,0,0,1,0,0,0,0,0,1,1,0,1,0,
        1,1,0,0,1,1,0,1,1,0,0,1,0,1,
        1,0,1,0,1,0,1,1,0,1,1,1,0,0,
        1,0,0,1,0,1,0,0,1,1,1,1,1,1,
        1,1,1,0,1,0,1,0,1,0,0,0,0,1,
        0,0,0,0,0,0,0,0,1,1,0,1,0,1,
        1,1,1,1,1,1,1,0,0,0,1,0,1,0,
      ]
      seed.forEach((v, i) => {
        if (!v) return
        const row = Math.floor(i / cols)
        const col = i % cols
        cells.push(
          <rect
            key={i}
            x={10 + col * (size + gap)}
            y={10 + row * (size + gap)}
            width={size}
            height={size}
            fill="#0F1B2D"
          />
        )
      })
      return cells
    })()}
  </svg>
)

const GoogleMark = () => (
  <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z" />
    <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35.1 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.6 5.1C9.9 39.7 16.4 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.8l6.6 5.6C41.5 36.4 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5z" />
  </svg>
)

const CoursePage = () => {
  const router = useRouter()
  const { user, signIn, signOut } = useAuth()
  const { pay } = useRazorpayPayment()

  const [loginOpen, setLoginOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setError(null)
    setSigningIn(true)
    try {
      await signIn()
      setLoginOpen(false)
    } catch {
      setError('Sign-in failed or was cancelled')
    } finally {
      setSigningIn(false)
    }
  }

  const handlePay = async () => {
    setError(null)

    // Payment requires a signed-in user (order must attach to someone).
    if (!user) {
      setPaymentOpen(false)
      setLoginOpen(true)
      return
    }

    setPaying(true)
    await pay(
      'cloud-computing',
      user.email || '',
      () => {
        setPaying(false)
        setPaymentOpen(false)
        router.push('/cloudComputing')
      },
      (msg) => {
        setPaying(false)
        setError(msg)
      }
    )
  }

  return (
    <main className={`${display.variable} ${body.variable} min-h-screen bg-[#0F1B2D] text-[#F5F3EE]`} style={{ fontFamily: 'var(--font-body)' }}>

      {/* ---------- Navbar ---------- */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0F1B2D]/85 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <AscendMark className="h-8 w-8" />
            <span
              className="text-xl tracking-tight text-[#F5F3EE]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              takeuupward
            </span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full" />
              )}
              <span className="hidden text-sm text-[#94A3B8] sm:inline">{user.displayName}</span>
              <button
                onClick={() => signOut()}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-[#F5F3EE] transition hover:border-[#FFB648]/60 hover:bg-white/10"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-[#F5F3EE] transition hover:border-[#FFB648]/60 hover:bg-white/10"
            >
              Log in
            </button>
          )}
        </nav>
      </header>

      {/* ---------- Login modal ---------- */}
      {loginOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          onClick={() => setLoginOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#16263D] p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center gap-2">
              <AscendMark className="h-6 w-6" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>takeuupward</span>
            </div>
            <h2 className="mb-1 text-lg font-semibold text-[#F5F3EE]" style={{ fontFamily: 'var(--font-display)' }}>
              Welcome back
            </h2>
            <p className="mb-6 text-sm text-[#94A3B8]">Sign in to pick up where you left off.</p>

            {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}

            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#F5F3EE] py-2.5 text-sm font-medium text-[#0F1B2D] transition hover:opacity-90 disabled:opacity-60"
            >
              <GoogleMark />
              {signingIn ? 'Signing in…' : 'Continue with Google'}
            </button>

            <button
              onClick={() => setLoginOpen(false)}
              className="mt-4 w-full text-center text-xs text-[#94A3B8] hover:text-[#F5F3EE]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ---------- Payment modal ---------- */}
      {paymentOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          onClick={() => setPaymentOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#16263D] p-8 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-[#5EEAD4]">CLOUD COMPUTING</p>
                <h2
                  className="text-lg text-[#F5F3EE]"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
                >
                  Unlock this course
                </h2>
              </div>
              <span
                className="text-2xl text-[#FFB648]"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
              >
                ₹19
              </span>
            </div>

            {/* Decorative QR — the real UPI flow happens inside Razorpay
                Checkout.js once you tap the button below. */}
            <div className="mb-4 flex flex-col items-center rounded-xl border border-white/10 bg-[#0F1B2D] p-5">
              <div className="h-36 w-36">
                <QRMark />
              </div>
              <p className="mt-3 text-xs text-[#94A3B8]">Or scan via UPI in the checkout that opens</p>
            </div>

            <div className="mb-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-[#94A3B8]">or</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}

            <button
              onClick={handlePay}
              disabled={paying}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFB648] py-2.5 text-sm font-semibold text-[#0F1B2D] transition hover:opacity-90 disabled:opacity-60"
            >
              {paying ? 'Processing…' : 'Pay ₹19 with Razorpay'}
            </button>

            <button
              onClick={() => setPaymentOpen(false)}
              className="mt-4 w-full text-center text-xs text-[#94A3B8] hover:text-[#F5F3EE]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden px-6 py-24">
        {/* ambient ascending line, echoing the logo mark, quiet in the background */}
        <svg
          viewBox="0 0 1200 500"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
          preserveAspectRatio="none"
        >
          <path
            d="M0 420 L280 260 L460 340 L760 100 L1000 180 L1200 20"
            stroke="#FFB648"
            strokeWidth="3"
            fill="none"
          />
        </svg>

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-block rounded-full border border-[#5EEAD4]/30 bg-[#5EEAD4]/10 px-4 py-1 text-xs font-medium tracking-wide text-[#5EEAD4]">
            Learning, without the friction
          </span>
          <h1
            className="text-4xl leading-tight sm:text-6xl"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            We make the climb easier.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-[#94A3B8] sm:text-lg">
            Real skills, taught in plain language, so every step up feels like the obvious next one.
          </p>
        </div>
      </section>

      {/* ---------- Courses ---------- */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-[#94A3B8]">
          Featured course
        </h2>

        <button
          onClick={() => setPaymentOpen(true)}
          className="group flex w-full max-w-sm flex-col items-start rounded-2xl border border-white/10 bg-[#16263D] p-6 text-left transition hover:-translate-y-1 hover:border-[#FFB648]/50 hover:shadow-[0_20px_40px_-20px_rgba(255,182,72,0.35)]"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5EEAD4]/10">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path
                d="M7 18a4 4 0 01-.6-7.96A5 5 0 0116.9 9.05 4.5 4.5 0 0117 18H7z"
                stroke="#5EEAD4"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="mb-2 text-xs font-medium tracking-wide text-[#5EEAD4]">CLOUD</span>
          <h3
            className="mb-2 text-xl text-[#F5F3EE]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            Cloud Computing
          </h3>
          <p className="mb-5 text-sm text-[#94A3B8]">
            Go from first principles to deploying real infrastructure, one clear step at a time.
          </p>

          <span className="inline-flex items-center gap-1 text-sm font-medium text-[#FFB648]">
            View course
            <span className="transition group-hover:translate-x-1">→</span>
          </span>
        </button>
      </section>
    </main>
  )
}

export default CoursePage