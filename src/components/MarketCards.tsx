// components/MarketDataCard.tsx

import React from 'react'
import Link from 'next/link'
import { AssetDetailsProps, AssetInfo, MarketCards as MarketCardProps } from '@/types/types'
import CustomToltip from './CustomTooltip'
import { ChartCandlestickIcon, CircleArrowDown, Currency, HandCoins, LinkIcon, Scale } from 'lucide-react'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { formatAsPercentage, formatDecimals } from '@/lib/utils'

const MarketCards = ({ marketData, assetData, esplora }: MarketCardProps) => {
  return marketData.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {marketData.map((data, index) => {
        const baseAssetInfo: AssetInfo | undefined = assetData.get(data.baseAsset)
        const quoteAssetInfo: AssetInfo | undefined = assetData.get(data.quoteAsset)

        const baseAssetName: string = baseAssetInfo ? baseAssetInfo.name : 'Base (unnamed)'
        const quoteAssetName: string = quoteAssetInfo ? quoteAssetInfo.name : 'Quote (unnamed)'
        const baseAssetPrecision: number = baseAssetInfo ? baseAssetInfo.precision : 0
        const quoteAssetPrecision: number = quoteAssetInfo ? quoteAssetInfo.precision : 0
        const baseAssetMemStats: JSON | [] = baseAssetInfo ? baseAssetInfo.mempool_stats : []
        const quoteAssetMemStats: JSON | [] = quoteAssetInfo ? quoteAssetInfo.mempool_stats : []

        return (
          <div key={index} className="p-4 border border-accent rounded-md shadow-sm space-y-4 bg-accent/50">
            <AssetDetails
              assetType="Base"
              asset={data.baseAsset}
              assetName={baseAssetName}
              assetPrecision={baseAssetPrecision}
              assetMemStats={baseAssetMemStats}
              esplora={esplora}
            />
            <AssetDetails
              assetType="Quote"
              asset={data.quoteAsset}
              assetName={quoteAssetName}
              assetPrecision={quoteAssetPrecision}
              assetMemStats={quoteAssetMemStats}
              esplora={esplora}
            />
            <SpotPrice spotPrice={data.spotPrice} quoteAssetName={quoteAssetName} />
            <BalanceInfo
              baseAssetName={baseAssetName}
              quoteAssetName={quoteAssetName}
              balances={data.balances}
              baseAssetPrecision={baseAssetPrecision}
              quoteAssetPrecision={quoteAssetPrecision}
            />
            <FeeInfo
              baseAssetName={baseAssetName}
              quoteAssetName={quoteAssetName}
              fees={data.fees}
              baseAssetPrecision={baseAssetPrecision}
              quoteAssetPrecision={quoteAssetPrecision}
            />
            <MinTradeableAmount
              minTradeableAmount={data.minTradeableAmount}
              baseAssetName={baseAssetName}
              baseAssetPrecision={baseAssetPrecision}
            />
          </div>
        )
      })}
    </div>
  ) : (
    <p className="text-gray-600 text-center">No market data available.</p>
  )
}

const AssetDetails = ({
  assetType,
  asset,
  assetName,
  assetPrecision,
  assetMemStats,
  esplora,
}: AssetDetailsProps) => (
  <div className="flex flex-col items-center gap-2">
    <div className="font-bold flex items-center">
      {assetType === 'Base' ? <Currency className="mr-2" /> : <CircleArrowDown className="mr-2" />}
      <CustomToltip
        trigger={<> {assetType} Asset<InfoCircledIcon className="h-3" /></>}
        content={
          <>
            <p>Hash: {asset}</p>
            <p>Precision: {assetPrecision}</p>
            <span>Mempool Stats:
              <pre>{JSON.stringify(assetMemStats, null, 2)}</pre>
            </span>
          </>
        }
      />
    </div>
    <Link href={`${esplora}${asset}`} target="_blank" rel="noopener noreferrer" className="truncate w-full flex flex-row justify-center">
      {assetName}
      <LinkIcon className="ml-2" />
    </Link>
  </div>
)

