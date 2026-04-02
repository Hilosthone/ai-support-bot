// import Hero from '@/app/components/sections/Hero'
// import UploadKnowledge from '@/app/components/sections/AnalyzeMeeting'
// import TrainAI from '@/app/components/sections/TrainAI'
// import Features from '@/app/components/sections/Features'
// import HowItWorks from '@/app/components/sections/HowItWorks'
// import UseCases from '@/app/components/sections/UseCases'
// import { Toaster } from 'react-hot-toast'

// export default function Home() {
//   return (
//     <main className='relative min-h-screen bg-white'>
//       {/* Toast notifications for API actions */}
//       <Toaster position='top-center' />

//       <Hero />
//       <UploadKnowledge />
//       <TrainAI />
//       <Features />
//       <HowItWorks />
//       <UseCases />
//     </main>
//   )
// }

'use client'

import React, { useState } from 'react'
import Hero from '@/app/components/sections/Hero'
import UploadKnowledge from '@/app/components/sections/UploadKnowledge'
import ChatInterface from '@/app/components/chat/ChatInterface'
import Features from '@/app/components/sections/Features'
import HowItWorks from '@/app/components/sections/HowItWorks'
import TrainYourAi from '@/app/components/sections/TrainAI' // Capitalized
import UseCases from '@/app/components/sections/UseCases'
import { Toaster } from 'react-hot-toast'

export default function Home() {
  // Logic to toggle between Upload view and Chat view
  const [isTrained, setIsTrained] = useState(false)

  return (
    <main className='relative min-h-screen bg-white'>
      {/* Toast notifications for API actions */}
      <Toaster
        position='top-center'
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0D47A1',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '12px',
          },
        }}
      />

      <Hero />

      {/* If TrainYourAi is a static section (intro), keep it here. 
         If it's part of the upload process, you might want to move it inside the !isTrained block.
      */}
      {!isTrained && <TrainYourAi />}

      {/* Conditional Rendering: Show Upload first, then Chat */}
      {!isTrained ? (
        <div className='animate-in fade-in duration-700'>
          <UploadKnowledge onUploadSuccess={() => setIsTrained(true)} />
        </div>
      ) : (
        <section
          id='chat-section'
          className='py-24 bg-slate-50 animate-in slide-in-from-bottom-10 duration-700'
        >
          <div className='max-w-[1440px] mx-auto px-6'>
            <div className='text-center mb-12'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4'>
                <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                Knowledge Base Active
              </div>
              <h2 className='text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase'>
                Chat with your AI
              </h2>
              <p className='text-slate-500 font-medium mb-6 max-w-2xl mx-auto'>
                The assistant has analyzed your data and is ready to provide
                specific insights about your business documents.
              </p>
              <button
                onClick={() => setIsTrained(false)}
                className='text-[#0D47A1] font-bold hover:text-blue-800 flex items-center gap-2 mx-auto transition-all group'
              >
                <span className='group-hover:-translate-y-1 transition-transform'>
                  ↑
                </span>
                Update Knowledge Source
              </button>
            </div>

            <ChatInterface />
          </div>
        </section>
      )}

      <Features />
      <HowItWorks />
      <UseCases />
    </main>
  )
}