// 'use client'

// import React, { useState } from 'react'
// import Link from 'next/link'
// import { Menu, X } from 'lucide-react'

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false)

//   const navLinks = [
//     { name: 'Home', href: '#home' },
//     { name: 'Features', href: '#features' },
//     { name: 'Live demo', href: '#live-demo' },
//     { name: 'How it works', href: '#how-it-works' },
//   ]

//   return (
//     <nav className='fixed top-0 left-0 right-0 bg-white border-b border-slate-100 z-[100]'>
//       <div className='max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between relative'>
//         {/* Logo */}
//         <Link href='/' className='flex items-center z-10'>
//           <span className='text-2xl font-black tracking-tight text-slate-900'>
//             Support<span className='text-[#003D9B]'>AI</span>
//           </span>
//         </Link>

//         {/* Desktop Nav Links — centered absolutely */}
//         <div className='hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8'>
//           {navLinks.map((link, i) => (
//             <Link
//               key={link.name}
//               href={link.href}
//               className={`text-sm font-medium transition-colors duration-200 ${
//                 i === 0
//                   ? 'text-slate-900 font-semibold'
//                   : 'text-slate-500 hover:text-slate-900'
//               }`}
//             >
//               {link.name}
//             </Link>
//           ))}
//         </div>

//         {/* Desktop CTA */}
//         <div className='hidden lg:block z-10'>
//           <button
//             onClick={() =>
//               document
//                 .getElementById('get-started')
//                 ?.scrollIntoView({ behavior: 'smooth' })
//             }
//             className='bg-[#003D9B] hover:bg-[#002f7a] active:scale-95 text-white text-sm font-semibold px-8 py-3.5 rounded-lg transition-all duration-200'
//           >
//             Get started
//           </button>
//         </div>

//         {/* Mobile / MD Hamburger */}
//         <button
//           className='lg:hidden z-10 w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors'
//           onClick={() => setIsOpen(!isOpen)}
//           aria-label='Toggle menu'
//         >
//           {isOpen ? <X size={20} /> : <Menu size={20} />}
//         </button>
//       </div>

//       {/* Mobile Dropdown */}
//       {isOpen && (
//         <div className='lg:hidden bg-white border-t border-slate-100 shadow-xl'>
//           <div className='max-w-[1400px] mx-auto px-6 py-4 flex flex-col'>
//             {/* Nav Links */}
//             {navLinks.map((link, i) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 onClick={() => setIsOpen(false)}
//                 className={`flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
//                   i === 0
//                     ? 'text-[#003D9B] bg-[#003D9B]/5 font-semibold'
//                     : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
//                 }`}
//               >
//                 {link.name}
//               </Link>
//             ))}

//             {/* Divider */}
//             <div className='my-3 h-px bg-slate-100' />

//             {/* CTA */}
//             <button
//               onClick={() => {
//                 setIsOpen(false)
//                 document
//                   .getElementById('get-started')
//                   ?.scrollIntoView({ behavior: 'smooth' })
//               }}
//               className='w-full bg-[#003D9B] hover:bg-[#002f7a] active:scale-95 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200'
//             >
//               Get started
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Live demo', href: '#train-your-ai', id: 'train-your-ai' },
    { name: 'Features', href: '#features', id: 'features' },
      { name: 'How it works', href: '#how-it-works', id: 'how-it-works' },
      { name: 'Docs', href: '#docs', id: 'docs' },
  ]

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        {
          rootMargin: '-30% 0px -60% 0px', // triggers when section hits upper-mid viewport
          threshold: 0,
        },
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const linkClass = (id: string) => {
    const isActive = activeSection === id
    return [
      'relative text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-md',
      isActive
        ? 'text-[#003D9B] bg-[#003D9B]/8 font-semibold'
        : 'text-slate-500 hover:text-[#003D9B] group',
    ].join(' ')
  }

  const mobileLinkClass = (id: string) => {
    const isActive = activeSection === id
    return [
      'flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200',
      isActive
        ? 'text-[#003D9B] bg-[#003D9B]/8 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
    ].join(' ')
  }

  return (
    <nav className='fixed top-0 left-0 right-0 bg-white border-b border-slate-100 z-[100]'>
      <div className='max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between relative'>
        {/* Logo */}
        <Link href='/' className='flex items-center z-10'>
          <span className='text-2xl font-black tracking-tight text-slate-900'>
            Support<span className='text-[#003D9B]'>AI</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className='hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-2'>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={linkClass(link.id)}
            >
              {link.name}
              {/* Hover underline — only shows when NOT active */}
              {activeSection !== link.id && (
                <span className='absolute bottom-0 left-3 right-3 h-[2px] bg-[#003D9B] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full' />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className='hidden lg:block z-10'>
          <button
            onClick={() =>
              document
                .getElementById('get-started')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className='bg-[#003D9B] hover:bg-[#002f7a] active:scale-95 text-white text-sm font-semibold px-8 py-3.5 rounded-lg transition-all duration-200'
          >
            Get started
          </button>
        </div>

        {/* Hamburger */}
        <button
          className='lg:hidden z-10 w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors'
          onClick={() => setIsOpen(!isOpen)}
          aria-label='Toggle menu'
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className='lg:hidden bg-white border-t border-slate-100 shadow-xl'>
          <div className='max-w-[1400px] mx-auto px-6 py-4 flex flex-col'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={mobileLinkClass(link.id)}
              >
                {link.name}
              </Link>
            ))}

            <div className='my-3 h-px bg-slate-100' />

            <button
              onClick={() => {
                setIsOpen(false)
                document
                  .getElementById('get-started')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
              className='w-full bg-[#003D9B] hover:bg-[#002f7a] active:scale-95 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200'
            >
              Get started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}