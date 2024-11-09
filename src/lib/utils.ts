// lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ErrorObject, Provider, ResultObject } from "@/types/types"
import { torProxyUrl } from "@/config/config"

/**
 * Utility function to combine multiple class names conditionally
 * 
 * This function merges and combines class names passed in as arguments, ensuring that
 * conflicting class names are resolved using the tailwind-merge package. It returns a 
 * clean and merged string of class names to be used in JSX/HTML elements.
 * 
 * @param inputs - A list of class names, both static and dynamic, to be merged.
 * @returns A string representing the merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Validates if the provided string is a valid URL.
 * 
 * This utility function uses a regular expression to check if the given string follows
 * the proper format for a URL, including optional support for Tor onion services.
 * 
 * @param url - The URL string to be validated.
 * @returns A boolean indicating whether the URL is valid.
 */
const urlPattern = /^(https?:\/\/[a-zA-Z0-9._-]+(?:\.onion)?)(:\d+)?(\/.*)?$/
export const isValidUrl = (url: string): boolean => urlPattern.test(url)

/**
 * isOnion - Checks if the provided endpoint URL contains the ".onion" domain.
 * 
 * This utility function helps determine if a given endpoint is an Onion service, typically
 * associated with Tor hidden services. The function returns a boolean value indicating whether
 * the endpoint URL contains the ".onion" domain suffix.
 * 
 * @param endpoint - The URL or endpoint string to check.
 * @returns A boolean value: `true` if the endpoint contains ".onion", otherwise `false`.
 */
export function isOnion(endpoint: string): boolean {
  return endpoint.includes(".onion")
}

/**
 * Returns the proxy URL for Tor hidden services (onion URLs).
 * 
 * If the URL points to a Tor hidden service (a .onion domain), this function will 
 * convert it into a Tor2Web URL by appending the domain to a proxy base URL.
 * 
 * @param url - The URL of the Tor service (can be onion or regular).
 * @returns The original URL if it's not a .onion service; otherwise, the converted proxy URL.
 */
export const getProxyUrl = (url: string): string => {
  const urlFormat = new URL(url)
  
  // If the URL is a Tor hidden service, use a Tor2Web proxy
  if (urlFormat.hostname.endsWith('.onion')) {
    const tor2webUrl = urlFormat.hostname.split('.onion')[0]
    return `${torProxyUrl}${tor2webUrl}${urlFormat.pathname}`
  }
  // Return the original URL for non-onion services
  return url
}

/**
 * Formats a value as a percentage (with a string).
 * 
 * This utility function takes a numeric string, converts it to a percentage, and
 * appends the "%" symbol. It also handles invalid values by returning "N/A".
 * 
 * @param value - A numeric string representing a percentage.
 * @returns The value formatted as a percentage (e.g., "25%").
 */
export const formatAsPercentage = (value: string): string => {
  const numericValue = parseFloat(value)
  if (isNaN(numericValue)) {
      return 'N/A'
  }
  const percentage = numericValue / 100
  return `${percentage}%`
}

/**
 * Formats a given number or string value to a specific decimal precision.
 * If precision is 3 or higher and all decimal places are zero, periods (.) are added.
 * If precision is 2 or lower, trailing zeros are preserved.
 *
 * @param value - The number or string to format.
 * @param precision - The number of decimal places to format the value to.
 * @returns A string representing the value formatted to the specified precision.
 */
export const formatDecimals = (value: number | string, precision: number): string => {
  // Ensure the value is a number, regardless of whether it's passed as a string or number
  const numericValue: number = typeof value === 'string' ? parseFloat(value) : value

  // If the value is NaN (invalid number), return 'N/A'
  if (isNaN(numericValue)) {
    return 'N/A'
  }

  // If the value is exactly 0, return '0' immediately
  if (numericValue === 0) {
    return '0'
  }

  // Calculate the factor for decimal precision (10^precision)
  const factor: number = Math.pow(10, precision)
  const decimalValue: number = numericValue / factor

  // Format the value to the desired precision
  let formattedValue: string = decimalValue.toFixed(precision);

  // Check if all digits after the decimal point are '0'
  const allZerosAfterDecimal: boolean = formattedValue.split('.')[1]?.split('').every(digit => digit === '0')

  if (precision >= 3) {
    // If precision is 3 or more and all decimals are zero, add periods
    if (allZerosAfterDecimal) {
      const decimalPart: string = formattedValue.split('.')[1]
      const firstZero: string = decimalPart.charAt(0)
      const lastZero: string = decimalPart.charAt(decimalPart.length - 1)
      
      // Replace the middle zeros with '*', while keeping the first and last zero intact
      formattedValue = formattedValue.split('.')[0] + '.' + firstZero + '*'.repeat(precision - 2) + lastZero
    } else {
      // Remove trailing zeros but keep the decimal point if not an integer
      formattedValue = formattedValue.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '')
    }
  } else {
    // If precision is less than 3, keep the trailing zeros after the decimal
    formattedValue = formattedValue.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '')
  }

  return formattedValue
}


