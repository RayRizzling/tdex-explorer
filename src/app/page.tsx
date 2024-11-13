// app/page.tsx

import ProviderDashboard from "@/components/ProviderDashboard"
import { ToggleTheme } from "@/components/ToggleTheme"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/Footer"

// Extracted components for better readability and maintainability
const WelcomeMessage = () => (
  <div className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-6 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
    Welcome to&nbsp;
    <code className="font-mono font-bold">~tdash alpha</code>
  </div>
)

const Logo = () => (
  <Link
    href={"https://t.me/tdexnetwork"}
    target={"_blank"}
    rel="noopener noreferrer"
    className="absolute top-2 md:top-[9%] -left-2 md:left-2 lg:top-[15%] lg:left-8 2xl:top-6 z-[100] hover:scale-110 hover:cursor-pointer transition-transform"
  >
    <Image
      src={"/logo.svg"}
      alt="T-Dash Logo"
      width={220}
      height={110}
      className="w-28 md:w-40 lg:w-56 h-auto"
      priority
    />
  </Link>
)

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between lg:p-14 no-scrollbar">

      {/* Logo (top left absolute) */}
      <Logo />

      {/* Welcome Message */}
      <div className="z-50 w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between font-mono text-sm space-y-6 lg:space-y-0 mb-4">
        <WelcomeMessage />
        <div className="pt-8 md:pt-0">
          <ToggleTheme />
        </div>
      </div>

      {/* Vulpem Link */}
      <div className="flex gap-2 text-lg dark:text-card-bg-light text-card-bg-dark">
        <Link href={"https://vulpem.com/"} target="blank_" className="hover:scale-105 font-bold">
          Vulpem ❤️
        </Link>
        <p className="italic">Community Service</p>
      </div>

      {/* Provider Dashboard */}
      <div className="relative flex justify-center flex-1 w-full md:w-full my-2 mb-20 md:my-10 z-20">
        <ProviderDashboard />
      </div>

       {/* Footer (bottom absolute) */}
      <Footer />
    </main>
  )
}
