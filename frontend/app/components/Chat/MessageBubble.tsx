'use client'

import { Bot, User, Database, History, Copy, Check, Clock } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Message } from './ChatWindow'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isAi = message.role === 'assistant'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'flex gap-3 md:gap-5 group w-full',
        isAi ? 'flex-row' : 'flex-row-reverse',
      )}
    >
      {/* 1. Dynamic Avatar */}
      <div
        className={cn(
          'w-9 h-9 md:w-10 md:h-10 rounded-lg shrink-0 flex items-center justify-center border transition-all duration-500 mt-1',
          isAi
            ? 'bg-slate-900 border-[#ff4f00]/30 shadow-[0_0_20px_rgba(255,79,0,0.1)] group-hover:border-[#ff4f00]/60'
            : 'bg-slate-800 border-slate-700 group-hover:border-slate-500',
        )}
      >
        {isAi ? (
          <Bot
            className={cn(
              'w-5 h-5 transition-colors',
              isAi ? 'text-[#ff4f00]' : 'text-white',
            )}
          />
        ) : (
          <User className='w-5 h-5 text-slate-400' />
        )}
      </div>

      {/* 2. Message Container */}
      <div
        className={cn(
          'flex flex-col gap-2.5 min-w-0',
          isAi ? 'max-w-[85%] md:max-w-[75%]' : 'max-w-[80%] items-end',
        )}
      >
        {/* Timestamp & Metadata Header */}
        <div className='flex items-center gap-3 px-1'>
          <span className='text-[8px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-1'>
            <Clock size={8} />
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {!isAi && (
            <span className='text-[8px] font-black uppercase tracking-widest text-[#ff4f00]/60'>
              User_Uplink
            </span>
          )}
        </div>

        {/* 3. Main Bubble Block */}
        <div
          className={cn(
            'relative p-4 md:p-5 rounded-2xl text-[12px] md:text-sm leading-relaxed border transition-all',
            isAi
              ? 'bg-slate-900/80 border-slate-800 text-slate-300 rounded-tl-none'
              : 'bg-[#ff4f00] border-[#ff4f00] text-white rounded-tr-none shadow-[0_10px_20px_rgba(255,79,0,0.15)]',
          )}
        >
          {/* Markdown Support for AI Responses */}
          <div className='prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800'>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag='div'
                      className='rounded-md my-2 text-[10px] md:text-xs border border-slate-800'
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className='bg-slate-800 px-1 rounded text-[#ff4f00]'
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

          {/* Hidden Copy Button - appears on hover */}
          <button
            onClick={handleCopy}
            className={cn(
              'absolute top-2 right-2 p-2 rounded-md bg-slate-950/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all border border-slate-800',
              !isAi && 'hidden',
            )}
          >
            {copied ? (
              <Check className='w-3 h-3 text-green-500' />
            ) : (
              <Copy className='w-3 h-3 text-slate-400 hover:text-white' />
            )}
          </button>
        </div>

        {/* 4. AI Forensics (RAG Metadata) */}
        {isAi && (
          <div className='flex flex-wrap gap-2 items-center px-1'>
            {message.source && (
              <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/5 border border-blue-500/10'>
                <Database className='w-3 h-3 text-blue-500/70' />
                <span className='text-[8px] font-black uppercase tracking-[0.15em] text-blue-500/70'>
                  Source: {message.source}
                </span>
              </div>
            )}

            {message.isFromMemory && (
              <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff4f00]/5 border border-[#ff4f00]/10'>
                <History className='w-3 h-3 text-[#ff4f00]/70' />
                <span className='text-[8px] font-black uppercase tracking-[0.15em] text-[#ff4f00]/70'>
                  Memory_Recalled
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
