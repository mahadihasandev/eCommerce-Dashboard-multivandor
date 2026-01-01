import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Error() {
  const navigate = useNavigate()
const param=useParams()


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient- from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-lg bg-[#0b1320] rounded-2xl shadow-2xl ring-1 ring-red-700/30 border border-red-600/20 overflow-hidden">
        <div className="p-8 flex gap-6 items-start">
          <div className="">
            <div className="h-16 w-16 rounded-full bg-red-600/10 flex items-center justify-center ring-1 ring-red-600/30">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86A9 9 0 1021 12M12 3v1" />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-white text-2xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-gray-300">
              {param.error?param.error:"Network not responding"}.Try refreshing or go back to the dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Retry
              </button>

              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 bg-transparent border border-gray-700 text-gray-200 text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none"
              >
                Go to Dashboard
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Error code: <span className="text-red-400">ERR-001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error