import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import dynamic from 'next/dynamic'

import Providers from '@/providers';
import ToastProvider from '@/components/ToastProvider'
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <ToastProvider />
          {children}
        </Providers>
      </body>
    </html>
  )
}