/**
 * Calculates the reachable providers and total number of markets.
 * 
 * This function takes a list of providers, errors, and market results to calculate:
 * - reachable providers (those that are available)
 * - total number of markets
 * - number of tradable markets (markets with available base and quote amounts)
 * 
 * @param providers - The list of provider objects to be evaluated.
 * @param errors - The list of errors that may indicate unavailable providers.
 * @param marketResults - The market data associated with each provider.
 * @returns An object containing the reachable providers, total markets, and tradable markets count.
 */
export function calculateReachableProvidersAndTotalMarkets(
  providers: Provider[],
  errors: ErrorObject[],
  marketResults: ResultObject
): { reachableProviders: Provider[], totalMarkets: number, tradableMarkets: number } {

  // Filter providers based on availability (excluding those with an 'Endpoint not available' error)
  const reachableProviders: Provider[] = providers.filter((provider) =>
    !errors.some((error) => 
      error.endpoint === provider.endpoint && error.status === 'Endpoint not available'
    )
  )

  const totalMarkets: number = Object.values(marketResults).reduce((acc, { markets }) => {
    return acc + (markets?.length || 0)
  }, 0)

  // Calculate the number of tradable markets (markets with both base and quote amounts available)
  const tradableMarkets: number = Object.values(marketResults).reduce((acc, { markets }) => {
    return acc + (markets?.filter(market =>
      market.balances?.baseAmount !== null &&
      market.balances?.quoteAmount !== null
    ).length || 0)
  }, 0)

  return { reachableProviders, totalMarkets, tradableMarkets }
}

/**
 * Finds duplicate markets based on the exact same market data across different endpoints/providers.
 * 
 * In scenarios where multiple providers are reachable via different endpoints (for example, the same 
 * market data being accessible through multiple proxies or entry points), the same market instance might 
 * appear multiple times in the results. This function identifies such cases by checking if two or more 
 * endpoints/providers have identical market data, meaning they represent the same market but are reachable 
 * through different endpoints or providers.
 * 
 * The function groups these duplicate markets by their exact market data, ensuring that the same market 
 * is not reported multiple times, even if it is accessible through different routes. This is important for 
 * reducing redundancy in market listings and for identifying which providers are serving the same market data 
 * across various entry points. It handles edge cases like multiple endpoints for the same service or replicated 
 * market listings.
 * 
 * @param marketResults - The market data associated with various providers, structured by provider endpoint. 
 * Each entry in `marketResults` contains market data with values for different market-related parameters.
 * 
 * @returns A Map where keys are serialized market data (JSON stringified format), and values are objects containing:
 * - `endpoints`: An array of endpoints where the market data is available.
 * - `names`: An array of provider names that are associated with the duplicate market data.
 * 
 * This Map structure allows easy lookup of duplicate markets based on their exact data, showing all endpoints and 
 * provider names serving the same market.
 */
export function findDuplicateMarkets(marketResults: ResultObject): Map<string, { endpoints: string[], names: string[] }> {
  const marketDataMap = new Map<string, { endpoints: string[], names: string[] }>()
  const duplicates = new Map<string, { endpoints: string[], names: string[] }>()

  Object.entries(marketResults).forEach(([endpoint, { markets, providerName }]) => {
    // Skip providers that have no market data available
    if (markets.length === 0) {
      return 
    }

    const key = JSON.stringify(markets)

    if (marketDataMap.has(key)) {
      // Retrieve the original endpoints and provider names associated with this market data
      const { endpoints: originalEndpoints, names: originalNames } = marketDataMap.get(key)!

      // If the current endpoint is not yet added to duplicates, initialize it
      if (!duplicates.has(endpoint)) {
        duplicates.set(endpoint, { endpoints: [], names: [] })
      }
      
      // Add the original endpoint and provider name to the duplicate group for this market data
      const duplicateData = duplicates.get(endpoint)!
      duplicateData.endpoints.push(...originalEndpoints)
      duplicateData.names.push(...originalNames)

      // For each original endpoint, add the current endpoint as a duplicate
      originalEndpoints.forEach(originalEndpoint => {
        // If the original endpoint isn't already listed as a duplicate, initialize its entry
        if (!duplicates.has(originalEndpoint)) {
          duplicates.set(originalEndpoint, { endpoints: [], names: [] })
        }

        // Add the current endpoint and provider to the original endpoint's duplicate group
        const originalDuplicateData = duplicates.get(originalEndpoint)!
        originalDuplicateData.endpoints.push(endpoint)
        originalDuplicateData.names.push(providerName!)
      })
    } else {
      // If the market data isn't found in the map, add it with the current endpoint and provider name
      marketDataMap.set(key, { endpoints: [endpoint], names: [providerName!] })
    }
  })

  // Return the final map containing duplicate market data, with associated endpoints and provider names
  return duplicates
}
