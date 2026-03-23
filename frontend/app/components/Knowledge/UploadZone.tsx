'use client'

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  File,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileStatus {
  file: File
  status: 'idle' | 'uploading' | 'success' | 'error'
}

export default function UploadZone() {
  const [fileQueue, setFileQueue] = useState<FileStatus[]>([])
  const [isOverallUploading, setIsOverallUploading] = useState(false)

  // 1. Auto-Sync Logic
  const startAutoSync = useCallback(async (newFiles: File[]) => {
    setIsOverallUploading(true)

    // Add new files to the queue with 'uploading' status
    const newQueueItems = newFiles.map((f) => ({
      file: f,
      status: 'uploading' as const,
    }))
    setFileQueue((prev) => [...prev, ...newQueueItems])

    for (const file of newFiles) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch(
          'https://ai-support-bot-blo4.onrender.com/admin/upload',
          {
            method: 'POST',
            body: formData,
          },
        )

        if (!response.ok) throw new Error(`Failed to upload ${file.name}`)

        // Update individual file status to success
        setFileQueue((prev) =>
          prev.map((item) =>
            item.file === file ? { ...item, status: 'success' } : item,
          ),
        )

        toast.success(`${file.name} indexed`, {
          icon: <CheckCircle2 className='w-3 h-3 text-green-500' />,
          className:
            'text-[10px] font-bold uppercase tracking-widest bg-slate-950 border-slate-800',
        })
      } catch (error) {
        setFileQueue((prev) =>
          prev.map((item) =>
            item.file === file ? { ...item, status: 'error' } : item,
          ),
        )
        toast.error(`Sync Error: ${file.name}`)
      }
    }
    setIsOverallUploading(false)
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        startAutoSync(acceptedFiles)
      }
    },
    [startAutoSync],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    disabled: isOverallUploading,
  })

  const removeFile = (fileName: string) => {
    setFileQueue((prev) => prev.filter((item) => item.file.name !== fileName))
  }

  return (
    <div className='space-y-4'>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 relative overflow-hidden',
          isDragActive
            ? 'border-[#ff4f00] bg-[#ff4f00]/5'
            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700',
          isOverallUploading && 'opacity-50 cursor-not-allowed',
        )}
      >
        <input {...getInputProps()} />

        {/* Animated Background for Active Upload */}
        {isOverallUploading && (
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-[#ff4f00]/5 to-transparent animate-shimmer' />
        )}

        <div className='w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center relative z-10'>
          {isOverallUploading ? (
            <Loader2 className='w-5 h-5 text-[#ff4f00] animate-spin' />
          ) : (
            <Upload
              className={cn(
                'w-5 h-5',
                isDragActive ? 'text-[#ff4f00]' : 'text-slate-400',
              )}
            />
          )}
        </div>

        <div className='text-center relative z-10'>
          <p className='text-[10px] font-black uppercase tracking-widest text-slate-200'>
            {isOverallUploading
              ? 'Neural Ingestion Active...'
              : 'Drop Company Docs'}
          </p>
          <p className='text-[9px] text-slate-500 mt-1 uppercase'>
            Sync starts immediately on drop
          </p>
        </div>
      </div>

      {/* Real-time Status List */}
      <div className='space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar'>
        {fileQueue.map(({ file, status }) => (
          <div
            key={file.name}
            className={cn(
              'flex items-center justify-between p-3 border rounded-lg transition-all',
              status === 'uploading'
                ? 'bg-slate-900 border-[#ff4f00]/30'
                : status === 'success'
                  ? 'bg-slate-900/40 border-green-500/20'
                  : 'bg-slate-900 border-red-500/20',
            )}
          >
            <div className='flex items-center gap-3 min-w-0'>
              {status === 'uploading' ? (
                <Loader2 className='w-3 h-3 text-[#ff4f00] animate-spin shrink-0' />
              ) : status === 'success' ? (
                <CheckCircle2 className='w-3 h-3 text-green-500 shrink-0' />
              ) : (
                <AlertCircle className='w-3 h-3 text-red-500 shrink-0' />
              )}

              <div className='flex flex-col'>
                <span className='text-[10px] font-bold text-slate-300 truncate'>
                  {file.name}
                </span>
                <span className='text-[8px] uppercase tracking-tighter text-slate-500 font-black'>
                  {status}
                </span>
              </div>
            </div>

            <button
              onClick={() => removeFile(file.name)}
              className='text-slate-600 hover:text-red-500 transition-colors p-1'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          </div>
        ))}
      </div>

      {fileQueue.length > 0 && !isOverallUploading && (
        <div className='pt-2 text-center'>
          <p className='text-[8px] font-black uppercase tracking-[0.3em] text-slate-600'>
            Total Assets Synced:{' '}
            {fileQueue.filter((f) => f.status === 'success').length}
          </p>
        </div>
      )}
    </div>
  )
}
