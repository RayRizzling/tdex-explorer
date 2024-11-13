// components/Footer.tsx

'use client'

import React, { useState } from "react"
import TypingAnimation from "./ui/typing-animation"
import { Badge } from "./ui/badge"
import Link from "next/link"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import {QRCodeSVG} from 'qrcode.react';
import { BitcoinIcon } from "lucide-react"
import { btcAddress } from "@/config/config"
import { DonationOverlay } from "./DonationOverlay"

export function Footer() {
  // State to control the visibility of the Bitcoin donation overlay
  const [isBtcOverlayVisible, setIsBtcOverlayVisible] = useState(false)

  // Funktion zum Schließen des Overlays
  const closeOverlay = () => {
    setIsBtcOverlayVisible(false)
  }

  return (
    // Container div for the background with full screen width
    <div className="w-screen rounded-md overflow-visible">
      <div
        className="flex flex-col md:flex-row items-center justify-center md:justify-between px-2 md:px-10 py-4 w-full"
      >
        {/* Left div with GitHub link */}
        <Button variant={'ghost'} className="text-center md:text-left mb-4 md:mb-0">
          <Link
            href={'https://github.com/RayRizzling/tdex-explorer?tab=readme-ov-file#tdex-explorer'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-900 dark:text-gray-300 flex items-center gap-2">🔗 T-Dash on Github <GitHubLogoIcon /></Link>
        </Button>

        {/* Typing animation wrapped in a Badge */}
        <Badge variant="outline" className="mb-4 md:mb-0 bg-white/5 backdrop-blur-sm shadow-lg">
          <TypingAnimation
            className="text-4xl font-bold text-black dark:text-white"
            text="[t-dash]~$: grep 'provider' tdex"
          />
        </Badge>

        {/* Right div with Bitcoin donation button */}
        <Button
          variant="outline"
          className="text-center md:text-right mb-4 md:mb-0"
          onClick={() => setIsBtcOverlayVisible(true)}
        >
          <span className="text-sm text-gray-900 dark:text-gray-300 flex items-center gap-2"><BitcoinIcon color="orange"/>Donations</span>
        </Button>
      </div>

      {/* Bitcoin donation overlay */}
      <DonationOverlay
        isVisible={isBtcOverlayVisible}
        onClose={closeOverlay}
      />
    </div>
  )
}
