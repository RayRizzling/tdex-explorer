// components/ToggleTheme.tsx

'use client'

import * as React from 'react'
import { LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useEffect, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'
import { DEFAULT_THEME } from '@/config/config'
import { Theme } from '@/types/types'

// Animation variants for smooth transitions
const variants = {
  hidden: { x: '100vw', opacity: 0 },
  visible: { x: 0, opacity: 1 },
}

export const ToggleTheme: React.FC = React.memo(() => {
  // Extract the current theme and setter function from next-themes
  const { setTheme, theme } = useTheme()
  
  // Manage the current theme and mounted state
  const [currentTheme, setCurrentTheme] = useState<Theme>(DEFAULT_THEME)
  const [hasMounted, setHasMounted] = useState<boolean>(false)

  // Synchronize the local theme state with the global theme
  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme as Theme)  // Ensure theme is valid
    }
  }, [theme])

  // Callback handler for theme change
  const handleThemeChange = useCallback(
    (theme: Theme) => {
      setTheme(theme) // Update the global theme state
    },
    [setTheme]
  )

  // Early return to prevent SSR issues
  if (!hasMounted) return null

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      transition={{ type: 'spring', stiffness: 50 }}
      className="flex justify-center items-center"
    >
      {/* ToggleGroup ensures only one theme is selected at a time */}
      <ToggleGroup
        type="single"
        variant="outline"
        className="scale-90 rounded-full border p-1 max-w-fit"
        value={currentTheme}
      >
        {/* Light theme toggle */}
        <ToggleGroupItem
          value="light"
          onClick={() => handleThemeChange('light')}
          disabled={theme === 'light'}
          className="disabled:bg-accent rounded-full disabled:opacity-100"
        >
          <SunIcon className="size-5" />
        </ToggleGroupItem>

        {/* System theme toggle */}
        <ToggleGroupItem
          value="system"
          onClick={() => handleThemeChange('system')}
          disabled={theme === 'system'}
          className="disabled:bg-accent rounded-full disabled:opacity-100"
        >
          <LaptopIcon className="size-5" />
        </ToggleGroupItem>

        {/* Dark theme toggle */}
        <ToggleGroupItem
          value="dark"
          onClick={() => handleThemeChange('dark')}
          disabled={theme === 'dark'}
          className="disabled:bg-accent rounded-full disabled:opacity-100"
        >
          <MoonIcon className="size-5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </motion.div>
  )
})

ToggleTheme.displayName = 'ToggleThemeButton'
