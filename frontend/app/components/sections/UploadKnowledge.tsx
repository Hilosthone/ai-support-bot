// 'use client'

// import React, { useState } from 'react'
// import { Upload, FileText, Globe, Loader2 } from 'lucide-react'
// import Button from '../shared/Button'
// import { extractionService } from '../../core/services/extractionService'
// import { toast } from 'react-hot-toast'

// export default function UploadKnowledge() {
//   const [isUploading, setIsUploading] = useState(false)
//   const [url, setUrl] = useState('')

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setIsUploading(true)
//     try {
//       // Reusing extraction logic for the business knowledge
//       await extractionService.extractFromAudio(file)
//       toast.success('Knowledge Base Updated Successfully')
//     } catch (err) {
//       toast.error('Upload failed. Please try again.')
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   return (
//     <section id='get-started' className='py-24 px-6 bg-white'>
//       <div className='max-w-[1440px] mx-auto'>
//         <div className='text-center mb-16'>
//           <h2 className='text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter'>
//             Upload Your Business Knowledge
//           </h2>
//           <p className='text-slate-500 font-medium'>
//             Connect your data sources to train your AI assistant in seconds.
//           </p>
//         </div>

//         <div className='max-w-4xl mx-auto'>
//           {/* Main Upload Box */}
//           <div className='border-2 border-dashed border-slate-200 rounded-[2rem] p-12 bg-slate-50/50 text-center mb-8 hover:border-[#3B82F6] transition-colors group relative'>
//             <input
//               type='file'
//               id='file-upload'
//               className='hidden'
//               onChange={handleFileUpload}
//               accept='.pdf,.doc,.docx,.txt'
//               disabled={isUploading}
//             />

//             <div className='flex flex-col items-center'>
//               <div className='w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
//                 {isUploading ? (
//                   <Loader2 className='text-[#3B82F6] animate-spin' size={32} />
//                 ) : (
//                   <Upload className='text-[#3B82F6]' size={32} />
//                 )}
//               </div>
//               <h3 className='text-xl font-bold text-slate-900 mb-2'>
//                 Drag & drop files
//               </h3>
//               <p className='text-slate-400 text-sm mb-6 uppercase font-bold tracking-widest'>
//                 Supported formats: PDF, DOC, DOCX
//               </p>

//               <div className='flex items-center gap-2 text-[#0D47A1] font-bold mb-8 hover:underline cursor-pointer'>
//                 <FileText size={18} />
//                 <span>Paste your content</span>
//               </div>

//               {/* Polymorphic Button:
//                   Renders as a <label> linked to the hidden file input via 'htmlFor'
//               */}
//               <Button
//                 as='label'

//                 htmlFor='file-upload'
//                 className='bg-[#0D47A1] text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-100'
//               >
//                 {isUploading ? 'Processing...' : 'Upload files'}
//               </Button>
//             </div>
//           </div>

//           {/* Website Scraper Input */}
//           <div className='flex flex-col md:flex-row gap-4'>
//             <div className='flex-1 relative'>
//               <Globe
//                 className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400'
//                 size={20}
//               />
//               <input
//                 type='text'
//                 placeholder='Paste your website URL ...'
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//                 className='w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium transition-all'
//               />
//             </div>
//             <Button className='bg-slate-500 text-white px-10 py-5 rounded-2xl font-bold hover:bg-slate-600 transition-colors shadow-lg shadow-slate-100'>
//               Scan website
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

'use client'

import React, { useState } from 'react'
import { Upload, FileText, Globe, Loader2 } from 'lucide-react'
import Button from '../shared/Button'
import { toast } from 'react-hot-toast'

// Add onUploadSuccess to the props
interface UploadKnowledgeProps {
  onUploadSuccess?: () => void
}

export default function UploadKnowledge({
  onUploadSuccess,
}: UploadKnowledgeProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [url, setUrl] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create FormData - Necessary for the backend to receive an "UploadFile"
    const formData = new FormData()
    formData.append('files', file)

    setIsUploading(true)
    try {
      const response = await fetch(
        'https://ai-support-bot-blo4.onrender.com/admin/upload',
        {
          method: 'POST',
          body: formData, // Sending FormData automatically sets the correct Content-Type
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail?.[0]?.msg || 'Upload failed')
      }

      toast.success('Knowledge Base Updated Successfully')

      // Trigger the view switch to Chat
      if (onUploadSuccess) onUploadSuccess()
    } catch (err: any) {
      toast.error(err.message || 'Upload failed. Please try again.')
      console.error('Upload Error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section id='get-started' className='py-16 px-6 bg-white'>
      <div className='max-w-[1440px] mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter'>
            Upload Your Business Knowledge
          </h2>
          <p className='text-slate-500 font-medium'>
            Connect your data sources to train your AI assistant in seconds.
          </p>
        </div>

        <div className='max-w-4xl mx-auto'>
          {/* Main Upload Box */}
          <div className='border-2 border-dashed border-slate-200 rounded-[2rem] p-12 bg-slate-50/50 text-center mb-8 hover:border-[#0D47A1] transition-all group relative'>
            <input
              type='file'
              id='file-upload'
              className='hidden'
              onChange={handleFileUpload}
              accept='.pdf,.doc,.docx,.txt'
              disabled={isUploading}
            />

            <div className='flex flex-col items-center'>
              <div className='w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:shadow-blue-100'>
                {isUploading ? (
                  <Loader2 className='text-[#0D47A1] animate-spin' size={32} />
                ) : (
                  <Upload className='text-[#0D47A1]' size={32} />
                )}
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>
                {isUploading ? 'Analyzing Documents...' : 'Drag & drop files'}
              </h3>
              <p className='text-slate-400 text-sm mb-6 uppercase font-bold tracking-widest'>
                Supported formats: PDF, DOC, TXT
              </p>

              {/* Action Buttons */}
              <div className='flex flex-col items-center gap-6'>
                <Button
                  as='label'
                  htmlFor='file-upload'
                  className={`bg-[#0D47A1] text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-100 cursor-pointer hover:scale-105 transition-transform ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {isUploading ? 'Processing...' : 'Choose Files'}
                </Button>

                {/* <div className='flex items-center gap-2 text-[#0D47A1] font-bold hover:underline cursor-pointer opacity-60 hover:opacity-100 transition-opacity'>
                  <FileText size={18} />
                  <span>Or paste text content</span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Website Scraper Input */}
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Globe
                className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400'
                size={20}
              />
              <input
                type='text'
                placeholder='Paste your website URL ...'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className='w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium transition-all outline-none'
              />
            </div>
            <Button className='bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-black transition-colors shadow-lg shadow-slate-100'>
              Scan website
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}