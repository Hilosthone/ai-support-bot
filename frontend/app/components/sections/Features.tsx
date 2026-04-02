'use client'

import React from 'react'
import {
  MessageSquare,
  Database,
  Zap,
  Globe,
  BarChart3,
  ShieldCheck,
} from 'lucide-react'

const features = [
  {
    title: 'Smart AI Responses',
    description:
      'Understands context and gives human-like replies to customer inquiries instantly.',
    icon: <MessageSquare className='text-white' size={24} />,
    iconBg: 'bg-[#0D47A1]',
  },
  {
    title: 'Train With Your Data',
    description:
      'Upload PDFs, FAQs, or paste text to give your bot the specific knowledge it needs.',
    icon: <Database className='text-white' size={24} />,
    iconBg: 'bg-[#0D47A1]',
  },
  {
    title: 'Instant Replies',
    description:
      'Responds to customers in real-time, 24/7, ensuring no lead or query is ever missed.',
    icon: <Zap className='text-white' size={24} />,
    iconBg: 'bg-[#3B82F6]',
  },
  {
    title: 'Multi-Channel Support',
    description:
      'Works seamlessly on websites, WhatsApp, and more to meet customers where they are.',
    icon: <Globe className='text-white' size={24} />,
    iconBg: 'bg-[#0D47A1]',
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Track questions, performance, and satisfaction levels with detailed data insights.',
    icon: <BarChart3 className='text-white' size={24} />,
    iconBg: 'bg-[#0D47A1]',
  },
  {
    title: 'Secure & Private',
    description:
      'Your business data stays protected with enterprise-grade security and privacy.',
    icon: <ShieldCheck className='text-white' size={24} />,
    iconBg: 'bg-[#0D47A1]',
  },
]

export default function Features() {
  return (
    <section id='features' className='py-16 px-6 bg-white'>
      <div className='max-w-[1440px] mx-auto'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-5xl font-black text-slate-900 mb-4'>
            Customer Support Features
          </h2>
          <p className='text-slate-500 font-medium'>
            Everything You Need For Automated Support
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto'>
          {features.map((feature, idx) => (
            <div
              key={idx}
              className='p-8 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-6'
            >
              {/* Icon Container */}
              <div
                className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100`}
              >
                {feature.icon}
              </div>

              {/* Text Content */}
              <div>
                <h3 className='text-xl font-black text-slate-900 mb-3 uppercase tracking-tight'>
                  {feature.title}
                </h3>
                <p className='text-slate-500 font-medium leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
