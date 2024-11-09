// components/VortexBackground.tsx

'use client'

import React from "react"
import { Vortex } from "./ui/vortex"
import TypingAnimation from "./ui/typing-animation"
import { Badge } from "./ui/badge"

export function VortexBackground() {
  return (
    // Container div for the background with full screen width
    <div className="w-screen rounded-md h-[1rem] overflow-visible">
      {/* Vortex background animation with customizable particle properties */}
      <Vortex
        backgroundColor="transparent"
        particleCount={100} // Set the number of particles
        rangeSpeed={0.05} // Set particle movement speed
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        {/* Badge UI component to wrap the typing animation */}
        <Badge variant="outline" className="mb-24 lg:mb-28 bg-white/5 backdrop-blur-sm shadow-lg">
          {/* Typing animation with text */}
          <TypingAnimation
            className="text-4xl font-bold text-black dark:text-white"
            text="[t-dash]~$: grep 'provider' tdex" // The text to be animated
          />
        </Badge>
      </Vortex>
    </div>
  )
}
