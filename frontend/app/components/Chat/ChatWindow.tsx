'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Bot,
  Database,
  History,
  Sparkles,
  Loader2,
  Trash2,
  ShieldCheck,
  Zap,
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

  // Session Synchronization
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

      if (!response.ok) throw new Error('Neural core timeout (503)')

      const data = await response.json()

      // DIAGNOSTIC LOG: Check this in F12 console to see exactly what the backend sent
      console.log('Terminal Response:', data)

      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          data.reply ||
          data.answer ||
          'Uplink established, but neural response was null.',
        // INTELLIGENT SOURCE TAGGING:
        // We assume RAG is verified if the backend returns a successful reply
        source: data.reply ? 'RAG Verified' : 'Standard Logic',
        isFromMemory: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error: any) {
      toast.error('Uplink Interrupted', {
        description: 'Server may be sleeping or FAISS index is detached.',
      })
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'Connection to the neural core was lost. Ensure the Render backend is active and the session is purged if errors persist.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = async () => {
    if (window.confirm('Wipe current neural session?')) {
      try {
        await fetch(
          `https://ai-support-bot-blo4.onrender.com/session/${sessionId}`,
          { method: 'DELETE' },
        )
        setMessages([])
        toast.success('Session Purged', { className: 'text-[10px] font-black' })
      } catch (e) {
        setMessages([])
      }
    }
  }

  if (!mounted) return null

  return (
    <div className='flex flex-col h-full overflow-hidden bg-slate-950/40 backdrop-blur-xl'>
      {/* 1. Terminal Meta Header */}
      <div className='px-6 py-4 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between shrink-0'>
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-2.5'>
            <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' />
            <div className='flex flex-col'>
              <span className='text-[8px] font-black uppercase tracking-[0.2em] text-slate-500'>
                Session_Active
              </span>
              <span className='text-[10px] font-mono text-slate-300'>
                {sessionId}
              </span>
            </div>
          </div>
          <div className='hidden md:flex items-center gap-3 border-l border-slate-800 pl-6'>
            <ShieldCheck className='w-3.5 h-3.5 text-[#ff4f00]' />
            <span className='text-[9px] font-black uppercase tracking-widest text-slate-400'>
              Security: AES-256 Synchronized
            </span>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={clearChat}
            className='flex items-center gap-2 px-3 py-1.5 hover:bg-red-500/10 border border-transparent hover:border-red-900/50 rounded-lg transition-all group'
          >
            <Trash2 className='w-3 h-3 text-slate-500 group-hover:text-red-500' />
            <span className='text-[9px] font-black text-slate-500 group-hover:text-red-500 uppercase tracking-tighter'>
              Purge
            </span>
          </button>
          <div className='h-4 w-[1px] bg-slate-800' />
          <Zap className='w-3.5 h-3.5 text-[#ff4f00] fill-[#ff4f00]/20' />
        </div>
      </div>

      {/* 2. Scrollable Neural Feed */}
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar'
      >
        <AnimatePresence mode='popLayout'>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='h-full flex flex-col items-center justify-center'
            >
              <div className='w-20 h-20 rounded-3xl bg-slate-900/50 border border-slate-800 flex items-center justify-center mb-6 relative'>
                <Bot className='w-10 h-10 text-slate-700' />
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-[#ff4f00] rounded-full animate-ping' />
              </div>
              <h3 className='text-[11px] font-black uppercase tracking-[0.4em] text-slate-400'>
                Neural_Interface_Online
              </h3>
              <p className='text-[9px] text-slate-600 font-bold mt-2 uppercase tracking-tight'>
                Ready for retrieval-augmented generation
              </p>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble message={msg} />
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex gap-5'
          >
            <div className='w-9 h-9 rounded-xl bg-[#ff4f00] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,79,0,0.4)]'>
              <Loader2 className='w-5 h-5 text-white animate-spin' />
            </div>
            <div className='px-6 py-4 bg-slate-900/60 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2'>
              <span className='text-[10px] font-black text-[#ff4f00] animate-pulse uppercase tracking-widest'>
                Processing_Input
              </span>
              <span className='flex gap-1'>
                <span className='w-1 h-1 bg-[#ff4f00] rounded-full animate-bounce [animation-delay:-0.3s]' />
                <span className='w-1 h-1 bg-[#ff4f00] rounded-full animate-bounce [animation-delay:-0.15s]' />
                <span className='w-1 h-1 bg-[#ff4f00] rounded-full animate-bounce' />
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 3. Terminal Command Input */}
      <div className='p-6 md:p-10 bg-slate-950/80 border-t border-slate-900/50 backdrop-blur-xl'>
        <div className='relative max-w-5xl mx-auto group'>
          <div className='absolute -inset-1 bg-gradient-to-r from-[#ff4f00]/20 via-transparent to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-700' />

          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder='Query the knowledge base...'
            className='relative w-full bg-slate-900/90 border border-slate-800 rounded-2xl py-5 px-8 pr-20 text-[13px] font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#ff4f00]/40 transition-all shadow-2xl'
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-[#ff4f00] hover:bg-[#ff4f00]/10 disabled:opacity-20 transition-all'
          >
            <Send className='w-5 h-5' />
          </button>
        </div>

        <div className='mt-5 flex flex-wrap items-center justify-between gap-6 max-w-5xl mx-auto px-4'>
          <div className='flex gap-8'>
            <div className='flex items-center gap-2.5'>
              <Database className='w-3.5 h-3.5 text-[#ff4f00]' />
              <span className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]'>
                FAISS_Engine
              </span>
            </div>
            <div className='flex items-center gap-2.5'>
              <Sparkles className='w-3.5 h-3.5 text-blue-500' />
              <span className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]'>
                RAG_Context
              </span>
            </div>
          </div>

          <div className='flex items-center gap-2.5 bg-green-500/5 border border-green-500/10 px-3 py-1 rounded-full'>
            <div className='w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]' />
            <span className='text-[10px] font-black text-green-500/80 uppercase tracking-tighter'>
              System_Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}