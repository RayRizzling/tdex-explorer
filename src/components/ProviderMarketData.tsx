// components/ProviderMarketData.tsx

import React from "react"
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
  duplicateOf
}) => {
  const onion = isOnion(endpoint)

  return (
    <Card className="my-4 w-full border-ring">
      <CardHeader>
        <CardTitle className="text-center text-xl truncate w-full">
            <p>{providerName}</p>
            <div className="mt-2">{onion && (<Badge className="w-fit bg-destructive text-destructive-foreground/80"><EyeOff className="mr-2"/> Onion Provider</Badge>)}</div>
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
          <MarketCards marketData={marketData} assetData={assetData} esplora={esplora}/>

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
