'use client'

import { Bot, Cpu, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoadingBubble() {
  return (
    <div className='flex gap-4 md:gap-8 w-full animate-in fade-in duration-700'>
      {/* 1. Avatar Section - Matches MessageBubble 12x12 size */}
      <div className='flex flex-col items-center shrink-0'>
        <div className='w-12 h-12 rounded-2xl bg-slate-900 border border-[#ff4f00]/20 flex items-center justify-center relative overflow-hidden shadow-lg'>
          <Bot className='w-6 h-6 text-[#ff4f00] animate-pulse z-10' />
          {/* Subtle Scanning Effect */}
          <div className='absolute inset-0 bg-gradient-to-t from-[#ff4f00]/10 via-transparent to-transparent animate-pulse' />
        </div>
      </div>

      {/* 2. Content Block */}
      <div className='flex flex-col gap-3 max-w-3xl flex-1'>
        {/* Header: Processing Status */}
        <div className='flex items-center gap-3 px-1'>
          <span className='text-[10px] font-black uppercase tracking-[0.25em] text-[#ff4f00]/60 flex items-center gap-2'>
            <Sparkles size={10} className='animate-spin-slow' />
            Sentinel_Thinking...
          </span>
          <div className='h-[1px] w-12 bg-gradient-to-r from-[#ff4f00]/20 to-transparent' />
        </div>

        {/* 3. The "Thinking" Bubble - Matches AI Message Style */}
        <div className='relative p-6 md:p-8 bg-slate-900/30 backdrop-blur-sm border border-white/5 rounded-[1.5rem] rounded-tl-none flex items-center gap-6 group'>
          {/* Animated Dots */}
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-[#ff4f00]/30 animate-bounce [animation-delay:-0.3s]' />
            <span className='w-2 h-2 rounded-full bg-[#ff4f00]/60 animate-bounce [animation-delay:-0.15s]' />
            <span className='w-2 h-2 rounded-full bg-[#ff4f00] animate-bounce' />
          </div>

          {/* Status Text */}
          <div className='flex flex-col'>
            <span className='text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]'>
              Querying_Neural_Core
            </span>
            <span className='text-[8px] font-mono text-slate-700 uppercase tracking-widest mt-0.5'>
              Searching vector space...
            </span>
          </div>

          {/* Decorative Corner Icon */}
          <Cpu className='absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800 opacity-50' />
        </div>
      </div>
    </div>
  )
}
