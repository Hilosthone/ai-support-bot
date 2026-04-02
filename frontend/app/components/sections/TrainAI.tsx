'use client'

import React from 'react'
import { Bot, User, Share2, Zap, Brain } from 'lucide-react'
import Button from '../shared/Button'

export default function TrainAI() {
  const chatExample = [
    {
      role: 'ai',
      content: "Our Delivery Takes 3 - 5 Days And We Don't Ship On Sundays",
      isNew: false,
    },
    {
      role: 'user',
      content:
        'Got It! I Have Learnt Your Delivery Policy. I Will Now Respond To Customers Using This Information',
      isNew: false,
    },
    {
      role: 'ai',
      content: 'We Also Offer Free Returns Within 7 Days',
      isNew: true,
    },
    {
      role: 'user',
      content: 'Noted, Return Policy Updated.',
      isNew: true,
    },
  ]

  return (
    <section id='train-your-ai' className='py-8 px-6 bg-[#FCFDFF]'>
      <div className='max-w-[1440px] mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-5xl font-black text-slate-900 mb-4'>
            Train Your AI (Live Chat)
          </h2>
        </div>

        {/* Chat Interface Container */}
        <div className='max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden'>
          {/* Chat Header */}
          <div className='p-6 border-b border-slate-50 flex items-center gap-4'>
            <div className='w-12 h-12 bg-[#0D47A1] rounded-full flex items-center justify-center text-white'>
              <Bot size={24} />
            </div>
            <div>
              <h4 className='font-bold text-slate-900'>ChatBotAI</h4>
              <div className='flex items-center gap-1.5'>
                <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                <span className='text-xs font-bold text-slate-400 uppercase'>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          <div className='p-8 flex flex-col gap-6 bg-slate-50/30'>
            {chatExample.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'ai'
                      ? 'bg-[#0D47A1] text-white'
                      : 'bg-white border border-slate-200 text-blue-600'
                  }`}
                >
                  {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl font-medium text-sm shadow-sm ${
                    msg.role === 'ai'
                      ? 'bg-[#0D47A1] text-white rounded-tl-none'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tr-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Footer / Action */}
          <div className='p-8 bg-white border-t border-slate-50 text-center'>
            <Button className='bg-[#3B82F6] text-white px-16 py-5 rounded-2xl font-black text-lg uppercase tracking-tight shadow-xl shadow-blue-100 hover:scale-105 transition-transform'>
              Train AI
            </Button>
          </div>
        </div>

        {/* Secondary Actions (Desktop View) */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8'>
          {[
            { icon: <Zap size={20} />, label: 'Preview Response' },
            { icon: <Share2 size={20} />, label: 'Deploy Bot' },
            { icon: <Brain size={20} />, label: 'Train AI' },
          ].map((item, idx) => (
            <button
              key={idx}
              className='flex items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow font-bold text-slate-600'
            >
              {item.icon}
              <span className='text-sm'>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
