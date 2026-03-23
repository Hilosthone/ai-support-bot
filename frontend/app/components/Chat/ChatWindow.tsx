'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Bot,
  User,
  Database,
  History,
  Sparkles,
  Loader2,
  Trash2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import MessageBubble from './MessageBubble'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  source?: string
  isFromMemory?: boolean
  timestamp: Date
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [mounted, setMounted] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const savedId = sessionStorage.getItem('support_session_id')
    if (savedId) {
      setSessionId(savedId)
    } else {
      const newId = `SNTL-${Math.random().toString(36).substring(7).toUpperCase()}`
      setSessionId(newId)
      sessionStorage.setItem('support_session_id', newId)
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    const currentInput = input
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch(
        'https://ai-support-bot-blo4.onrender.com/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            question: currentInput,
          }),
        },
      )

      if (!response.ok) throw new Error('Neural core timeout')

      const data = await response.json()

      // LOGGING: Crucial for debugging why the AI isn't seeing the file
      console.log('RAG Payload Received:', data)

      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        // Handling multiple possible backend response keys
        content:
          data.answer ||
          data.reply ||
          data.response ||
          (typeof data === 'string' ? data : 'No readable response from core.'),
        // If your backend isn't returning source_documents, this will fallback
        source:
          data.source_documents?.[0]?.metadata?.source ||
          (data.source_documents
            ? 'Internal Vector Store'
            : 'General Knowledge'),
        isFromMemory: data.used_history || false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])

      // Alert user if sources are missing despite indexing
      if (!data.source_documents || data.source_documents.length === 0) {
        console.warn(
          'Backend returned no source documents. Check vector DB sync.',
        )
      }
    } catch (error) {
      toast.error('Uplink Failed', {
        description:
          'Connection lost or backend error. Check console for logs.',
      })
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'Neural core offline. If you just uploaded a file, the indexing process might still be ongoing.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = async () => {
    if (window.confirm('Wipe current session history?')) {
      try {
        await fetch(
          `https://ai-support-bot-blo4.onrender.com/session/${sessionId}`,
          { method: 'DELETE' },
        )
        setMessages([])
        toast.success('Terminal Cleared')
      } catch (e) {
        setMessages([])
      }
    }
  }

  if (!mounted) return null

  return (
    <div className='flex flex-col h-full overflow-hidden bg-slate-950/50 selection:bg-[#ff4f00]/30'>
      {/* Header */}
      <div className='px-4 md:px-6 py-3 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between shrink-0'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <div className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' />
            <span className='text-[9px] font-black uppercase tracking-[0.2em] text-slate-400'>
              Uplink: {sessionId}
            </span>
          </div>
          <div className='hidden sm:flex items-center gap-2 border-l border-slate-800 pl-4'>
            <History className='w-3 h-3 text-slate-500' />
            <span className='text-[8px] font-bold uppercase tracking-widest text-slate-500'>
              RAG_Core: Active
            </span>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <button
            onClick={clearChat}
            className='p-1.5 hover:bg-red-500/10 rounded transition-colors group'
          >
            <Trash2 className='w-3.5 h-3.5 text-slate-600 group-hover:text-red-500' />
          </button>
          <Sparkles className='w-3.5 h-3.5 text-[#ff4f00] animate-pulse' />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar scroll-smooth'
      >
        <AnimatePresence mode='popLayout' initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='h-full flex flex-col items-center justify-center opacity-30'
            >
              <Bot className='w-12 h-12 text-slate-500 mb-6' />
              <p className='text-[10px] font-black uppercase tracking-[0.4em] text-center'>
                Neural_Interface_Ready
                <br />
                <span className='text-slate-600 font-mono mt-2 block'>
                  Waiting for user input...
                </span>
              </p>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <MessageBubble message={msg} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex gap-4'
          >
            <div className='w-8 h-8 rounded-sm bg-[#ff4f00] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,79,0,0.3)]'>
              <Loader2 className='w-5 h-5 text-white animate-spin' />
            </div>
            <div className='px-5 py-3 bg-slate-900 border border-slate-800 rounded-sm flex gap-1.5 items-center'>
              <span className='w-1 h-1 bg-[#ff4f00] rounded-full animate-bounce [animation-delay:-0.3s]' />
              <span className='w-1 h-1 bg-[#ff4f00] rounded-full animate-bounce [animation-delay:-0.15s]' />
              <span className='w-1 h-1 bg-[#ff4f00] rounded-full animate-bounce' />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className='p-4 md:p-8 bg-slate-950 border-t border-slate-900'>
        <div className='relative max-w-5xl mx-auto group'>
          <div className='absolute -inset-0.5 bg-gradient-to-r from-[#ff4f00]/20 to-transparent rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500' />
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder='Ask about the knowledge base...'
            className='relative w-full bg-slate-900/80 border border-slate-800 rounded-xl py-4 px-6 pr-16 text-xs font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#ff4f00]/50 transition-all'
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className='absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-slate-500 hover:text-[#ff4f00] disabled:opacity-20 transition-all'
          >
            <Send className='w-5 h-5' />
          </button>
        </div>
        <div className='mt-4 flex flex-wrap items-center justify-between gap-4 max-w-5xl mx-auto px-2'>
          <div className='flex gap-6'>
            <div className='flex items-center gap-2'>
              <Database className='w-3 h-3 text-[#ff4f00]' />
              <span className='text-[9px] font-black text-slate-500 uppercase tracking-widest'>
                Vector_DB: Online
              </span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-[9px] font-black text-green-500/60 uppercase tracking-tighter animate-pulse'>
              System_Stable
            </span>
            <div className='w-1 h-1 bg-green-500 rounded-full' />
          </div>
        </div>
      </div>
    </div>
  )
}
