// app/api/fetch-market-balances/route.ts

import { createResultObject, determineStatus, fetchAndProcessMarketData } from '@/lib/apiUtils'
import { isValidUrl } from '@/lib/utils'
import { ErrorObject, Results } from '@/types/types'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Handles fetching market data from multiple endpoints and processing it.
 * 
 * This function accepts a list of endpoint URLs, fetches market and price data for each endpoint,
 * and processes it. The result is a structured response containing market data and any errors
 * encountered during the fetch process.
 * 
 * @param {NextRequest} req - The incoming request object containing the list of endpoints.
 * 
 * @returns {NextResponse} A JSON response containing the processed market data and any errors.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    if (req.method !== 'POST') {
      return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 })
    }
  
    const { endpoints }: { endpoints: string[] } = await req.json()
  
    if (!Array.isArray(endpoints) || endpoints.length === 0) {
      return NextResponse.json({ error: 'Endpoints are required and must be a non-empty array' }, { status: 400 })
    }
  
    const invalidEndpoints = endpoints.filter(endpoint => !isValidUrl(endpoint))
    if (invalidEndpoints.length > 0) {
      return NextResponse.json({ error: `Invalid endpoints: ${invalidEndpoints.join(', ')}` }, { status: 400 })
    }
  
    try {
      const results: Results = await fetchAndProcessMarketData(endpoints)
      const allErrors: ErrorObject[] = results.flatMap(r => r.errors || [])
  
      const response = {
        results: createResultObject(results),
        errors: allErrors.length ? allErrors : undefined,
      }
  
      const status: number = determineStatus(allErrors)

      return NextResponse.json(response, { status })
    } catch (error) {
      console.error('Error processing market data:', error)
      return NextResponse.json({ error: 'Failed to process market data' }, { status: 500 })
    }
  }
  