import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

// Wrap 'latin' in brackets to make it an array
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
})

export const metadata: Metadata = {
  title: 'SupportBot Alpha | AI Intelligence Hub',
  description: 'Enterprise-grade AI customer support with RAG memory.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark'>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-[#020617] text-slate-200`}
      >
        {children}
      </body>
    </html>
  )
}
