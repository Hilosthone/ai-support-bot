'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function UploadZone() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
  })

  const removeFile = (name: string) => {
    setFiles(files.filter((f) => f.name !== name))
  }

  return (
    <div className='space-y-4'>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3',
          isDragActive
            ? 'border-[#ff4f00] bg-[#ff4f00]/5'
            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700',
        )}
      >
        <input {...getInputProps()} />
        <div className='w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center'>
          <Upload
            className={cn(
              'w-5 h-5',
              isDragActive ? 'text-[#ff4f00]' : 'text-slate-400',
            )}
          />
        </div>
        <div className='text-center'>
          <p className='text-[10px] font-black uppercase tracking-widest text-slate-200'>
            Drop Company Docs
          </p>
          <p className='text-[9px] text-slate-500 mt-1 uppercase'>
            PDF or TXT up to 10MB
          </p>
        </div>
      </div>

      {/* File Preview List */}
      <div className='space-y-2'>
        {files.map((file) => (
          <div
            key={file.name}
            className='flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg group'
          >
            <div className='flex items-center gap-3 min-w-0'>
              <File className='w-4 h-4 text-[#ff4f00] shrink-0' />
              <span className='text-[10px] font-bold text-slate-300 truncate'>
                {file.name}
              </span>
            </div>
            <button
              onClick={() => removeFile(file.name)}
              className='text-slate-600 hover:text-red-500 transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <button
          className='w-full py-3 bg-[#ff4f00] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md hover:bg-[#ff4f00]/90 transition-all shadow-[0_0_20px_rgba(255,79,0,0.2)]'
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className='w-4 h-4 animate-spin mx-auto' />
          ) : (
            'Sync to Knowledge Base'
          )}
        </button>
      )}
    </div>
  )
}
