'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || "There was an error processing your authentication request. Please check your credentials and try again."
  
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
      {/* SaaS Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-md w-full backdrop-blur-xl bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-red-400 mb-4 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-neutral-100 mb-2">Authentication Failed</h1>
        <p className="text-neutral-400 mb-6">{message}</p>
        <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4">
          Return to Login
        </a>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]" />}>
      <ErrorContent />
    </Suspense>
  )
}
