// context/ProviderContext.tsx

'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'
import { Provider, ErrorObject, ResultObject, ProviderContextType, FetchResult } from "@/types/types"
import { fetchProviders, fetchMarketBalances } from "@/lib/fetchFunctions"
import { fetchAllAssetsData } from "@/lib/actions"
import { calculateReachableProvidersAndTotalMarkets, findDuplicateMarkets, isValidUrl } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

const ProviderContext = createContext<ProviderContextType | undefined>(undefined)

/**
 * Hook to access the provider context.
 * @returns {ProviderContextType} The provider context value.
 * @throws {Error} Throws an error if the context is used outside of its provider.
 */
export const useProviderContext = (): ProviderContextType => {
  const context = useContext(ProviderContext)
  if (!context) {
    throw new Error("useProviderContext must be used within a ProviderContext")
  }
  return context
}

/**
 * ProviderContext is the context provider that wraps the component tree and provides
 * the necessary state and functions related to providers.
 */
export const ProviderContextHooks = ({ children }: { children: ReactNode }) => {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [marketResults, setMarketResults] = useState<ResultObject | null>(null)
  const [assetData, setAssetData] = useState<Map<string, { name: string, precision: number, mempool_stats: JSON }>>(new Map())
  const [errors, setErrors] = useState<ErrorObject[]>([])
  const [dashboardStats, setDashboardStats] = useState<{
    reachable: number
    totalMarkets: number
    tradableMarkets: number
  } | null>(null)
  const [duplicateMarkets, setDuplicateMarkets] = useState<Map<string, { endpoints: string[], names: string[] }>>(new Map())  

  const { toast } = useToast()

  /**
   * Loads the provider data asynchronously and updates the state.
   * Displays a toast message on success or error.
   * @returns {Promise<void>} A promise that resolves when the loading is complete.
   */
  const loadProviders = async (): Promise<void> => {
    setLoading(true)
    try {
      const providersData: Provider[] = await fetchProviders()
      setProviders(providersData)
    } catch (error) {
      toast({
        title: "Error loading providers",
        description: "Could not fetch providers data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles provider selection changes, fetches market balances for the selected providers,
   * and updates the context state.
   * @param {Provider[]} selectedProviders The providers selected by the user.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  const handleProviderChange = async (selectedProviders: Provider[]): Promise<void> => {
    if (selectedProviders.length === 0) {
      toast({
        title: "No provider selected",
        description: "Please select at least one provider from the list",
        variant: "destructive"
      })
      return
    }

    setSearchLoading(true)

    const endpointToNameMap: Map<string, string> = new Map<string, string>()
    selectedProviders.forEach((provider) => {
      endpointToNameMap.set(provider.endpoint, provider.name)
    })

    const endpoints: string[] = selectedProviders.map((provider) => provider.endpoint)
    try {
      const result: FetchResult<ResultObject>= await fetchMarketBalances(endpoints)

      if (result.errors) {
        setErrors(result.errors)
      }

      const resultsWithNames: ResultObject = {}
      if (result.results) {
        for (const [endpoint, data] of Object.entries(result.results)) {
          resultsWithNames[endpoint] = {
            ...data,
            providerName: endpointToNameMap.get(endpoint),
          }
        }
      }

      const assetData: ProviderContextType['assetData'] = await fetchAllAssetsData(resultsWithNames)

      setAssetData(assetData)
      setMarketResults(resultsWithNames)

      const { reachableProviders, totalMarkets, tradableMarkets }: { 
        reachableProviders: Provider[]
        totalMarkets: number
        tradableMarkets: number 
      } = calculateReachableProvidersAndTotalMarkets(selectedProviders, result.errors || [], resultsWithNames)

      setDashboardStats({
        reachable: reachableProviders.length,
        totalMarkets,
        tradableMarkets
      })

      if (resultsWithNames) {
        const duplicates: Map<string, {
            endpoints: string[]
            names: string[]
        }> = findDuplicateMarkets(resultsWithNames)

        setDuplicateMarkets(duplicates)
      }
    } catch (error) {
      toast({
        title: "Error fetching market balances",
        description: "An error occurred while fetching market balances",
        variant: "destructive"
      })
    } finally {
      setSearchLoading(false)
    }
  }

  /**
   * Fetches market balances for all providers, updates the context state, and displays
   * relevant toast messages.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  const fetchAllMarketBalances = async (): Promise<void> => {
    setSearchLoading(true)
    const endpointToNameMap: Map<string, string> = new Map<string, string>()
    providers.forEach((provider) => {
      endpointToNameMap.set(provider.endpoint, provider.name)
    })

    const endpoints: string[] = providers.map((provider) => provider.endpoint)
    try {
      const result: FetchResult<ResultObject> = await fetchMarketBalances(endpoints)

      if (result.errors) {
        setErrors(result.errors)
      }

      const resultsWithNames: ResultObject = {}
      if (result.results) {
        for (const [endpoint, data] of Object.entries(result.results)) {
          resultsWithNames[endpoint] = {
            ...data,
            providerName: endpointToNameMap.get(endpoint),
          }
        }
      }

      const assetData: ProviderContextType['assetData'] = await fetchAllAssetsData(resultsWithNames)

      setAssetData(assetData)
      setMarketResults(resultsWithNames)

      const { reachableProviders, totalMarkets, tradableMarkets }: { 
        reachableProviders: Provider[]
        totalMarkets: number
        tradableMarkets: number 
      } = calculateReachableProvidersAndTotalMarkets(providers, result.errors || [], resultsWithNames)
      setDashboardStats({
        reachable: reachableProviders.length,
        totalMarkets,
        tradableMarkets
      })

      if (resultsWithNames) {
        const duplicates: Map<string, {
            endpoints: string[]
            names: string[]
        }> = findDuplicateMarkets(resultsWithNames)

        setDuplicateMarkets(duplicates)
      }
    } catch (error) {
      toast({
        title: "Error fetching market balances",
        description: "An error occurred while fetching market balances",
        variant: "destructive"
      })
    } finally {
      setSearchLoading(false)
    }
  }

  /**
   * Adds a new provider to the list of providers after validating the provider's URL.
   * @param {Provider} newProvider The new provider to be added.
   * @returns {Promise<void>} A promise that resolves when the provider is successfully added.
   */
  const handleAddProvider = async (newProvider: Provider): Promise<void> => {
    if (!isValidUrl(newProvider.endpoint)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL format",
        variant: "destructive"
      })
      return
    }

    const existingProvider: Provider | undefined = providers.find(provider => provider.endpoint === newProvider.endpoint)
    if (existingProvider) {
      toast({
        title: "Provider Already Exists",
        description: "The provider with this URL is already in the list",
        variant: "destructive"
      })
      return
    }

    try {
      await handleProviderChange([newProvider])
      setProviders(prevProviders => [...prevProviders, newProvider])
      toast({
        title: "Custom provider fetched",
        description: "The provider data was added to the list in your session.",
      })
    } catch (e) {
      toast({
        title: "Something went wrong",
        description: "Reload the page and try again",
        variant: "destructive"
      })
    }
  }

  return (
    <ProviderContext.Provider value={{
      providers,
      loading,
      searchLoading,
      marketResults,
      assetData,
      errors,
      dashboardStats,
      duplicateMarkets,
      loadProviders,
      handleProviderChange,
      fetchAllMarketBalances,
      handleAddProvider
    }}>
      {children}
    </ProviderContext.Provider>
  )
}
