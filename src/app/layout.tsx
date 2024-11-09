// app/layout.tsx

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import RadialGradient from "@/components/ui/radial-gradient"
import { ProviderContextHooks } from "@/context/ProviderContext"
import { DEFAULT_LANGUAGE, DEFAULT_THEME } from "@/config/config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "T/Dash",
  description: "Discover Tdex providers, markets, liqudity & more",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={DEFAULT_LANGUAGE} suppressHydrationWarning>
      <body className={inter.className}>

        {/* ThemeProvider provides context for the design system (e.g., light/dark mode) */}
        <ThemeProvider
          attribute="class"
          defaultTheme={DEFAULT_THEME}
          enableSystem
          disableTransitionOnChange
        >
          <ProviderContextHooks>
            {children}
            {/* Adds the Toaster component for displaying notifications */}
            <Toaster />
          </ProviderContextHooks>
        </ThemeProvider>

        {/* Background design */}
        <RadialGradient size={250}/>
      </body>
    </html>
  )
}
