// providers.tsx
'use client'

import React from 'react'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

const Providers = ({ children }: { children: React.ReactNode }, session:Session ) => {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <SessionProvider session={session} basePath="/api/auth">
          <CssBaseline />
          {children}
        </SessionProvider>          
      </StyledEngineProvider>
    </>
  )
}
export default Providers