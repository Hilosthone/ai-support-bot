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
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard', {
      icon: <Terminal className='w-3 h-3' />,
      className:
        'text-[10px] font-bold uppercase tracking-widest bg-slate-900 border-slate-800 text-slate-200',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'flex gap-3 md:gap-5 group w-full mb-6',
        isAi ? 'flex-row' : 'flex-row-reverse',
      )}
    >
      {/* 1. Dynamic Avatar with Neural Glow */}
      <div
        className={cn(
          'w-9 h-9 md:w-10 md:h-10 rounded-lg shrink-0 flex items-center justify-center border transition-all duration-500 mt-1',
          isAi
            ? 'bg-slate-950 border-[#ff4f00]/20 shadow-[0_0_15px_rgba(255,79,0,0.05)] group-hover:border-[#ff4f00]/50'
            : 'bg-slate-900 border-slate-800 group-hover:border-slate-600',
        )}
      >
        {isAi ? (
          <Bot className='w-5 h-5 text-[#ff4f00]' />
        ) : (
          <User className='w-5 h-5 text-slate-400' />
        )}
      </div>

      {/* 2. Message Container */}
      <div
        className={cn(
          'flex flex-col gap-2 min-w-0',
          isAi ? 'max-w-[85%] md:max-w-[75%]' : 'max-w-[80%] items-end',
        )}
      >
        {/* Metadata Header */}
        <div className='flex items-center gap-3 px-1'>
          <span className='text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-1.5'>
            <Clock size={8} className='text-slate-700' />
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isAi && (
            <span className='text-[8px] font-black uppercase tracking-[0.2em] text-[#ff4f00]/40'>
              Neural_Output
            </span>
          )}
        </div>

        {/* 3. Main Bubble Block */}
        <div
          className={cn(
            'relative p-4 md:p-6 rounded-2xl text-[13px] md:text-sm leading-relaxed border transition-all duration-300',
            isAi
              ? 'bg-slate-900/40 backdrop-blur-sm border-slate-800/50 text-slate-300 rounded-tl-none hover:bg-slate-900/60'
              : 'bg-[#ff4f00] border-[#ff4f00] text-white rounded-tr-none shadow-[0_10px_30px_rgba(255,79,0,0.1)]',
          )}
        >
          <div className='prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800/50 selection:bg-white/20'>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  const content = String(children).replace(/\n$/, '')

                  return !inline && match ? (
                    <div className='relative group/code my-4'>
                      <div className='absolute right-2 top-2 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity'>
                        <button
                          onClick={() => handleCopy(content)}
                          className='p-1.5 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition-colors'
                        >
                          <Copy className='w-3 h-3 text-slate-400' />
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag='div'
                        className='rounded-xl !bg-slate-950 !p-4 !m-0 border border-slate-800 text-[11px] md:text-xs leading-relaxed'
                        {...props}
                      >
                        {content}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code
                      className='bg-slate-800/50 px-1.5 py-0.5 rounded text-[#ff4f00] font-mono font-medium'
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

          {/* Quick Copy for the entire message (only for AI) */}
          {isAi && (
            <button
              onClick={() => handleCopy(message.content)}
              className='absolute -right-10 top-0 p-2 text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all'
              title='Copy response'
            >
              {copied ? (
                <Check className='w-3.5 h-3.5 text-green-500' />
              ) : (
                <Copy className='w-3.5 h-3.5' />
              )}
            </button>
          )}
        </div>

        {/* 4. AI Forensics (RAG Metadata) - Sleeker Badges */}
        {isAi && (
          <div className='flex flex-wrap gap-2 items-center px-1 mt-1'>
            {message.source && (
              <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-colors group/src'>
                <Database className='w-3 h-3 text-blue-500/50 group-hover/src:text-blue-500' />
                <span className='text-[8px] font-black uppercase tracking-[0.1em] text-slate-500 group-hover/src:text-slate-300'>
                  Ref: {message.source}
                </span>
              </div>
            )}

            {message.isFromMemory && (
              <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-[#ff4f00]/30 transition-colors group/mem'>
                <History className='w-3 h-3 text-[#ff4f00]/50 group-hover/mem:text-[#ff4f00]' />
                <span className='text-[8px] font-black uppercase tracking-[0.1em] text-slate-500 group-hover/mem:text-slate-300'>
                  Neural_Recall
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
