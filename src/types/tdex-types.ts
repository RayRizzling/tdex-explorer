//This type is not used at the moment, it was added to show the have a type of the provider response structure



/**
 * ProviderResponse - Represents the structure of responses from TDEX provider endpoints.
 * 
 * This type defines the shape of data returned by TDEX provider endpoints, specifically
 * tailored to the BOTD (Basis of Trade Definition) specifications of TDEX. It encapsulates
 * both market data results and metadata about the fetch operation, providing a comprehensive
 * view of the provider's market information and the status of the data retrieval process.
 */
export type ProviderResponse = {
    /**
     * marketResults - Contains the actual market data returned by TDEX endpoints.
     * This object may include data from multiple endpoint types, such as listMarkets
     * and getMarketPrice, allowing for flexible and comprehensive market information retrieval.
     */
    marketResults: {
      /**
       * listMarkets - Optional data returned from the listMarkets endpoint.
       * When present, it provides an array of available markets with their associated fee structures.
       */
      listMarkets?: {
        /**
         * markets - An array of market objects, each representing a tradable pair of assets
         * along with its fee structure. This data is crucial for understanding available
         * trading options and their associated costs on the TDEX platform.
         */
        markets: Array<{
          /**
           * market - Defines the trading pair for this market.
           * Contains the base and quote assets that form the market.
           */
          market: {
            /**
             * baseAsset - The identifier for the base asset in the trading pair.
             * In TDEX, this is typically represented as a string (e.g., an asset hash).
             */
            baseAsset: string
            /**
             * quoteAsset - The identifier for the quote asset in the trading pair.
             * Similar to baseAsset, this is usually a string representing the asset.
             */
            quoteAsset: string
          }
          /**
           * fee - The fee structure applied to trades in this market.
           * TDEX uses a combination of percentage and fixed fees for both base and quote assets.
           */
          fee: {
            /**
             * percentageFee - The percentage-based fee structure for this market.
             * Fees are specified separately for base and quote assets.
             */
            percentageFee: {
              baseAsset: string
              quoteAsset: string
            }
            /**
             * fixedFee - The fixed fee structure for this market.
             * Like percentage fees, fixed fees are specified for both base and quote assets.
             */
            fixedFee: {
              baseAsset: string
              quoteAsset: string
            }
          }
        }>
      }
      /**
       * getMarketPrice - Optional data returned from the getMarketPrice endpoint.
       * When present, it provides current price information and balance for a specific market.
       */
      getMarketPrice?: {
        /**
         * spotPrice - The current spot price in the market.
         * Represents the instantaneous market rate for the trading pair.
         */
        spotPrice: number
        /**
         * minTradableAmount - The minimum amount that can be traded in this market.
         * Specified as a string to maintain precision for assets with high decimal places.
         */
        minTradableAmount: string
        /**
         * balance - The current balance information for the market.
         * Provides liquidity information for both the base and quote assets.
         */
        balance: {
          baseAmount: string
          quoteAmount: string
        }
      }
    }
    /**
     * fetchMetadata - Contains metadata about the fetch operation itself.
     * This information is crucial for error handling, debugging, and identifying the data source.
     */
    fetchMetadata: {
      /**
       * endpoint - The URL of the TDEX provider endpoint that was queried.
       * Useful for tracking which provider supplied the data or where an error occurred.
       */
      endpoint?: string
      /**
       * error - An optional error message if the fetch operation encountered issues.
       * When present, it indicates that the data retrieval was not successful.
       */
      error?: string
      /**
       * providerName - An optional identifier for the TDEX provider.
       * Can be used to associate the response with a specific known provider in the system.
       */
      providerName?: string
    }
  }