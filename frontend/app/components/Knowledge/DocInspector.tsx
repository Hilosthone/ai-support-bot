'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  RefreshCw,
  HardDrive,
  Search,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DocInspector() {
  const [docs, setDocs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDocs = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        'https://ai-support-bot-blo4.onrender.com/admin/docs',
      )
      const data = await response.json()
      setDocs(data.doc_ids || [])
    } catch (error) {
      console.error('Vector Registry Link Failed', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
    const interval = setInterval(fetchDocs, 15000) // Auto-poll every 15s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between px-1'>
        <div className='flex items-center gap-2'>
          <HardDrive className='w-3 h-3 text-slate-600' />
          <span className='text-[9px] font-black text-slate-500 uppercase tracking-widest'>
            Indexed_Units
          </span>
        </div>
        <button
          onClick={fetchDocs}
          disabled={loading}
          className='p-1 hover:bg-slate-800 rounded transition-colors'
        >
          <RefreshCw
            className={cn('w-3 h-3 text-slate-600', loading && 'animate-spin')}
          />
        </button>
      </div>

      <div className='space-y-2'>
        {docs.length === 0 && !loading ? (
          <div className='p-6 border border-dashed border-slate-800 rounded-xl text-center'>
            <Search className='w-4 h-4 text-slate-700 mx-auto mb-2' />
            <p className='text-[8px] font-bold text-slate-600 uppercase tracking-tighter'>
              Registry_Empty
            </p>
          </div>
        ) : (
          docs.map((doc, i) => (
            <div
              key={i}
              className='flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 group hover:border-[#ff4f00]/30 transition-all'
            >
              <div className='w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800 group-hover:border-[#ff4f00]/20'>
                <FileText className='w-4 h-4 text-slate-600 group-hover:text-[#ff4f00] transition-colors' />
              </div>
              <div className='flex flex-col min-w-0 flex-1'>
                <span className='text-[10px] font-bold text-slate-300 truncate tracking-tight'>
                  {doc}
                </span>
                <div className='flex items-center gap-1 mt-0.5'>
                  <CheckCircle2 className='w-2.5 h-2.5 text-green-500/60' />
                  <span className='text-[7px] font-black text-slate-600 uppercase'>
                    Synchronized
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}