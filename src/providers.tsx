// providers.tsx
'use client'

import React from 'react'
import { CssBaseline, StyledEngineProvider } from '@mui/material'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <StyledEngineProvider injectFirst>
          <CssBaseline />
          {children}
      </StyledEngineProvider>
    </>
  )
}
export default Providers