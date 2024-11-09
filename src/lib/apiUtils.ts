// lib/apiUtils.ts

import { ErrorObject, FetchMarketDataResponse, Market, MarketData, MarketError, PriceDetails, PriceResult, Provider, Results } from "@/types/types"
import { debug, PROVIDER_URL } from "@/config/config"
import fallbackData from '@/config/providers.json'
import { fetchMarketData } from "./fetchFunctions"

/**
 * Adds an 'onion' flag to each provider based on the endpoint URL.
 * 
 * The 'onion' flag indicates whether the provider's endpoint is a Tor hidden service, 
 * which is identified by the '.onion' suffix in the hostname. This function processes 
 * a list of providers and appends an `onion` property to each one.
 * 
 * If a provider's endpoint is a valid URL, the function checks if the hostname ends 
 * with `.onion` and sets the `onion` flag accordingly. If the URL is invalid, it logs
 * the error and returns the provider unchanged.
 * 
 * @param providers - An array of `Provider` objects, each containing an `endpoint` URL.
 * 
 * @returns A new array of `Provider` objects, each including an `onion` flag indicating 
 *          whether the endpoint is a Tor hidden service or not.
 */
export function addOnionFlag(providers: Provider[]): Provider[] {
    return providers.map(provider => {
        try {
            // Parse the provider's endpoint URL
            const url = new URL(provider.endpoint)
            
            // Return the provider with the 'onion' flag added
            return {
                ...provider,
                onion: url.hostname.endsWith('.onion')
            }
        } catch (error) {
            // Log invalid URLs and return the provider unchanged
            console.error(`Invalid URL for provider ${provider.endpoint}`, error)
            return provider
        }
    })
}
  
/**
 * Fetches a list of providers from an external source.
 * 
 * This function makes a request to the specified external URL (`PROVIDER_URL`) and 
 * attempts to retrieve a list of providers in JSON format. If the request is successful, 
 * the providers are returned as an array. If any issues occur during the fetch operation, 
 * an error is thrown, providing context about the failure.
 * 
 * @returns {Provider[]} A promise that resolves to an array of `Provider` objects fetched from the external source.
 * 
 * @throws {Error} An error if the external request fails, the response is not valid, or the data is empty.
 */
export async function fetchExternalProviders(): Promise<Provider[]> {
    // Make the external fetch request to get provider data
    const response: Response = await fetch(PROVIDER_URL)

    if (!response.ok) {
        // Throw an error if the response is not successful
        throw new Error(`Failed to fetch from external source: ${response.statusText}`)
    }

    // Parse the response body as JSON
    const data: Provider[] = await response.json()

    // Check if the data is valid and contains providers
    if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No data available from external source')
    }

    // Return the fetched provider data
    return data
}

/**
 * Retrieves provider data from a fallback JSON source.
 * 
 * In case the external provider fetch fails, this function loads a fallback set of provider data 
 * from a locally stored JSON file (`providers.json`). It then adds the 'onion' flag to each provider 
 * using the `addOnionFlag` function. If any issues occur during this process, an error is logged and thrown.
 * 
 * @returns A list of `Provider` objects retrieved from the fallback data.
 * 
 * @throws An error if the fallback data is unavailable or invalid.
 */
export function getFallbackProviders(): Provider[] {
    try {
        // Retrieve and type-cast the fallback data
        const providers: Provider[] = fallbackData as Provider[]

        // Add the 'onion' flag to each provider
        return addOnionFlag(providers)
    } catch (error) {
        // Log and throw an error if fallback data fetching fails
        console.error('Error fetching fallback data:', error)
        throw new Error('Failed to load fallback data')
    }
}

/**
 * Handles errors related to market data retrieval for a given endpoint.
 * 
 * This function creates an error object with relevant details about the failed market data retrieval for the specified endpoint.
 * It includes the status 'Endpoint not available', a descriptive error message, and the endpoint URL.
 * 
 * @param {string} endpoint - The URL of the endpoint where the error occurred.
 * @param {string} error - The error message detailing the issue with the endpoint.
 * 
 * @returns {ErrorObject} An error object containing status, message, and endpoint.
 */
export const handleMarketError = (endpoint: string, error: string): ErrorObject => ({
    status: 'Endpoint not available',
    message: error,
    endpoint,
})

/**
 * Handles errors related to price data retrieval for a given endpoint.
 * 
 * Similar to `handleMarketError`, this function generates an error object for situations where the price data for a specific 
 * market cannot be fetched from the provided endpoint. It includes the status 'Market not available', the error message, 
 * and the endpoint URL.
 * 
 * @param {string} endpoint - The URL of the endpoint where the price data retrieval failed.
 * @param {string} error - The error message detailing the issue with retrieving price data.
 * 
 * @returns {ErrorObject} An error object containing status, message, and endpoint.
 */
export const handlePriceError = (endpoint: string, error: string): ErrorObject => ({
    status: 'Market not available',
    message: error,
    endpoint,
})

/**
 * Determines the appropriate HTTP status code based on the presence of errors.
 * 
 * This function checks if there are any errors in the provided list of `ErrorObject`s. If errors exist, it returns a status 
 * code of 206 (Partial Content), indicating that some data retrieval was successful while others failed. If no errors 
 * are found, it returns a status code of 200 (OK), indicating successful retrieval of data.
 * 
 * @param {ErrorObject[]} errors - An array of error objects that may have occurred during the data retrieval process.
 * 
 * @returns {number} A status code, 206 if errors exist, otherwise 200.
 */
export const determineStatus = (errors: ErrorObject[]): number => errors.length > 0 ? 206 : 200

