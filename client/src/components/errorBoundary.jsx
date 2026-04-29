import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('UI crashed:', error)
    console.error(info?.componentStack ?? info)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-md shadow p-6">
          <h1 className="text-lg font-semibold text-slate-900">Something went wrong</h1>
          <p className="text-sm text-slate-600 mt-2">
            Open DevTools Console to see the exact file/line. Error message:
          </p>
          <pre className="mt-3 text-xs whitespace-pre-wrap bg-slate-900 text-slate-100 rounded-md p-3 overflow-auto">
            {String(error?.message ?? error)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 active:scale-95 transition"
          >
            Reload
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary

