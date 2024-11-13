// lib/fetchFunctions.ts

import { debug, esploraApi, lbtcHash } from '@/config/config'
import { ResultObject, ErrorObject, Provider, FetchResult, Market, FetchMarketDataResponse, MarketResults, AssetInfo } from '@/types/types'
import { getProxyUrl } from './utils'

/**
 * Handles errors encountered during a fetch operation by logging the error and returning
 * a standardized result with the fallback data and an error message.
 * This function ensures that even if the fetch operation fails, the application can still
 * return a consistent result structure, making it easier to handle errors gracefully.
 *
 * @template T - The type of the results returned by the fetch operation. This allows the 
 * structure to be generalized for different types of data.
 * 
 * @param error - The error encountered during the fetch operation. This will typically be an instance of the 
 * JavaScript `Error` object.
 * @param fallback - A fallback value that will be returned in case of an error. This ensures that the 
 * structure remains consistent, even when the fetch fails.
 * @param customMessage - A custom error message to be used in case the error doesn't contain a message.
 * 
 * @returns {FetchResult<T>} - A standardized result object that contains the fallback data
 * in the `results` field and an array of error objects in the `errors` field.
 */
function handleFetchError<T>(
    error: Error,
    fallback: T,
    customMessage: string
): FetchResult<T> {
    const errorMessage = error.message || customMessage
    console.error('Fetch error:', errorMessage)
    
    return { 
        results: fallback, 
        errors: [{ status: 'error', message: errorMessage, endpoint: 'unknown' }] 
    }
}

/**
 * Fetches market balances from the server by sending a POST request to the API endpoint.
 * This function handles the request, checks for success, parses the response, and returns
 * the results along with any errors that occurred during the process. In case of a failure,
 * it delegates error handling to the `handleFetchError` function.
 *
 * @param endpoints - An array of endpoint URLs for which market balances are being fetched.
 * These are passed in the request body and define the scope of the fetch operation.
 * 
 * @returns {Promise<FetchResult<ResultObject>>} - A promise that resolves to an object containing
 * the fetched results (if successful) or a fallback value with the corresponding errors if the fetch fails.
 * The `results` field contains the fetched data, while the `errors` field contains any errors encountered.
 */
export async function fetchMarketBalances(endpoints: string[]): Promise<FetchResult<ResultObject>> {
    try {
        const response = await fetch('/api/fetch-market-balances', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoints }),
        })

        if (!response.ok) {
            throw new Error('Failed to fetch market balances')
        }

        const data: { results: ResultObject; errors?: ErrorObject[] } = await response.json()
        
        // Return the fetched results along with any errors (if present)
        return { results: data.results, errors: data.errors || [] }
    } catch (error) {
        // Handle the error and return a standardized result with the fallback data and error message
        return handleFetchError<ResultObject>(
            error instanceof Error ? error : new Error('Unknown error occurred'), 
            {}, 
            'An unknown error occurred while fetching market balances'
        )
    }
}

/**
 * Fetches a list of providers from the server by making a request to the `/api/fetch-providers` endpoint.
 * If the fetch operation fails, the function handles the error gracefully by using the `handleFetchError` function.
 * This approach ensures consistent error handling and maintains type safety throughout the process.
 *
 * @returns {Promise<Provider[]>} - A promise that resolves to an array of `Provider` objects if the fetch is successful,
 * or an empty array if an error occurs. The empty array serves as a fallback when errors are encountered.
 */
export async function fetchProviders(): Promise<Provider[]> {
    try {
        const response = await fetch('/api/fetch-providers')

        if (!response.ok) {
            throw new Error('Failed to fetch providers')
        }

        const data: Provider[] = await response.json()
        return data

    } catch (error) {
        // Handle the error by using the handleFetchError function and return an empty array as fallback
        return handleFetchError<Provider[]>(error instanceof Error ? error : new Error('Unknown error occurred'), [], 'An unknown error occurred while fetching providers').results
    }
}

/**
 * Fetches asset data from the Esplora API for a given asset hash.
 * This function handles the fetching process for asset data and includes error handling
 * by rejecting the promise if any error occurs.
 * It also includes special handling for L-BTC, returning a hardcoded precision of 8.
 *
 * @param {string} assetHash - The unique hash of the asset.
 * @returns {Promise<{ assetHash: string } & AssetInfo>} 
 * A promise that resolves to the asset's data or rejects with an error message.
 */
