import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SupportAI | Smarter Customer Support Powered By AI',
  description:
    'Train a chatbot on your business data and deliver instant, accurate responses 24/7.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className={`${inter.className} antialiased text-slate-900`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
