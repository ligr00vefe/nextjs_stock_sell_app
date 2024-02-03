// providers.tsx
'use client'

import React from 'react'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { SessionProvider } from 'next-auth/react'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <SessionProvider>
          <CssBaseline />
          {children}
        </SessionProvider>          
      </StyledEngineProvider>
    </>
  )
}
export default Providers