/**
 * Constructs a result object from the given array of results.
 * 
 * This function takes an array of results and converts it into an object where each key is the endpoint URL and the 
 * corresponding value is an object containing the market data for that endpoint. This allows for easy access to 
 * the market data by endpoint URL.
 * 
 * @param {Results} results - An array of results where each result contains an endpoint and its corresponding market data.
 * 
 * @returns {Record<string, { markets: MarketData[] }>} An object where the keys are endpoint URLs, and the values contain
 *          the market data for each respective endpoint.
 */
export const createResultObject = (results: Results): Record<string, { markets: MarketData[] }> =>
    results.reduce<Record<string, { markets: MarketData[] }>>((acc, { endpoint }) => {
      acc[endpoint.url] = { markets: endpoint.data }
      return acc
}, {})


/**
 * Fetches market and price data for a list of endpoint URLs and processes the results.
 * 
 * This function is responsible for retrieving the market and price data from each endpoint
 * and handling any errors that may occur. It ensures that data is fetched asynchronously
 * and processes it in parallel to improve performance.
 * 
 * @param {string[]} endpoints - The list of endpoint URLs from which to fetch market data.
 * 
 * @returns {Results} An array of results containing market data and any errors encountered.
 */
export async function fetchAndProcessMarketData(endpoints: string[]): Promise<Results> {
    return Promise.all(
      endpoints.map(async (endpoint) => {
        const marketData: FetchMarketDataResponse = await fetchMarketData(endpoint, '/markets')
        
        if (debug) {
          console.dir({ endpoint, marketData }, { depth: null, colors: true })
        }
  
        // Handle errors in fetching market data
        if (marketData.error) {
          return processMarketError(endpoint, marketData.error)
        }
  
        if (!marketData.data) {
          return processMarketError(endpoint, 'An unexpected error occurred. Try to reload the page!')
        }
  
        // Process the market data and fetch price details
        const markets: Market[] = marketData.data.markets
        const priceResults: PriceResult[] = await fetchPriceDataForMarkets(endpoint, markets)
  
        // Process and format the final market data with price details
        const data: MarketData[] = formatMarketData(markets, priceResults)
  
        // Collect any errors that occurred during price data retrieval
        const priceErrors: ErrorObject[] = priceResults
          .filter(result => result.error)
          .map(result => handlePriceError(endpoint, result.error ?? ''))
  
        return {
          endpoint: { url: endpoint, data },
          errors: priceErrors,
        }
      })
    )
}
  
/**
 * Processes an error related to market data retrieval for a specific endpoint.
 * 
 * @param {string} endpoint - The URL of the endpoint where the error occurred.
 * @param {string} error - The error message detailing the issue with retrieving market data.
 * 
 * @returns {MarketError} An object containing the endpoint and the error details.
*/
function processMarketError(endpoint: string, error: string): MarketError {
    return {
      endpoint: { url: endpoint, data: [] },
      errors: [handleMarketError(endpoint, error)],
    }
}
  
/**
 * Fetches price data for a list of markets at a given endpoint.
 * 
 * This function retrieves the price data for each market at the specified endpoint,
 * handling any errors that may occur during the fetch process.
 * 
 * @param {string} endpoint - The URL of the endpoint to fetch price data from.
 * @param {Market[]} markets - The list of markets for which to fetch price data.
 * 
 * @returns {PriceResult[]} An array of price results for each market.
*/
export async function fetchPriceDataForMarkets(endpoint: string, markets: Market[]): Promise<PriceResult[]> {
    return Promise.all(
      markets.map(async (market: Market) => {
        const result: FetchMarketDataResponse = await fetchMarketData(endpoint, '/market/price', market)
        if (debug) {
          console.dir({ endpoint, result, market }, { depth: null, colors: true })
        }
  
        return result.error
          ? { market, price: null, error: result.error }
          : { market, price: result.data as PriceDetails ?? null, error: null }
      })
    )
}
  
/**
 * Formats market data by adding relevant price details and fee information.
 * 
 * This function processes the market data and price details to create a final structured
 * object that includes all relevant information such as asset balances, spot price,
 * and fee details for each market.
 * 
 * @param {Market[]} markets - The list of markets to be formatted.
 * @param {PriceResult[]} priceResults - The price details corresponding to the markets.
 * 
 * @returns {MarketData[]} A structured array of market data objects with price details.
*/
function formatMarketData(markets: Market[], priceResults: PriceResult[]): MarketData[] {
    return markets.map((market: Market) => {
      const priceResult = priceResults.find(r => r.market === market)
  
      const baseAsset = priceResult?.market.market?.baseAsset ?? 'N/A'
      const quoteAsset = priceResult?.market.market?.quoteAsset ?? 'N/A'
      const baseAssetBalance = priceResult?.price?.balance?.baseAmount ?? 'N/A'
      const quoteAssetBalance = priceResult?.price?.balance?.quoteAmount ?? 'N/A'
      const spotPrice = priceResult?.price?.spotPrice ?? null
      const minTradeableAmount = priceResult?.price?.minTradableAmount ?? 'N/A'
  
      return {
        baseAsset,
        quoteAsset,
        balances: {
          baseAmount: baseAssetBalance,
          quoteAmount: quoteAssetBalance,
        },
        spotPrice,
        minTradeableAmount,
        fees: {
          baseFee: { fixed: market.fee.fixedFee.baseAsset, percentage: market.fee.percentageFee.baseAsset },
          quoteFee: { fixed: market.fee.fixedFee.quoteAsset, percentage: market.fee.percentageFee.quoteAsset },
        },
      }
    })
}
  