type SpotPriceProps = {
  spotPrice: number | null
  quoteAssetName: string
}

const SpotPrice = ({ spotPrice, quoteAssetName }: SpotPriceProps) => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="font-bold flex items-center">
      <ChartCandlestickIcon className="mr-2" />
      <CustomToltip
        trigger={<>Spot Price<InfoCircledIcon className="h-3" /></>}
        content={<p>Spot price: {spotPrice || "N/A"}</p>}
      />
    </div>
    {`${spotPrice?.toFixed(2) || "N/A"} ${quoteAssetName}`}
  </div>
)

type BalanceInfoProps = {
  baseAssetName: string
  quoteAssetName: string
  balances: { baseAmount: string; quoteAmount: string } | null
  baseAssetPrecision: number
  quoteAssetPrecision: number
}

const BalanceInfo = ({
  baseAssetName,
  quoteAssetName,
  balances,
  baseAssetPrecision,
  quoteAssetPrecision,
}: BalanceInfoProps) => (
  <div className="bg-accent/20 rounded-lg shadow-sm p-4 text-center">
    <div className="font-bold flex justify-center">
      <Scale className="mr-2" />
      <CustomToltip
        trigger={<>Balances<InfoCircledIcon className="h-3" /></>}
        content={<p>These are the balances</p>}
      />
    </div>
    <span className="flex items-center justify-around space-x-4">
      <p>
        <strong>{baseAssetName}</strong>
        <br />{balances ? formatDecimals(balances.baseAmount, baseAssetPrecision) : 'N/A'}
      </p>
      <p>
        <strong>{quoteAssetName}</strong>
        <br />{balances ? formatDecimals(balances.quoteAmount, quoteAssetPrecision) : 'N/A'}
      </p>
    </span>
  </div>
)

type FeeInfoProps = {
  baseAssetName: string
  quoteAssetName: string
  fees: {
    baseFee: { fixed: string; percentage: string }
    quoteFee: { fixed: string; percentage: string }
  }
  baseAssetPrecision: number
  quoteAssetPrecision: number
}

const FeeInfo = ({
  baseAssetName,
  quoteAssetName,
  fees,
  baseAssetPrecision,
  quoteAssetPrecision,
}: FeeInfoProps) => (
  <div className="bg-accent/20 rounded-lg shadow-sm p-4 text-center">
    <div className="font-bold flex justify-center">
      <HandCoins className="mr-2" />
      <CustomToltip
        trigger={<>Fees<InfoCircledIcon className="h-3" /></>}
        content={<p>These are the fees</p>}
      />
    </div>
    <span className="flex items-center justify-around space-x-4">
      <span className="flex flex-col items-center justify-center">
        <strong>{baseAssetName}</strong>
        Fixed: <p className="truncate">{formatDecimals(fees.baseFee.fixed, baseAssetPrecision)}</p>
        <p className="pt-2">Percentage:{" "}</p>
        <p className="truncate">{formatAsPercentage(fees.baseFee.percentage)}</p>
      </span>
      <span className="flex flex-col items-center justify-center">
        <strong>{quoteAssetName}</strong>
        Fixed: <p className="truncate">{formatDecimals(fees.quoteFee.fixed, quoteAssetPrecision)}</p>
        <p className="pt-2">Percentage:{" "}</p>
        <p className="truncate">{formatAsPercentage(fees.quoteFee.percentage)}</p>
      </span>
    </span>
  </div>
)

type MinTradeableAmountProps = {
  minTradeableAmount: string
  baseAssetName: string
  baseAssetPrecision: number
}

const MinTradeableAmount = ({
  minTradeableAmount,
  baseAssetName,
  baseAssetPrecision,
}: MinTradeableAmountProps) => (
  <div className="text-sm p-1 flex flex-col items-center justify-center">
    <CustomToltip
      trigger={<>Min Tradable Amount<InfoCircledIcon className="h-3" /></>}
      content={<p>Minimum {baseAssetName} amount required to make a trade</p>}
    />
    {formatDecimals(minTradeableAmount, baseAssetPrecision) || "N/A"}
  </div>
)

export default MarketCards
