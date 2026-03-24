'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileStatus {
  file: File
  status: 'idle' | 'uploading' | 'success' | 'error'
  errorDetail?: string
}

interface UploadZoneProps {
  onUploadComplete?: () => void
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [fileQueue, setFileQueue] = useState<FileStatus[]>([])
  const [isOverallUploading, setIsOverallUploading] = useState(false)

  const startAutoSync = useCallback(
    async (newFiles: File[]) => {
      setIsOverallUploading(true)

      // Get current session to ensure the frontend knows which context we are in
      const currentSession =
        sessionStorage.getItem('support_session_id') || 'GUEST'

      const newItems = newFiles.map((f) => ({
        file: f,
        status: 'uploading' as const,
      }))
      setFileQueue((prev) => [...prev, ...newItems])

      const formData = new FormData()
      newFiles.forEach((file) => {
        // Must match: files: List[UploadFile] = File(...)
        formData.append('files', file)
      })

      try {
        const response = await fetch(
          'https://ai-support-bot-blo4.onrender.com/admin/upload',
          {
            method: 'POST',
            // Note: Content-Type is NOT set manually to allow browser to set boundary
            body: formData,
          },
        )

        const data = await response.json().catch(() => null)

        if (!response.ok) {
          const errorMessage = data?.detail
            ? typeof data.detail === 'string'
              ? data.detail
              : JSON.stringify(data.detail)
            : 'Neural Ingestion Failed'
          throw new Error(errorMessage)
        }

        // Update local queue status
        setFileQueue((prev) =>
          prev.map((item) =>
            newFiles.some((f) => f.name === item.file.name)
              ? { ...item, status: 'success' }
              : item,
          ),
        )

        toast.success(`${newFiles.length} units synchronized`, {
          icon: <CheckCircle2 className='w-3 h-3 text-green-500' />,
          className:
            'text-[10px] font-black uppercase tracking-widest bg-slate-950 border-slate-800 text-slate-200',
        })

        if (onUploadComplete) onUploadComplete()
      } catch (error: any) {
        const errorMsg = error.message || 'Network Error'

        setFileQueue((prev) =>
          prev.map((item) =>
            newFiles.some((f) => f.name === item.file.name)
              ? { ...item, status: 'error', errorDetail: errorMsg }
              : item,
          ),
        )

        toast.error('Sync Interrupted', {
          description: errorMsg,
          className:
            'text-[10px] font-black uppercase tracking-widest bg-slate-950 border-red-900 text-red-500',
        })
      } finally {
        setIsOverallUploading(false)
      }
    },
    [onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files.length > 0 && startAutoSync(files),
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/csv': ['.csv'],
    },
    disabled: isOverallUploading,
  })

  const removeFile = (fileName: string) => {
    setFileQueue((prev) => prev.filter((item) => item.file.name !== fileName))
  }

  return (
    <div className='space-y-4'>
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

        {isOverallUploading && (
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-[#ff4f00]/5 to-transparent animate-pulse' />
        )}

        <div className='w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center relative z-10'>
          {isOverallUploading ? (
            <Loader2 className='w-5 h-5 text-[#ff4f00] animate-spin' />
          ) : (
            <Upload
              className={cn(
                'w-5 h-5',
                isDragActive ? 'text-[#ff4f00]' : 'text-slate-500',
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
          <p className='text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tight'>
            PDF • TXT • DOCX • CSV
          </p>
        </div>
      </div>

      {/* File Progress List */}
      <div className='space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar'>
        {fileQueue.map((item, index) => (
          <div
            key={`${item.file.name}-${index}`}
            className={cn(
              'flex items-center justify-between p-3 border rounded-lg transition-all animate-in fade-in slide-in-from-left-2',
              item.status === 'uploading'
                ? 'bg-slate-900 border-[#ff4f00]/30'
                : item.status === 'success'
                  ? 'bg-slate-900/40 border-green-500/20'
                  : 'bg-red-500/5 border-red-500/20',
            )}
          >
            <div className='flex items-center gap-3 min-w-0'>
              {item.status === 'uploading' ? (
                <Loader2 className='w-3 h-3 text-[#ff4f00] animate-spin shrink-0' />
              ) : item.status === 'success' ? (
                <CheckCircle2 className='w-3 h-3 text-green-500 shrink-0' />
              ) : (
                <AlertCircle className='w-3 h-3 text-red-500 shrink-0' />
              )}
              <div className='flex flex-col truncate'>
                <span className='text-[10px] font-bold text-slate-300 truncate max-w-[150px]'>
                  {item.file.name}
                </span>
                <span
                  className={cn(
                    'text-[8px] uppercase font-black tracking-tighter',
                    item.status === 'error' ? 'text-red-500' : 'text-slate-500',
                  )}
                >
                  {item.status === 'error' ? item.errorDetail : item.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => removeFile(item.file.name)}
              className='text-slate-600 hover:text-red-500 transition-colors p-1'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}