'use client'

import React from 'react'
import { ArrowRight, ArrowDown } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Upload Your Content',
    description:
      'Add FAQs, documents, or website links to your knowledge base.',
  },
  {
    number: 2,
    title: 'Train the AI Bot',
    description:
      'AI learns your business instantly and prepares to help customers.',
  },
  {
    number: 3,
    title: 'Deploy Anywhere',
    description:
      'Embed on your site or connect to chat platforms with one click.',
  },
]

export default function HowItWorks() {
  return (
    <section id='how-it-works' className='py-16 px-24 bg-[#FCFDFF]'>
      <div className='max-w-[1440px] mx-auto'>
        {/* Section Header */}
        <div className='text-center mb-20'>
          <h2 className='text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter'>
            How It Works
          </h2>
          <p className='text-slate-500 font-medium max-w-xl mx-auto'>
            Everything you need to get started in 3 simple steps for automated
            support.
          </p>
        </div>

        {/* Steps Flow Container */}
        <div className='flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative'>
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              {/* Step Card */}
              <div className='flex flex-col items-center text-center flex-1 max-w-xs relative group'>
                {/* Number Circle */}
                <div className='w-20 h-20 bg-[#A855F7] text-white rounded-full flex items-center justify-center text-3xl font-black mb-8 shadow-xl shadow-purple-100 group-hover:scale-110 transition-transform duration-300 relative z-10'>
                  {step.number}
                </div>

                {/* Text Content */}
                <h3 className='text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight'>
                  {step.title}
                </h3>
                <p className='text-slate-500 font-medium leading-relaxed'>
                  {step.description}
                </p>
              </div>

              {/* Responsive Arrow Connector */}
              {idx !== steps.length - 1 && (
                <div className='flex items-center justify-center py-4 md:py-0 md:px-4'>
                  {/* Desktop Arrow (Visible on MD and up) */}
                  <ArrowRight
                    className='hidden md:block text-slate-200 animate-pulse'
                    size={40}
                    strokeWidth={3}
                  />
                  {/* Mobile Arrow (Visible on SM) */}
                  <ArrowDown
                    className='md:hidden text-slate-200 animate-bounce'
                    size={32}
                    strokeWidth={3}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
