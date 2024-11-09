// components/ProviderDashboard.tsx

'use client'

import { useEffect } from "react"
import { ProviderSelector } from "./ProviderSelector"
import ProviderMarketData from "./ProviderMarketData"
import { ProviderSelectorSkeleton } from "./custom-skeletons"
import { CustomProviderForm } from "./CustomProviderForm"
import Image from "next/image"
import { FlipWords } from "./ui/flip-words"
import { tdexUrl } from "@/config/config"
import dynamic from 'next/dynamic'
import { Badge } from "./ui/badge"
import AnimatedShinyText from "./ui/animated-shiny-text"
import { Card, CardContent, CardHeader } from "./ui/card"
import { BookOpenCheck, Cable, Globe } from "lucide-react"
import { useProviderContext } from "@/context/ProviderContext"
import { DashboardStatCardProps } from "@/types/types"

// Dynamically import PinContainer to improve initial load time and avoid server-side rendering issues.
const PinContainer = dynamic(() => import('./ui/3d-pin').then(mod => mod.PinContainer), {
  ssr: false
});

/**
 * These words will be animated using the <FlipWords /> component.
 * Customizable for different word sets or languages.
 */
export const words = [
  'True', 'Decentralized', 'Exchange'
]

/**
 * ProviderDashboard - Main component for displaying provider and market data.
 * Fetches and renders providers, dashboard statistics, and market data in a responsive layout.
 */
const ProviderDashboard = () => {
  const {
    providers,
    marketResults,
    loading,
    searchLoading,
    assetData,
    dashboardStats,
    errors,
    duplicateMarkets,
    loadProviders,
    fetchAllMarketBalances,
    handleAddProvider,
    handleProviderChange
  } = useProviderContext()

  // Load provider data on initial render
  useEffect(() => {
    loadProviders()
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-4 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-center mb-8">
        <Badge variant={'outline'} className="w-fit cursor-default bg-white/5 backdrop-blur-sm shadow-lg">
          <AnimatedShinyText>
            <span className="text-xl md:text-2xl font-bold">Provider Dashboard</span>
          </AnimatedShinyText>
        </Badge>
      </div>

      {/* Provider Selector and Custom Provider Form */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        {/* Left Column - Provider Selector */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-0">
          {/* Logo and Documentation Link */}
          <div className="h-40 w-36 mt-16 md:mt-0 transform -translate-y-24">
            <PinContainer title="Study the docs" href={tdexUrl} className="min-w-36">
              <div className="text-nowrap flex flex-col items-center justify-center gap-2">
                <FlipWords words={words} className="text-lg italic"/>
                <Image 
                  src="/tdex-logo.png" 
                  alt="TDEX Logo"
                  width={100}
                  height={40}
                  sizes="auto"
                  priority
                />
              </div>
            </PinContainer>
          </div>

          {/* Provider Selector or Skeleton Loader */}
          {loading ? (
            <div className="my-4 flex items-center justify-center">
              <ProviderSelectorSkeleton />
            </div>
          ) : (
            providers.length > 0 && (
              <div className="my-4 z-30">
                <ProviderSelector
                  providers={providers}
                  onSelectProvider={handleProviderChange}
                  fetchAllMarketBalances={fetchAllMarketBalances}
                  searchLoading={searchLoading}
                />
              </div>
            )
          )}
        </div>

        {/* Right Column - Custom Provider Form */}
        <div className="flex-1">
          <CustomProviderForm onAddProvider={handleAddProvider} searchLoading={searchLoading}/>
        </div>
      </div>

      {/* Dashboard Statistics */}
      {dashboardStats && (
        <div className="flex justify-center my-4">
          <div className="w-full max-w-md flex justify-center">
            <Card className="w-fit">
              <CardHeader className="text-xl font-semibold text-accent-foreground text-center p-1">
                Stats of {Object.keys(marketResults || {}).length} fetched providers
              </CardHeader>
              <CardContent className="bg-transparent text-start">
                <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
                  {/* Reachable Providers */}
                  <DashboardStatCard icon={<Cable className="text-accent w-8 h-8" />} label="Avail. Providers" value={dashboardStats.reachable} />
                  
                  {/* Total Markets */}
                  <DashboardStatCard icon={<Globe className="text-accent w-8 h-8" />} label="Total Markets" value={dashboardStats.totalMarkets} />

                  {/* Tradable Markets */}
                  <DashboardStatCard icon={<BookOpenCheck className="text-accent w-8 h-8" />} label="Tradable Markets" value={dashboardStats.tradableMarkets} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Market Data */}
      <div className="my-4">
        {marketResults &&
          Object.entries(marketResults).map(([endpoint, data]) => (
            <ProviderMarketData
              key={endpoint}
              endpoint={endpoint}
              marketData={data.markets}
              providerName={data.providerName || "Unknown"}
              assetData={assetData}
              error={errors.find((error) => error.endpoint === endpoint)}
              isDuplicate={duplicateMarkets.has(endpoint)}
              duplicateOf={duplicateMarkets.get(endpoint)}
            />
          ))}
      </div>
    </div>
  )
}

export default ProviderDashboard

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({ icon, label, value }) => (
  <div className="flex flex-1 items-center justify-center p-2 rounded-lg shadow-sm space-x-2 min-w-[174px] hover:scale-105 bg-card-bg-light dark:bg-card-bg-dark">
    {icon}
    <div className="flex flex-col text-md text-center">
      <p className="text-sm">{label}</p>
      <span className="text-lg font-bold">{value}</span>
    </div>
  </div>
);
