import { Metadata } from 'next'

import './globals.css'
import { inter } from '@/fonts'

export const metadata: Metadata = {
  title: 'whichdoorbest',
  description: 'Which door best?',
  appleWebApp: {
    title: 'WhichDoorBest',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{ children }</body>
    </html>
  )
}
