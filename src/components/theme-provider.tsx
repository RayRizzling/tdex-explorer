// components/theme-provider.ts

'use client'

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // The ThemeProvider component simply wraps the NextThemesProvider and passes down the props and children.
  // This allows for any theming functionality to be applied globally across the app.
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
