// components/ProviderSelector.tsx

'use client'

import {
   MultiSelect,
   MultiSelectContent,
   MultiSelectGroup,
   MultiSelectItem,
   MultiSelectList,
   MultiSelectSearch,
   MultiSelectTrigger,
   MultiSelectValue,
} from '@/components/ui/multi-select'
import { ProviderSelectorProps } from '@/types/types'
import { useState } from 'react'
import { Button } from './ui/button'
import { Eye, EyeOff, Trash2 } from 'lucide-react'

/**
 * ProviderSelector Component
 * Allows users to select from a list of providers to fetch data.
 * Supports both HTTP and Tor providers.
 * 
 * Props:
 * - `providers`: List of providers (http and tor).
 * - `onSelectProvider`: Function to handle selected providers.
 * - `fetchAllMarketBalances`: Function to fetch balances for all providers.
 * - `searchLoading`: Boolean indicating if search is in progress.
 */
export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
   providers,
   onSelectProvider,
   fetchAllMarketBalances,
   searchLoading
}) => {
   // Manages the selected provider endpoints
   const [selectedValues, setSelectedValues] = useState<string[]>([])

   // Separate providers by type
   const httpProviders = providers.filter(provider => !provider.onion)
   const torProviders = providers.filter(provider => provider.onion)

   /**
    * Triggers search for selected providers only
    */
   const handleStartSearch = () => {
       const selectedProviders = providers.filter(provider =>
           selectedValues.includes(provider.endpoint)
       )
       onSelectProvider(selectedProviders)
   }

   /**
    * Resets the selected providers
    */
   const handleResetSelection = () => {
       setSelectedValues([])
   }

   return (
      <div className="flex flex-col items-center w-full md:min-w-[400px] max-w-md bg-secondary/30 border p-4 rounded-lg shadow-md">
         
         {/* Header with provider count and reset button */}
         <div className='flex justify-between w-full mb-2 text-primary'>
            <p>Select from {providers.length} providers</p>
            <Trash2
               className='h-4 cursor-pointer'
               onClick={handleResetSelection}
            />
         </div>

         {/* MultiSelect dropdown for providers */}
         <MultiSelect value={selectedValues} onValueChange={setSelectedValues}>
            <MultiSelectTrigger className="w-full max-w-screen-md hover:cursor-pointer">
               <MultiSelectValue placeholder="Select providers to fetch..." />
            </MultiSelectTrigger>
            <MultiSelectContent>
               <MultiSelectSearch placeholder="Search provider..." />
               <MultiSelectList>
                  {/* HTTP Providers Group */}
                  <MultiSelectGroup heading={<span className='flex items-center'>
                     <Eye className='mr-2'/>
                     <p className='text-sm font-bold italic'>Clearnet</p>
                  </span>}>
                     {httpProviders.map(provider => (
                        <MultiSelectItem
                           key={provider.endpoint}
                           value={provider.endpoint}
                           className='data-[disabled]:pointer-events-auto hover:cursor-pointer'
                        >
                           {provider.name}
                        </MultiSelectItem>
                     ))}
                  </MultiSelectGroup>

                  {/* Tor Providers Group */}
                  <MultiSelectGroup heading={<span className='flex items-center'>
                     <EyeOff className='mr-2'/>
                     <p className='text-sm font-bold italic'>Onion</p>
                  </span>}>
                     {torProviders.map(provider => (
                        <MultiSelectItem
                           key={provider.endpoint}
                           value={provider.endpoint}
                           className='data-[disabled]:pointer-events-auto hover:cursor-pointer'
                        >
                           {provider.name}
                        </MultiSelectItem>
                     ))}
                  </MultiSelectGroup>
               </MultiSelectList>
            </MultiSelectContent>
         </MultiSelect>

         {/* Buttons for fetching providers */}
         <div className='flex flex-col md:flex-row items-center gap-2 mt-2 w-full'>
            <Button
               onClick={handleStartSearch}
               variant='secondary'
               disabled={searchLoading}
               className='w-full'
               title="Fetch selected providers"
            >
               {searchLoading ? 'Fetching...' : 'Fetch Selected Providers'}
            </Button>
            <Button
               onClick={fetchAllMarketBalances}
               variant='outline'
               disabled={searchLoading}
               className='h-8 w-full'
               title="Fetch all providers"
            >
               {searchLoading ? 'Fetching...' : 'Fetch All Providers'}
            </Button>
         </div>
      </div>
   )
}
