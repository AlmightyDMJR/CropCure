export default function SourceNote() {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
      <span>
        Treatment informed by peer-reviewed plant & crop pathology research · Explore studies at{' '}
        <a
          href="https://consensus.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-600 transition-colors"
        >
          Ollama AI & consensus.app
        </a>
      </span>
    </div>
  )
}
