'use client'

import React from 'react'
import Button from '../shared/Button'
import Link from 'next/dist/client/link'

export default function Hero() {
  return (
    <section id='home' className='pt-32 pb-16 px-6 bg-[#FCFDFF]'>
      <div className='max-w-[1440px] mx-auto text-center'>
        {/* Headline */}
        <h1 className='text-4xl md:text-6xl lg:text-7xl font-black text-[#111111] leading-[1.1] mb-8'>
          Smarter Customer Support <br />
          <span className='text-[#3B82F6]'>Powered</span> By AI
        </h1>

        {/* Sub-headline */}
        <p className='max-w-2xl mx-auto text-slate-500 text-lg md:text-2xl font-medium mb-12'>
          Train A Chatbot On Your Business And Deliver Instant, Accurate
          Responses To Customers 24/7.
          <span className='block text-[#4ADE80] font-bold mt-2'>
            No Code Required
          </span>
        </p>

        {/* CTAs */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-20'>
          <Link href='#get-started' className='w-full sm:w-auto'>
            <Button className='w-full bg-[#0D47A1] text-white px-12 py-5 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 hover:-translate-y-1 transition-all'>
              Get started
            </Button>
          </Link>

          <Link href='#train-your-ai' className='w-full sm:w-auto'>
            <Button className='w-full bg-slate-500 text-white px-12 py-5 rounded-xl font-bold text-lg hover:bg-slate-600 transition-all'>
              See demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
