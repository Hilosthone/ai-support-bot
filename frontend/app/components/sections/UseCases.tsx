'use client'

import React from 'react'
import { ShoppingCart, Layout, GraduationCap, Briefcase } from 'lucide-react'

const cases = [
  {
    title: 'E-commerce',
    description:
      'Order tracking, returns, and product availability queries handled instantly.',
    icon: <ShoppingCart size={28} />,
  },
  {
    title: 'SaaS',
    description:
      'Onboard new users and provide 24/7 technical product support.',
    icon: <Layout size={28} />,
  },
  {
    title: 'Education',
    description:
      'Answer student FAQs and provide course information automatically.',
    icon: <GraduationCap size={28} />,
  },
  {
    title: 'Services',
    description: 'Handle appointment bookings and general service inquiries.',
    icon: <Briefcase size={28} />,
  },
]

export default function UseCases() {
  return (
    <section id='use-case' className='py-16 px-6 bg-white'>
      <div className='max-w-[1440px] mx-auto'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter'>
            Use Case
          </h2>
        </div>

        {/* Use Case Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
          {cases.map((item, idx) => (
            <div
              key={idx}
              className='bg-[#074799] p-10 rounded-[2rem] text-white flex flex-col items-center text-center group hover:bg-[#0852AD] transition-colors duration-300 shadow-xl shadow-blue-100'
            >
              {/* Icon Circle */}
              <div className='w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                {item.icon}
              </div>

              {/* Text Content */}
              <h3 className='text-2xl font-black mb-3 uppercase tracking-tight'>
                {item.title}
              </h3>
              <p className='text-blue-100 font-medium leading-relaxed'>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
