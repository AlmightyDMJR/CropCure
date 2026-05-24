'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_QUESTIONS = [
  '🌿 How do I treat leaf blight?',
  '🌦️ Best crops for monsoon season?',
  '🐛 How to identify & control aphids?',
  '💧 Irrigation tips for wheat?',
]

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm **CropCure AI** 🌱 — your expert agricultural assistant. Ask me anything about crops, plant diseases, pests, weather impact, or farming techniques!",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [messages, isOpen])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    setShowSuggestions(false)
    const userMessage: Message = { role: 'user', content: trimmed }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      const reply: string = data.reply ?? ''
      if (res.ok && reply.trim()) {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply.trim() }])
      } else {
        const errMsg = data.error
          ? `⚠️ ${data.error}`
          : '⚠️ Sorry, I could not get a response. Please try again.'
        setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Network error. Please check your connection and try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const formatMessage = (content: string) => {
    // Basic markdown-like formatting: **bold**, newlines
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="chatbot-toggle-btn"
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open CropCure AI chat"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 60%, #14532d 100%)',
          boxShadow: '0 4px 24px 0 rgba(22,163,74,0.45)',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="3" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-green-400 pointer-events-none" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col"
            style={{
              width: 'min(96vw, 400px)',
              height: 'min(80vh, 580px)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 24px 64px 0 rgba(0,0,0,0.22), 0 2px 12px 0 rgba(22,163,74,0.12)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              }}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 6v6l4 2" />
                  <circle cx="18" cy="5" r="3" fill="white" stroke="none" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">CropCure AI</p>
                <p className="text-green-100 text-xs">Crop · Plant · Weather Expert</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                <span className="text-green-100 text-xs">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{
                background: 'var(--bg, #f8fafc)',
                scrollbarWidth: 'thin',
                scrollbarColor: '#bbf7d0 transparent',
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z" />
                        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-md'
                        : 'text-slate-800 dark:text-slate-100 rounded-bl-md border border-slate-100 dark:border-slate-700'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg,#16a34a,#15803d)' }
                        : { background: 'var(--surface, #ffffff)' }
                    }
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start gap-2"
                >
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z" />
                      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-md border border-slate-100 dark:border-slate-700 flex items-center gap-1.5"
                    style={{ background: 'var(--surface, #ffffff)' }}
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suggested questions */}
              {showSuggestions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-1"
                >
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 px-1">Suggested questions:</p>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q.replace(/^[^\s]+\s/, ''))}
                        className="text-left text-xs px-3 py-2 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="flex-shrink-0 px-3 py-3 border-t border-slate-100 dark:border-slate-700"
              style={{ background: 'var(--surface, #ffffff)' }}
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  id="chatbot-input"
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about crops, plants, weather…"
                  disabled={isLoading}
                  className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500 transition disabled:opacity-60"
                  style={{ minHeight: '42px', maxHeight: '100px' }}
                />
                <motion.button
                  id="chatbot-send-btn"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.93 }}
                  aria-label="Send message"
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    boxShadow: '0 2px 12px rgba(22,163,74,0.35)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-center text-[10px] text-slate-300 dark:text-slate-600 mt-2">
                Powered by CropCure AI · Press Enter to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