export const fetchAssetData = async (assetHash: string): Promise<{ assetHash: string } & AssetInfo> => {
    return new Promise(async (resolve, reject) => {
        try {
            const response: Response = await fetch(`${esploraApi}asset/${assetHash}`)
            if (!response.ok) {
                return reject(new Error(`Esplora response was not ok ${response.statusText}`))
            }

            const data: AssetInfo = await response.json()

            // Special handling for L-BTC
            if (assetHash === lbtcHash) {
                return resolve({ assetHash, name: 'L-BTC', precision: 8, mempool_stats: data.mempool_stats })
            }

            const { name, precision, mempool_stats }: AssetInfo = data

            return resolve({ assetHash, name, precision, mempool_stats })
        } catch (error) {
            return reject(new Error(`Failed to fetch data for asset ${assetHash}: ${error instanceof Error ? error.message : 'Unknown error'}`))
        }
    })
}

/**
 * Fetches market data from a specified endpoint with a given path and optional request body.
 * This function performs a POST request to retrieve market data, handling various error scenarios
 * such as SSL errors, server errors, and other unsuccessful HTTP statuses.
 *
 * In the case of specific error statuses, the function logs an error and returns a structured
 * response with an error message. A successful response returns the market data along with the endpoint.
 *
 * @param {string} endpoint - The base URL for the market data API.
 * @param {string} path - The specific path for the market data endpoint.
 * @param {Market} [body] - Optional request payload for the API call.
 * @returns {Promise<FetchMarketDataResponse>} 
 * A promise that resolves to the market data or an error message if the fetch operation fails.
 */
export const fetchMarketData = async (endpoint: string, path: string, body?: Market): Promise<FetchMarketDataResponse> => {
    let errorMessage: string
    try {
        const url: string = getProxyUrl(`${endpoint}/v2${path}`)

        // Make a POST request to the API with an optional body
        const response: Response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : undefined,
        })

        // Handle SSL errors specifically
        if (response.status === 526) {
            errorMessage = await response.text()
            console.error(`SSL error on ${url}`)
            return { error: `SSL error on ${url}: ${errorMessage} for ${JSON.stringify(body)}` }
        }

        if (response.status === 500) {
            errorMessage = await response.text()
            console.error(`Server error on ${url}: ${errorMessage}`)
            return { error: `Server error on ${url}: ${errorMessage} for ${JSON.stringify(body)}` }
        }

        if (response.status === 404) {
            try {
                const urlV1: string = getProxyUrl(`${endpoint}/v1${path}`)
                const responseV1: Response = await fetch(urlV1, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body ? JSON.stringify(body) : undefined,
                })
                const responseV1Data: MarketResults = responseV1.ok ? await responseV1.json() : await responseV1.text()
                
                if (typeof responseV1Data === 'string') {
                    console.error(`Error fetching data from v1: ${responseV1Data}`)
                    return { error: `Failed to fetch data from ${urlV1}. Error: ${responseV1Data}`, url: urlV1 }
                }
                return { data: responseV1Data, endpoint}
            } catch (errorV1) {
                console.error(`Error fetching from v1 URL: ${errorV1}`)
                return { error: `Error fetching data from v1 endpoint: ${errorV1}`, endpoint }
            }
        } else if (!response.ok) {
            errorMessage = await response.text()
            console.error(`Error fetching data from ${url}. Status: ${response.status}. Error: ${errorMessage}`)
            return { error: `Failed to fetch data from ${url}. Status: ${response.status}. Error: ${errorMessage}`, url }
        }

        // Parse the response JSON to obtain market data
        const responseData: MarketResults = await response.json()

        if (debug) {
            console.log(`Response from ${url}:`)
            console.dir(responseData, { depth: null })
        }

        // Return the successful response data along with the endpoint
        return { data: responseData, endpoint }
    } catch (error) {
        // Handle any other errors, including network issues
        errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error(`Error fetching data from ${endpoint}:`, errorMessage)
        return { error: `Error fetching data from ${endpoint}: ${errorMessage}`, endpoint }
    }
}
