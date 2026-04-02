'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Eraser } from 'lucide-react'
import Button from '../shared/Button'
import { toast } from 'react-hot-toast'

interface Message {
  role: 'user' | 'bot'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content:
        'Hello! I have processed your knowledge base. How can I help you today?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(
        'https://ai-support-bot-blo4.onrender.com/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({
            session_id: 'user-session-001', // In a real app, generate a unique ID
            question: userMessage,
          }),
        },
      )

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content:
            data.reply || "I couldn't find an answer to that in the documents.",
        },
      ])
    } catch (error) {
      toast.error('Connection lost. Please try again.')
      console.error('Chat Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      { role: 'bot', content: 'Chat cleared. How else can I help?' },
    ])
  }

  return (
    <div className='max-w-4xl mx-auto px-4 w-full'>
      <div className='bg-white border border-slate-200 rounded-[2rem] shadow-2xl shadow-blue-900/5 overflow-hidden flex flex-col h-[600px]'>
        {/* Header */}
        <div className='bg-[#0D47A1] p-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center'>
              <Bot className='text-white' size={24} />
            </div>
            <div>
              <h3 className='text-white font-bold leading-none'>
                AI Support Assistant
              </h3>
              <span className='text-white/60 text-xs font-medium uppercase tracking-wider'>
                Online • Knowledge Base Loaded
              </span>
            </div>
          </div>
          <button
            onClick={clearChat}
            className='p-2 hover:bg-white/10 rounded-lg text-white/70 transition-colors'
            title='Clear Chat'
          >
            <Eraser size={20} />
          </button>
        </div>

        {/* Messages Container */}
        <div
          ref={scrollRef}
          className='flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50'
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-slate-200' : 'bg-[#0D47A1]/10'
                }`}
              >
                {msg.role === 'user' ? (
                  <User size={16} className='text-slate-600' />
                ) : (
                  <Bot size={16} className='text-[#0D47A1]' />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[75%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#0D47A1] text-white rounded-tr-none shadow-lg shadow-blue-900/10'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className='flex items-start gap-3'>
              <div className='w-8 h-8 rounded-full bg-[#0D47A1]/10 flex items-center justify-center shrink-0'>
                <Bot size={16} className='text-[#0D47A1]' />
              </div>
              <div className='bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm'>
                <Loader2 className='animate-spin text-[#0D47A1]' size={18} />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className='p-6 bg-white border-t border-slate-100'>
          <form
            onSubmit={handleSendMessage}
            className='relative flex items-center gap-3'
          >
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Ask a question about your business...'
              className='w-full pl-6 pr-16 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-[#0D47A1]/20 outline-none font-medium text-slate-900 transition-all'
            />
            <Button
              type='submit'
              disabled={isLoading || !input.trim()}
              className='absolute right-2 bg-[#0D47A1] text-white p-2.5 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100'
            >
              <Send size={20} />
            </Button>
          </form>
          <p className='text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest'>
            Powered by SupportAI Core
          </p>
        </div>
      </div>
    </div>
  )
}
