
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FileText,
  ShieldCheck,
  Zap,
  Trash2,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import UploadZone from './UploadZone'
import { toast } from 'sonner'

interface DocAsset {
  id: string
  name: string
  status: 'indexed'
}

export default function KnowledgeBase() {
  const [assets, setAssets] = useState<DocAsset[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 1. Fetch real document IDs from the backend
  const fetchDocs = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        'https://ai-support-bot-blo4.onrender.com/admin/docs',
      )
      if (!response.ok) throw new Error('Failed to synchronize library')

      const data = await response.json()

      // Transform backend doc_ids into display assets
      const formattedAssets: DocAsset[] = (data.doc_ids || []).map(
        (id: string) => ({
          id: id,
          name: `IDX_${id.substring(0, 8)}`,
          status: 'indexed',
        }),
      )

      setAssets(formattedAssets)
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Library Sync Failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 2. Clear Knowledge Base logic
  const clearLibrary = async () => {
    if (!confirm('Destroy all indexed vectors? This cannot be undone.')) return

    try {
      // Assuming a DELETE or specific endpoint exists for purging
      toast.info('Purging local vector store...')
      // Placeholder for actual purge logic if backend supports it
      setAssets([])
    } catch (e) {
      toast.error('Purge failed')
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  return (
    <div className='flex flex-col h-full gap-8'>
      {/* Ingestion Area */}
      <div>
        <h3 className='text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-1'>
          Data_Ingestion
        </h3>
        {/* We pass fetchDocs so UploadZone can trigger a refresh after success */}
        <UploadZone onUploadComplete={fetchDocs} />
      </div>

      {/* Active Assets List */}
      <div className='flex-1 flex flex-col min-h-0'>
        <div className='flex items-center justify-between mb-4 px-1'>
          <h3 className='text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]'>
            Active_Assets
            <span className='ml-2 text-[#ff4f00]'>{assets.length} Units</span>
          </h3>
          <div className='flex gap-2'>
            <button
              onClick={fetchDocs}
              disabled={isLoading}
              className='p-1 hover:bg-slate-800 rounded transition-colors group'
              title='Refresh Library'
            >
              <RefreshCw
                className={cn(
                  'w-3 h-3 text-slate-500 group-hover:text-[#ff4f00]',
                  isLoading && 'animate-spin',
                )}
              />
            </button>
            {assets.length > 0 && (
              <button
                onClick={clearLibrary}
                className='p-1 hover:bg-red-500/10 rounded transition-colors group'
                title='Clear All'
              >
                <Trash2 className='w-3 h-3 text-slate-600 group-hover:text-red-500' />
              </button>
            )}
          </div>
        </div>

        <div className='space-y-2 overflow-y-auto custom-scrollbar pr-2'>
          {isLoading && assets.length === 0 ? (
            <div className='flex flex-col items-center py-12 opacity-20'>
              <Loader2 className='w-6 h-6 animate-spin mb-2' />
              <p className='text-[8px] font-black uppercase tracking-widest'>
                Polling Core...
              </p>
            </div>
          ) : assets.length === 0 ? (
            <div className='p-8 border border-dashed border-slate-800 rounded-lg text-center opacity-30'>
              <p className='text-[9px] font-black uppercase tracking-widest'>
                No_Data_Found
              </p>
            </div>
          ) : (
            assets.map((asset) => (
              <div
                key={asset.id}
                className='group relative p-3 bg-slate-900/40 border border-slate-800 rounded-lg hover:border-slate-700 transition-all'
              >
                <div className='flex items-start gap-3'>
                  <div className='p-2 bg-slate-800 rounded'>
                    <FileText className='w-4 h-4 text-slate-400 group-hover:text-[#ff4f00] transition-colors' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[10px] font-bold text-slate-200 truncate'>
                      {asset.name}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-[7px] font-mono text-slate-500 uppercase'>
                        ID: {asset.id.slice(0, 15)}...
                      </span>
                      <span className='w-1 h-1 rounded-full bg-slate-700' />
                      <div className='flex items-center gap-1'>
                        <ShieldCheck className='w-2.5 h-2.5 text-green-500/50' />
                        <span className='text-[8px] font-bold text-green-500/50 uppercase tracking-tighter'>
                          Vectorized
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* System Health / Capabilities */}
      <div className='p-4 bg-[#ff4f00]/5 border border-[#ff4f00]/10 rounded-xl space-y-3'>
        <div className='flex items-center gap-2'>
          <Zap className='w-3 h-3 text-[#ff4f00]' />
          <span className='text-[9px] font-black uppercase tracking-widest text-slate-300'>
            Engine_Metrics
          </span>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <Metric
            label='Status'
            value={assets.length > 0 ? 'Synchronized' : 'Standby'}
          />
          <Metric label='Backend' value='FastAPI/Render' />
          <Metric label='Store' value='FAISS' />
          <Metric label='Logic' value='RAG-Core' />
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className='bg-slate-950/50 p-2 rounded border border-slate-800/50'>
      <p className='text-[7px] font-bold text-slate-600 uppercase tracking-tighter'>
        {label}
      </p>
      <p className='text-[9px] font-black text-slate-300 uppercase'>{value}</p>
    </div>
  )
}
