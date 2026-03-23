'use client'

import { useState } from 'react'
import {
  Bot,
  Shield,
  Globe,
  Cpu,
  Settings,
  Menu,
  X,
  Library,
} from 'lucide-react'
import ChatWindow from './components/Chat/ChatWindow'
import KnowledgeBase from './components/Knowledge/KnowledgeBase'
import { cn } from '@/lib/utils'

export default function SupportBotDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <main className='flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200'>
      {/* 1. Global Navigation Bar - Hidden on mobile, shown as bottom bar or sidebar on desktop */}
      <nav className='hidden md:flex w-16 border-r border-slate-800 bg-slate-950 flex-col items-center py-6 justify-between shrink-0'>
        <div className='flex flex-col items-center gap-8'>
          <div className='w-10 h-10 bg-[#ff4f00] rounded flex items-center justify-center shadow-[0_0_20px_rgba(255,79,0,0.3)]'>
            <Bot className='w-6 h-6 text-white' />
          </div>
          <div className='flex flex-col gap-6'>
            <NavItem icon={Globe} />
            <NavItem icon={Shield} />
            <NavItem icon={Cpu} />
          </div>
        </div>
        <Settings className='w-5 h-5 text-slate-600 hover:text-white cursor-pointer transition-colors' />
      </nav>

      {/* 2. Knowledge Panel - Slide-in Drawer on Mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:bg-slate-900/10',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className='p-6 border-b border-slate-800 flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-[10px] font-black uppercase tracking-[0.3em] text-[#ff4f00]'>
                Ai Support Bolt 1.0
              </span>
              <div className='h-[1px] w-12 bg-slate-800' />
            </div>
            <h2 className='text-sm font-bold tracking-tight text-white'>
              Upload your company docs and let your customers get instant,
              accurate answers — 24/7, no human needed.
            </h2>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className='md:hidden p-2 text-slate-400 hover:text-white'
          >
            <X className='w-5 h-5' />
          </button>
        </div>
        <div className='flex-1 overflow-hidden p-6'>
          <KnowledgeBase />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 3. Primary Chat Workspace */}
      <section className='flex-1 relative flex flex-col min-w-0'>
        {/* Mobile Header */}
        <header className='md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md z-30'>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='p-2 bg-slate-900 border border-slate-800 rounded-md'
          >
            <Library className='w-5 h-5 text-[#ff4f00]' />
          </button>
          <div className='flex items-center gap-2'>
            <Bot className='w-5 h-5 text-[#ff4f00]' />
            <span className='text-[10px] font-black uppercase tracking-widest'>
              Support_Bot
            </span>
          </div>
          <div className='w-9' /> {/* Spacer */}
        </header>

        {/* Decorative Grid Background */}
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.03] pointer-events-none' />

        <div className='flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 overflow-hidden'>
          <div className='w-full max-w-4xl h-full flex flex-col bg-slate-900/40 border border-slate-800 rounded-xl md:rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden'>
            <ChatWindow />
          </div>
        </div>
      </section>
    </main>
  )
}

function NavItem({ icon: Icon }: { icon: any }) {
  return (
    <div className='p-2 rounded-lg text-slate-600 hover:text-[#ff4f00] hover:bg-[#ff4f00]/5 cursor-pointer transition-all'>
      <Icon className='w-5 h-5' />
    </div>
  )
}
