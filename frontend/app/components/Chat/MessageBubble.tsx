'use client'

import {
  Bot,
  User,
  Database,
  History,
  Copy,
  Check,
  Clock,
  Terminal,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Message } from './ChatWindow'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toast } from 'sonner'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isAi = message.role === 'assistant'

  const handleCopy = (text: string) => {
    if (typeof window === 'undefined') return
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Terminal Data Copied', {
      icon: <Terminal className='w-3 h-3 text-[#ff4f00]' />,
      className:
        'bg-slate-950 border-slate-800 text-slate-200 text-[10px] font-black uppercase tracking-widest',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'flex gap-4 md:gap-6 group w-full transition-all duration-500',
        isAi ? 'flex-row' : 'flex-row-reverse',
      )}
    >
      {/* 1. Neural Avatar with Dynamic Glow */}
      <div
        className={cn(
          'w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border transition-all duration-700 mt-1 relative',
          isAi
            ? 'bg-slate-950 border-[#ff4f00]/30 shadow-[0_0_20px_rgba(255,79,0,0.05)] group-hover:border-[#ff4f00]/60'
            : 'bg-slate-900 border-slate-800 group-hover:border-slate-500 shadow-xl',
        )}
      >
        {isAi ? (
          <>
            <Bot className='w-5 h-5 text-[#ff4f00] relative z-10' />
            <div className='absolute inset-0 bg-[#ff4f00]/5 rounded-xl blur-sm' />
          </>
        ) : (
          <User className='w-5 h-5 text-slate-400' />
        )}
      </div>

      {/* 2. Content Stack */}
      <div
        className={cn(
          'flex flex-col gap-2.5 min-w-0',
          isAi ? 'max-w-[85%] md:max-w-[80%]' : 'max-w-[80%] items-end',
        )}
      >
        {/* Header Metadata */}
        <div
          className={cn(
            'flex items-center gap-4 px-1',
            !isAi && 'flex-row-reverse',
          )}
        >
          <div className='flex items-center gap-2'>
            <Clock size={10} className='text-slate-700' />
            <span className='text-[9px] font-black uppercase tracking-widest text-slate-600'>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          {isAi && (
            <div className='flex items-center gap-2'>
              <div className='w-1 h-1 rounded-full bg-[#ff4f00] animate-pulse' />
              <span className='text-[9px] font-black uppercase tracking-[0.3em] text-[#ff4f00]/60'>
                Core_Response
              </span>
            </div>
          )}
        </div>

        {/* 3. Main Bubble */}
        <div
          className={cn(
            'relative p-5 md:p-7 rounded-2xl text-[14px] leading-relaxed border transition-all duration-500',
            isAi
              ? 'bg-slate-900/30 backdrop-blur-md border-slate-800/80 text-slate-300 rounded-tl-none hover:bg-slate-900/50 hover:border-slate-700/80'
              : 'bg-[#ff4f00] border-[#ff4f00] text-white rounded-tr-none shadow-[0_15px_40px_rgba(255,79,0,0.15)]',
          )}
        >
          <div className='prose prose-invert max-w-none prose-p:leading-relaxed selection:bg-white/20'>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  const content = String(children).replace(/\n$/, '')

                  return !inline && match ? (
                    <div className='relative group/code my-6 rounded-xl overflow-hidden border border-slate-800 shadow-2xl'>
                      <div className='flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800'>
                        <span className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>
                          {match[1]}
                        </span>
                        <button
                          onClick={() => handleCopy(content)}
                          className='p-1.5 hover:bg-slate-800 rounded transition-colors'
                        >
                          <Copy className='w-3.5 h-3.5 text-slate-500 hover:text-white' />
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag='div'
                        className='!bg-slate-950/50 !p-6 !m-0 text-[12px] leading-relaxed font-mono'
                        {...props}
                      >
                        {content}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code
                      className={cn(
                        'px-1.5 py-0.5 rounded font-mono font-bold text-[12px]',
                        isAi
                          ? 'bg-slate-800 text-[#ff4f00]'
                          : 'bg-orange-600 text-white',
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Copy Action Floating (AI Only) */}
          {isAi && (
            <button
              onClick={() => handleCopy(message.content)}
              className='absolute -right-12 top-0 p-2.5 text-slate-700 hover:text-[#ff4f00] opacity-0 group-hover:opacity-100 transition-all duration-300'
            >
              {copied ? (
                <Check className='w-4 h-4 text-green-500' />
              ) : (
                <Copy className='w-4 h-4' />
              )}
            </button>
          )}
        </div>

        {/* 4. RAG & System Diagnostics */}
        {isAi && (
          <div className='flex flex-wrap gap-3 items-center px-1 mt-1'>
            {message.source && (
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-tighter transition-all',
                  message.source === 'RAG Verified'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-slate-900 border-slate-800 text-slate-500',
                )}
              >
                <Database
                  className={cn(
                    'w-3 h-3',
                    message.source === 'RAG Verified'
                      ? 'text-green-400'
                      : 'text-slate-600',
                  )}
                />
                SOURCE: {message.source}
              </div>
            )}

            {message.isFromMemory && (
              <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 group/mem'>
                <History className='w-3 h-3 text-[#ff4f00]/50 group-hover/mem:text-[#ff4f00] transition-colors' />
                <span className='text-[9px] font-black uppercase tracking-tighter'>
                  Recall_Active
                </span>
              </div>
            )}

            <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500'>
              <ShieldCheck className='w-3 h-3 text-blue-500/50' />
              <span className='text-[9px] font-black uppercase tracking-tighter'>
                Verified_Uplink
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}