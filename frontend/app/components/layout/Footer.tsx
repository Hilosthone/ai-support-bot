'use client'

import React from 'react'
import Link from 'next/link'
import {
  FaShareNodes,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
} from 'react-icons/fa6'
import Button from '../shared/Button'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Quick links',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Live demo', href: '#chat-section' },
        { name: 'How it works', href: '#how-it-works' },
        { name: 'Use case', href: '#use-case' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Contact Us', href: '#' },
        { name: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
      ],
    },
  ]

  const socialLinks = [
    { Icon: FaShareNodes, label: 'Share', color: 'text-slate-600' },
    { Icon: FaInstagram, label: 'Instagram', color: 'text-blue-700' },
    { Icon: FaXTwitter, label: 'X (Twitter)', color: 'text-blue-600' },
    { Icon: FaLinkedinIn, label: 'LinkedIn', color: 'text-blue-800' },
  ]

  return (
    <footer className='w-full'>
      {/* 1. Docs / Integrations Section */}
      <section id='docs' className='bg-[#050505] py-24 px-20 text-center'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter'>
            Docs / Integrations
          </h2>
          <p className='text-slate-400 font-medium mb-12'>Easy to Integrate</p>

          <div className='flex flex-col gap-4 max-w-md mx-auto'>
            {[
              'Zapier support',
              'REST API access',
              'Web embed script',
              'CRM integrations',
            ].map((link) => (
              <button
                key={link}
                className='w-full py-4 rounded-full border border-slate-800 text-slate-300 font-bold hover:bg-white hover:text-black transition-all duration-300'
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Final CTA Section */}
      <section className='py-24 px-6 bg-white text-center'>
        <div className='max-w-4xl mx-auto bg-slate-50/50 border border-slate-100 rounded-[3rem] p-12 md:p-16'>
          <h2 className='text-3xl md:text-4xl font-black text-slate-900 mb-6'>
            Let AI Handle Your Customer Support
          </h2>
          <p className='text-slate-500 font-medium mb-10 max-w-md mx-auto'>
            Save time, reduce workload, and delight your customers.
          </p>
          <Button className='bg-[#0D47A1] text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-200'>
            Get started for free
          </Button>
        </div>
      </section>

      {/* 3. Main Footer Bottom */}
      <div className='bg-[#C7E0F8A3] lg:bg-[#EEF4FF] pt-20 pb-10 px-6'>
        <div className='max-w-[1440px] mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 mb-16'>
            {/* Branding Column - Centered on mobile, Left on LG */}
            <div className='flex flex-col items-center lg:items-start text-center lg:text-left'>
              <h3 className='text-2xl font-black text-slate-900 mb-4'>
                Customer support AI
              </h3>
              <p className='text-slate-500 font-medium max-w-sm mb-8 leading-relaxed'>
                Upload your business data, chat with the AI, and watch it learn
                in real-time.
              </p>

              {/* Social Icons - Center on Mobile, Left on LG */}
              <div className='flex justify-center lg:justify-start gap-3 mb-8 lg:mb-0'>
                {socialLinks.map(({ Icon, label, color }, idx) => (
                  <button
                    key={idx}
                    aria-label={label}
                    className='w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform'
                  >
                    <Icon size={20} className={color} />
                  </button>
                ))}
              </div>
            </div>

            {/* Link Sections - Stacked on mobile, Grid on LG */}
            {footerSections.map((section) => (
              <div
                key={section.title}
                className='flex flex-col items-center lg:items-start text-center lg:text-left'
              >
                <h4 className='font-black text-slate-900 text-lg mb-6 lg:mb-8 uppercase tracking-widest'>
                  {section.title}
                </h4>
                <ul className='space-y-4 lg:space-y-6'>
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className='text-slate-500 font-semibold hover:text-[#0D47A1] transition-colors'
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright Bottom */}
          <div className='pt-8 border-t border-slate-900/10 text-center'>
            <p className='text-slate-500 text-[13px] font-medium leading-relaxed max-w-md mx-auto'>
              © {currentYear} SupportAI. All rights reserved. <br />
              Built to simplify customer conversations with AI.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}