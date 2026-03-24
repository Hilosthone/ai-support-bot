'use client'

import { useState } from 'react'
import {
  Bot,
  Shield,
  Globe,
  Cpu,
  Settings,
  X,
  Library,
  Activity,
  Zap,
} from 'lucide-react'
import ChatWindow from './components/Chat/ChatWindow'
import KnowledgeBase from './components/Knowledge/KnowledgeBase'
import { cn } from '@/lib/utils'

export default function SupportBotDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <main className='flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200 selection:bg-[#ff4f00]/30'>
      {/* 1. Global Navigation Bar - Desktop Sidebar */}
      <nav className='hidden md:flex w-16 border-r border-slate-800/50 bg-slate-950 flex-col items-center py-8 justify-between shrink-0 z-50'>
        <div className='flex flex-col items-center gap-10'>
          <div className='group relative cursor-pointer'>
            <div className='absolute -inset-2 bg-[#ff4f00]/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity' />
            <div className='relative w-10 h-10 bg-[#ff4f00] rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(255,79,0,0.4)]'>
              <Bot className='w-6 h-6 text-white' />
            </div>
          </div>
          <div className='flex flex-col gap-8'>
            <NavItem icon={Globe} label='Network' />
            <NavItem icon={Shield} label='Security' />
            <NavItem icon={Cpu} label='Compute' />
          </div>
        </div>
        <div className='flex flex-col gap-6 items-center'>
          <div className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
          <Settings className='w-5 h-5 text-slate-600 hover:text-white cursor-pointer transition-colors' />
        </div>
      </nav>

      {/* 2. Knowledge Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-85 bg-slate-950 border-r border-slate-800 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:relative md:translate-x-0 md:bg-transparent',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className='flex flex-col h-full bg-slate-900/10 backdrop-blur-xl'>
          <div className='p-8 border-b border-slate-800/50'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-2'>
                <Zap className='w-3 h-3 text-[#ff4f00] fill-[#ff4f00]' />
                <span className='text-[10px] font-black uppercase tracking-[0.4em] text-[#ff4f00]'>
                  Core Engine 1.0
                </span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className='md:hidden p-2 text-slate-400 hover:text-white transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <h2 className='text-lg font-bold tracking-tight text-white leading-tight'>
              Knowledge Base <span className='text-slate-500'>&</span> Training
            </h2>
            <p className='text-[11px] text-slate-500 mt-3 leading-relaxed font-medium'>
              Sync company documentation to provide instant, accurate
              RAG-powered responses.
            </p>
          </div>

          <div className='flex-1 overflow-y-auto custom-scrollbar p-6'>
            <KnowledgeBase />
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 3. Primary Chat Workspace */}
      <section className='flex-1 relative flex flex-col min-w-0 bg-slate-950'>
        {/* Universal Header (Mobile & Desktop Status) */}
        <header className='flex items-center justify-between px-6 py-4 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md z-30'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className='md:hidden p-2 bg-slate-900 border border-slate-800 rounded-lg'
            >
              <Library className='w-4 h-4 text-[#ff4f00]' />
            </button>
            <div className='flex flex-col'>
              <div className='flex items-center gap-2'>
                <h1 className='text-xs font-black uppercase tracking-widest text-white'>
                  Neural Terminal
                </h1>
                <span className='px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#ff4f00]/10 text-[#ff4f00] border border-[#ff4f00]/20'>
                  PRO
                </span>
              </div>
              <div className='flex items-center gap-1.5 mt-0.5'>
                <Activity className='w-2.5 h-2.5 text-green-500' />
                <span className='text-[9px] text-slate-500 font-bold'>
                  LATENCY: 42ms
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden sm:flex flex-col items-end mr-2'>
              <span className='text-[9px] font-black text-slate-400 uppercase tracking-tighter'>
                Server Status
              </span>
              <span className='text-[8px] text-green-500 font-bold'>
                OPERATIONAL
              </span>
            </div>
            <div className='w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden'>
              <div className='w-full h-full bg-gradient-to-tr from-[#ff4f00] to-orange-300 opacity-80' />
            </div>
          </div>
        </header>

        {/* Decorative Ambient Background */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#ff4f00]/5 rounded-full blur-[120px]' />
          <div className='absolute bottom-0 right-0 w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]' />
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.02]' />
        </div>

        {/* Chat Container */}
        <div className='flex-1 flex flex-col items-center justify-center p-4 md:p-10 z-10 overflow-hidden'>
          <div className='w-full max-w-5xl h-full flex flex-col bg-slate-900/20 border border-slate-800/60 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm overflow-hidden'>
            <ChatWindow />
          </div>
        </div>
      </section>
    </main>
  )
}

function NavItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className='group relative flex items-center justify-center p-2.5 rounded-xl text-slate-500 hover:text-[#ff4f00] hover:bg-[#ff4f00]/5 cursor-pointer transition-all duration-300'>
      <Icon className='w-5 h-5' />
      <span className='absolute left-16 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700 shadow-xl'>
        {label}
      </span>
    </div>
  )
}
