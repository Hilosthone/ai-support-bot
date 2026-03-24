'use client'

import { useState } from 'react'
import { FileText, ShieldCheck, Zap, Trash2, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import UploadZone from './UploadZone'

interface DocAsset {
  id: string
  name: string
  type: 'PDF' | 'TXT'
  status: 'indexed' | 'syncing'
  size: string
}

export default function KnowledgeBase() {
  // Mock data representing the "Company Brain"
  const [assets, setAssets] = useState<DocAsset[]>([
    {
      id: '1',
      name: 'refund_policy_v2.pdf',
      type: 'PDF',
      status: 'indexed',
      size: '1.2 MB',
    },
    {
      id: '2',
      name: 'api_endpoints_internal.txt',
      type: 'TXT',
      status: 'indexed',
      size: '45 KB',
    },
  ])

  return (
    <div className='flex flex-col h-full gap-8'>
      {/* 1. Ingestion Area */}
      <div>
        <h3 className='text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-1'>
          Data_Ingestion
        </h3>
        <UploadZone />
      </div>

      {/* 2. Active Assets List */}
      <div className='flex-1 flex flex-col min-h-0'>
        <h3 className='text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-1 flex justify-between'>
          Active_Assets
          <span className='text-[#ff4f00]'>{assets.length} Units</span>
        </h3>

        <div className='space-y-2 overflow-y-auto custom-scrollbar pr-2'>
          {assets.map((asset) => (
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
                    <span className='text-[8px] font-mono text-slate-500 uppercase'>
                      {asset.size}
                    </span>
                    <span className='w-1 h-1 rounded-full bg-slate-700' />
                    <div className='flex items-center gap-1'>
                      <ShieldCheck className='w-2.5 h-2.5 text-green-500/50' />
                      <span className='text-[8px] font-bold text-green-500/50 uppercase tracking-tighter'>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
                <button className='opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-500 transition-all'>
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. System Health / Capabilities */}
      <div className='p-4 bg-[#ff4f00]/5 border border-[#ff4f00]/10 rounded-xl space-y-3'>
        <div className='flex items-center gap-2'>
          <Zap className='w-3 h-3 text-[#ff4f00]' />
          <span className='text-[9px] font-black uppercase tracking-widest text-slate-300'>
            Engine_Metrics
          </span>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <Metric label='Latency' value='142ms' />
          <Metric label='Memory' value='Active' />
          <Metric label='Uptime' value='99.9%' />
          <Metric label='Model' value='GPT-4o' />
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
