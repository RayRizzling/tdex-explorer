// components/ProviderMarketData.tsx

'use client'

import React, { useState } from "react"
import { ProviderMarketDataProps } from "@/types/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { EyeOff, Layers2 } from "lucide-react"
import { esplora } from "@/config/config"
import { isOnion } from "@/lib/utils"
import { Badge } from "./ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import MarketCards from "./MarketCards"
import ErrorCard from "./ErrorCard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

const renderDuplicateList = (endpoints: string[], names: string[]) => {
  return (
    <div className="space-y-2">
      {endpoints.length > 1 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-accent-foreground">Duplicates Found</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {endpoints.map((dupEndpoint, index) => (
              <div
                key={dupEndpoint}
                className="p-4 bg-card rounded-lg shadow-md border border-border text-foreground"
              >
                <p className="text-base font-medium text-primary-foreground">{dupEndpoint}</p>
                <p className="text-sm text-muted-foreground">Name: {names[index]}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-base text-muted-foreground">{endpoints[0]} <br />Name: {names[0]}</p>
      )}
    </div>
  )
}

const ProviderMarketData: React.FC<ProviderMarketDataProps> = ({
  endpoint,
  marketData,
  providerName,
  assetData,
  error,
  isDuplicate,
  duplicateOf, 
  showInSats
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const onion = isOnion(endpoint)
  const v1Statuses: (boolean | undefined)[] = marketData.flat().map((market) => market.v1)
  
  const v1: boolean | undefined =
  v1Statuses.length > 0 && v1Statuses.every((status) => status === true)
    ? true
    : v1Statuses.length > 0 && v1Statuses.every((status) => status === false)
    ? false
    : undefined

  return (
    <Card className="my-4 w-full border-ring">
      <CardHeader>
        <TooltipProvider>
          <Tooltip>
          {v1 && 
          <>
            <TooltipTrigger className="flex gap-1 cursor-help w-fit">
              <Badge className="italic w-fit bg-orange-300 dark:bg-orange-600 text-accent-foreground">
                Provider uses V1
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-2 text-sm">
              <div className="text-center">
                <p className="font-bold text-destructive">This provider is using an outdated version (V1), which may limit compatibility.</p>
                <p>Trading with this provider using the TDEX app or other V2-compatible clients is not supported.</p>
                <p>It is strongly recommended for the provider to update to the latest TDEX version.</p>
              </div>
            </TooltipContent>
          </>
          }
          {v1 === undefined && (marketData.length === 0 || !marketData) && 
          <>
            <TooltipTrigger  className="flex gap-1 cursor-help w-fit">
              <Badge className="italic w-fit bg-yellow-300 dark:bg-yellow-600 text-accent-foreground">
                Provider not availabe
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-2 text-sm">
              <div className="text-center">
                <p className="font-bold text-destructive">Provider currently unavailable</p>
                <p>Please try again later or check for updates from the provider.</p>
              </div>
            </TooltipContent>
          </>
          }
          {v1 === undefined && marketData.length > 0 && 
            <>
              <TooltipTrigger className="flex gap-1 cursor-help w-fit">
                <Badge className="italic w-fit bg-red-300 dark:bg-red-600 text-accent-foreground">
                  Provider version unresolved!
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-2 text-sm">
                <div className="text-center">
                  <p className="font-bold text-destructive">Inconsistent provider responses!</p>
                  <p>Market data for this provider indicates a response problem and version conflicts, which is a serious issue.</p>
                  <p>Trading with this provider is <span className="font-bold">not recommended</span> as bad responses may cause unexpected behavior or compatibility issues.</p>
                  <p>It is highly advised for the provider to resolve this problem.</p>
                </div>
              </TooltipContent>
            </>
          }
          </Tooltip>
        </TooltipProvider>
        <CardTitle className="text-center text-xl truncate w-full">
            <p>{providerName}</p>
            <div className="mt-2">{onion && (<Badge className="w-fit bg-destructive text-destructive-foreground/80 cursor-default"><EyeOff className="mr-2"/> Onion Provider</Badge>)}</div>
        </CardTitle>
        <CardDescription className="text-center text-sm truncate w-full">{endpoint}</CardDescription>
        {isDuplicate && (
          <div className="flex items-center justify-center mt-2">
            <HoverCard>
              <HoverCardTrigger className="cursor-pointer underline text-blue-600 hover:text-blue-800">
                <Badge variant={'secondary'} className="text-secondary-foreground">
                  <Layers2 className="mr-2 text-card" /> {duplicateOf?.endpoints.length === 1 ? 'Duplicate found' : 'Duplicates found'}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-fit">
                {duplicateOf ? renderDuplicateList(duplicateOf.endpoints, duplicateOf.names) : 'No duplicates found'}
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
      </CardHeader>
        <CardContent>

          {/* Main content with market data */}
          <MarketCards marketData={marketData} assetData={assetData} esplora={esplora} v1={v1} showInSats={showInSats}/>

          {/* Section for error display and fix tips */}
          {error && <ErrorCard error={error} endpoint={endpoint} />}

        </CardContent>
      {!onion ? 
        <CardFooter className="text-center text-xs">
          Updated on: {new Date().toLocaleString()}
        </CardFooter>
        :
        <CardFooter className="text-center text-xs">
          Updates every 12 hours, data from tdex public proxy
        </CardFooter>
      }
    </Card>
  )
}

export default ProviderMarketData
