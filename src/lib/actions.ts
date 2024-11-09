// components/actions.ts

'use server'

import { fetchAssetData } from "@/lib/fetchFunctions"
import { AssetInfo, ResultObject } from "@/types/types"

/**
 * Fetches all assets data based on the given market results.
 * It extracts asset hashes from the markets, then fetches the data for each asset.
 * The data is returned in a Map with asset hashes as keys and asset data as values.
 * 
 * @param {ResultObject} marketResults - An object containing the market data.
 * @returns {Promise<Map<string, AssetInfo>>} 
 * A promise that resolves to a Map of asset hashes and their corresponding data.
 */
export const fetchAllAssetsData = async (marketResults: ResultObject): Promise<Map<string, AssetInfo>> => {
    // Step 1: Extract unique asset hashes from the market results
    const assetHashes: Set<string> = new Set<string>()

    Object.values(marketResults).forEach(({ markets }) => {
        markets.forEach(({ baseAsset, quoteAsset }) => {
            assetHashes.add(baseAsset)
            assetHashes.add(quoteAsset)
        })
    })

    // Step 2: Fetch data for each asset and handle possible errors
    const assetDataPromises: Array<Promise<{ assetHash: string } & AssetInfo | null>> = Array.from(assetHashes).map(async (assetHash) => {
        try {
          const data = await fetchAssetData(assetHash)
          return data
        } catch (error) {
          console.warn(`Error fetching data for asset ${assetHash}:`, error)
          return null
        }
    })

    // Step 3: Wait for all fetch requests to complete
    const assetDataArray: (({
        assetHash: string;
    } & AssetInfo) | null)[] = await Promise.all(assetDataPromises)

    // Step 4: Map the fetched data into a Map structure
    const assetDataMap: Map<string, AssetInfo> | null = new Map<string, AssetInfo>()
    assetDataArray.forEach((data) => {
        if (!data) {
            return null// Skip if data is null (i.e., fetch failed)
        }

        const { assetHash, name, precision, mempool_stats } = data

        // Only add to the map if the data is valid
        if (!assetHash || !name || !precision) {
            console.warn(`Missing data for asset ${assetHash}`)
            return
        }

        assetDataMap.set(assetHash, { name, precision, mempool_stats })
    })

    // Step 5: return result
    return assetDataMap
}
