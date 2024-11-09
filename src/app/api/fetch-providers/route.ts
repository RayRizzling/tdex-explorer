// app/api/fetch-providers/route.ts

import { addOnionFlag, fetchExternalProviders, getFallbackProviders } from '@/lib/apiUtils'
import { Provider } from '@/types/types'
import { NextResponse } from 'next/server'

// Defines the revalidation interval for the route in seconds. 
// The cached response will be considered stale after 3600 seconds (1 hour).
export const revalidate = 3600

/**
 * API Route handler to fetch provider data.
 * 
 * This route attempts to fetch a list of providers from an external source. 
 * If the external fetch fails, it falls back to a locally stored provider data.
 * The response includes a list of providers, with each provider having an additional 
 * 'onion' flag indicating whether the provider's endpoint is a Tor hidden service.
 * 
 * The function:
 * 1. Attempts to fetch providers from an external source.
 * 2. If the external fetch fails, it falls back to a local dataset.
 * 3. Returns the list of providers, with an added 'onion' flag, in JSON format.
 * 4. In case of errors, a JSON response indicating the failure is returned.
 * 
 * @returns A JSON response containing the list of providers, including the 'onion' flag, or an error message.
 */
export async function GET() {
    try {
        // Attempt to fetch provider data from an external source
        const providers: Provider[] = await fetchExternalProviders()

        // Add 'onion' flag to each provider based on its endpoint
        const providersWithOnionFlag: Provider[] = addOnionFlag(providers)

        // Return the providers in JSON format
        return NextResponse.json(providersWithOnionFlag)
    } catch (error) {
        console.error('Error fetching providers:', error)

        try {
            // If the external fetch fails, fallback to local provider data
            const fallbackProviders: Provider[] = getFallbackProviders()

            // Return the fallback provider data in JSON format
            return NextResponse.json(fallbackProviders)
        } catch (fallbackError) {
            console.error('Error fetching fallback data:', fallbackError)

            // Return an error message if both external fetch and fallback fail
            return NextResponse.json({ error: 'Unable to fetch providers' }, { status: 500})
        }
    }
}
