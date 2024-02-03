import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import getCurrentUser from '@/app/actions/getCurrentUser'
import dynamic from 'next/dynamic'

import Providers from '@/providers';
import ToastProvider from '@/components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const currentUser = await getCurrentUser();

  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <Navbar currentUser={currentUser} />
          <ToastProvider />
          {children}
        </Providers>
      </body>
    </html>
  )
}
