/**
 * MarketData represents the structure of data related to a specific market.
 * Includes asset types, balances, spot price, minimum tradeable amount, and fee structures.
 */
export type MarketData = {
    /** The base asset in the market (e.g., BTC, USD) */
    baseAsset: string

    /** The quote asset in the market (e.g., BTC, USD) */
    quoteAsset: string

    /** The balance details for the base and quote assets, or null if unavailable */
    balances: {
        baseAmount: string
        quoteAmount: string
    } | null

    /** The spot price of the base asset in terms of the quote asset, or null if unavailable */
    spotPrice: number | null

    /** The minimum amount required to trade in this market */
    minTradeableAmount: string

    /** Fee structure for trades in the market, defined separately for base and quote assets */
    fees: {
        baseFee: {
            fixed: string
            percentage: string
        }
        quoteFee: {
            fixed: string
            percentage: string
        }
    }
}

/**
 * ResultObject represents the aggregated market data for different provider endpoints.
 * Each endpoint URL maps to its market data and an optional provider name.
 */
export type ResultObject = {
    [url: string]: {
        markets: MarketData[]
        providerName?: string
    }
}

/**
 * ErrorObject defines the structure of error information.
 * Contains error status, message, and endpoint, with an optional provider name.
 */
export type ErrorObject = {
    /** HTTP status or general status of the error */
    status: string

    /** Error message description */
    message: string | null

    /** The endpoint that returned the error */
    endpoint: string

    /** Optional name of the provider associated with the error */
    providerName?: string
}

/**
 * Provider represents a service provider's details.
 * Includes name, endpoint URL, and an indicator if it's an Onion service.
 */
export type Provider = {
    /** The provider's display name */
    name: string

    /** The provider's service endpoint URL */
    endpoint: string

    /** Boolean indicating if the provider uses an Onion address (e.g., Tor network) */
    onion: boolean
}

/**
 * FetchMarketDataResponse defines the structure of the response received after fetching market data.
 * Contains optional data, endpoint, error message, and provider name.
 */
export type FetchMarketDataResponse = {
    /** The data returned from the fetch request, if successful */
    data?: MarketResults

    /** The endpoint URL queried for market data */
    endpoint?: string

    /** Error message if an error occurred */
    error?: string

    /** Optional name of the provider associated with the data/error */
    providerName?: string

    url?: string
}

/**
 * PriceDetails defines the structure of the price information for a market.
 * Contains the spot price, the minimum tradable amount, and balances for both base and quote assets.
 */
export type PriceDetails = {
    /** The spot price of the asset in the market */
    spotPrice: number

    /** The minimum amount that can be traded in the market */
    minTradableAmount: string

    /** The balance of the base and quote assets in the market */
    balance: { 
        /** The amount of the base asset available */
        baseAmount: string

        /** The amount of the quote asset available */
        quoteAmount: string
    }
} | undefined

/**
 * PriceResult defines the structure of the result when fetching price data for a market.
 * It includes the market object, price details (or null if unavailable), and any error message.
 */
export type PriceResult = {
    /** The market for which the price data is being fetched */
    market: Market

    /** The price details for the market or null if an error occurred */
    price: PriceDetails | null

    /** Any error message, or null if no error occurred */
    error: string | null
}

export type MarketError = {
    endpoint: { url: string, data: []}
    errors: ErrorObject[]
}

/**
 * ProviderContextType defines the shape of the Provider context's state and actions.
 * Includes data like providers, loading states, market results, errors, and statistics, along with handler functions.
 */
export type ProviderContextType = {
    /** List of available providers */
    providers: Provider[]

    /** Loading state for provider data */
    loading: boolean

    /** Loading state specifically for search operations */
    searchLoading: boolean

    /** The resulting market data aggregated by endpoint */
    marketResults: ResultObject | null

    /** Mapping of asset identifiers to their details, including name, precision, and mempool stats */
    assetData: Map<string, AssetInfo>

    /** Array of errors encountered, each with status, message, endpoint, and optional provider name */
    errors: ErrorObject[]

    /** Statistics related to the dashboard, including counts of reachable, total, and tradable markets */
    dashboardStats: {
        reachable: number
        totalMarkets: number
        tradableMarkets: number
    } | null

    /** Map indicating duplicate markets, with each entry showing duplicate endpoints and provider names */
    duplicateMarkets: Map<string, { endpoints: string[], names: string[] }>

    /** Loads the list of available providers */
    loadProviders: () => Promise<void>

    /** Handles provider selection changes, updating relevant data */
    handleProviderChange: (selectedProviders: Provider[]) => Promise<void>

    /** Fetches balances for all markets across selected providers */
    fetchAllMarketBalances: () => Promise<void>

    /** Adds a new provider to the list */
    handleAddProvider: (newProvider: Provider) => Promise<void>
}

/**
 * DashboardStatCardProps defines the props required by the DashboardStatCard component,
 * allowing it to be reused for displaying various stats on the dashboard. 
 * This approach enhances readability, scalability, and supports DRY (Don't Repeat Yourself) principles.
 */
export type DashboardStatCardProps = {
    /** 
     * Icon displayed alongside the stat, represented as a React node. 
     * Allows for flexibility in choosing different icon components.
     */
    icon: React.ReactNode

    /** 
     * Label text describing the stat, such as "Total Markets" or "Active Providers".
     * Helps users understand the meaning of the displayed value.
     */
    label: string

    /** 
     * The value of the stat being displayed, which can be a number or a string.
     * Provides flexibility for both numerical and text-based stats.
     */
    value: number | string
}

/**
 * ProviderSelectorProps - Properties for the ProviderSelector component.
 * 
 * This type defines the props required by the ProviderSelector component,
 * enabling a reusable and flexible interface for selecting and managing providers. 
 * The well-defined prop structure supports scalability, readability, and adherence to DRY principles.
 */
export type ProviderSelectorProps = {
    /**
     * Array of provider objects, each representing an available provider.
     * Each provider includes details like the endpoint and network type, 
     * which are used to categorize providers and display them in groups.
     */
    providers: Provider[]

    /**
     * Callback function triggered when a user selects providers from the list.
     * Receives an array of selected providers, allowing the parent component
     * to manage and use the selected list for further operations.
     */
    onSelectProvider: (providers: Provider[]) => void

    /**
     * Function that fetches market balances for all providers.
     * This is an optional convenience function, allowing users to fetch balances
     * without needing to select individual providers.
     */
    fetchAllMarketBalances: () => void

    /**
     * Boolean indicating whether a search or fetch operation is currently in progress.
     * Disables the fetch buttons while loading to prevent duplicate actions,
     * and displays a loading indicator to inform users of the process state.
     */
    searchLoading: boolean
}

/**
 * CustomProviderFormProps - Properties for the CustomProviderForm component.
 *
 * This type defines the props required by the CustomProviderForm component, ensuring
 * a type-safe and robust interface for adding custom providers. It provides a well-structured
 * prop definition, promoting clarity and ease of use while integrating with the form handling logic.
 */
export type CustomProviderFormProps = {
    /**
     * Callback function invoked when a new provider is successfully added via the form.
     * Receives a `Provider` object containing the provider's details (such as name and endpoint).
     * The parent component can use this function to add the new provider to its state
     * or perform other relevant actions upon form submission.
     * 
     * @param provider - The provider object to be added, containing attributes like name, endpoint, and onion status.
     */
    onAddProvider: (provider: Provider) => void

    /**
     * Boolean indicating the loading state of a search or fetch operation.
     * When set to `true`, it disables the submit button in the form, preventing
     * duplicate submissions. It also provides feedback to the user by showing a loading indicator.
     * This prop enhances user experience by signaling when the form is busy with an ongoing request.
     */
    searchLoading: boolean
}

/**
 * ProviderMarketDataProps - Properties for the ProviderMarketData component.
 * 
 * This type defines the props required by the ProviderMarketData component, which is 
 * responsible for displaying market data related to providers. It provides a robust 
 * and flexible interface, ensuring the component can handle different types of market 
 * data and associated error handling, supporting reusability and clarity in its design.
 */
export type ProviderMarketDataProps = {
    /**
     * Endpoint URL of the provider. This is the primary source of data for the provider's 
     * market information and is used for making network requests or referencing the provider's data.
     */
    endpoint: string

    /**
     * Array of market data objects. Each object contains market-related information such as 
     * prices, volumes, or other relevant metrics. This data is displayed in the component 
     * to provide users with up-to-date market statistics for the provider.
     */
    marketData: MarketData[]

    /**
     * The name of the provider. This is used to display the provider's identity or branding
     * in the component, providing context to the market data shown.
     */
    providerName: string

    /**
     * A map of asset data, keyed by asset symbol. Each entry includes the asset's name, 
     * precision, and mempool statistics, which are essential for calculating and presenting 
     * accurate market data, especially for transactions and market behavior analysis.
     */
    assetData: Map<string, AssetInfo>

    /**
     * An optional error object, which contains information about any error that may occur 
     * while fetching or processing market data. If provided, the component can display 
     * error messages or handle the error gracefully.
     */
    error?: ErrorObject

    /**
     * A flag indicating whether the data is a duplicate of another provider's market data.
     * This can be used to indicate that the data should be treated differently, such as in 
     * the case of combining or omitting duplicate entries.
     */
    isDuplicate?: boolean

    /**
     * An optional object describing the provider that this data is a duplicate of. It includes 
     * the `endpoints` and `names` of the original providers whose market data is considered 
     * duplicate. This information can be used for merging or filtering data.
     */
    duplicateOf?: { endpoints: string[], names: string[] }
}

/**
 * MarketCards - Properties for the MarketCard component.
 * 
 * This type defines the props required by the MarketCard component, which is responsible for displaying 
 * market data for various assets. It ensures that the component receives the necessary data to present 
 * market statistics, asset details, spot prices, fees, balances, and tradeable amounts in a structured 
 * and dynamic way. This design is flexible to accommodate various market data sources and enhances 
 * reusability and clarity in rendering.
 */
export type MarketCards = {
    /**
     * An array of market data objects. Each object contains detailed information about a specific market, 
     * including the assets involved, spot price, fees, balances, and tradeable amounts. This data is used 
     * to display the relevant market statistics for the provider.
     */
    marketData: MarketData[]

    /**
     * A map of asset data, keyed by asset symbol. Each entry in the map includes essential information about 
     * the asset such as its name, precision, and mempool statistics. This data is used to display detailed 
     * information about the assets involved in the markets and helps in formatting the market statistics correctly.
     */
    assetData: Map<string, AssetInfo>

    /**
     * The base URL for the Esplora blockchain explorer. This URL is used to provide direct links to asset 
     * and transaction details on the blockchain, allowing users to explore the blockchain data related to 
     * the assets and markets being displayed.
     */
    esplora: string
}

// Die `AssetDetailsProps`-Schnittstelle beschreibt die Eigenschaften, die an eine Komponente übergeben werden,
// die Details zu einem bestimmten Asset anzeigt. Sie enthält Informationen zum Asset-Typ, Namen, Präzision und 
// zu den zugehörigen Speicherstatistiken.

export type AssetDetailsProps = {
    // `assetType` gibt den Typ des Assets an, entweder 'Base' oder 'Quote'.
    // Das 'Base'-Asset ist das primäre Asset in einem Handelspaar (z. B. BTC in BTC/USD),
    // und 'Quote' ist das zweite Asset im Handelspaar (z. B. USD in BTC/USD).
    assetType: 'Base' | 'Quote'
    
    // `asset` ist der Bezeichner des Assets, z. B. 'BTC' oder 'USD'.
    asset: string 
    
    // `assetName` ist der vollständige Name des Assets, z. B. 'Bitcoin' oder 'US Dollar'.
    assetName: string
    
    // `assetPrecision` gibt die Anzahl der Dezimalstellen an, mit denen das Asset gehandhabt wird.
    // Beispielsweise kann Bitcoin 8 Dezimalstellen haben, während der US-Dollar keine Dezimalstellen benötigt.
    assetPrecision: number 
    
    // `assetMemStats` enthält Speicherstatistiken des Assets. Dies könnte JSON-Daten sein,
    // die Speicherinformationen des Assets darstellen. Standardmäßig ist es ein leeres Array,
    // wenn keine Daten vorliegen.
    assetMemStats: JSON | never[] 
    
    // `esplora` ist die URL zu einem Explora-Server, der als Schnittstelle zu einem Blockchain-Explorer dient.
    // Dies könnte verwendet werden, um auf Informationen zur Blockchain des Assets zuzugreifen.
    esplora: string
}

/**
 * Represents information about an asset in a market.
 * This structure contains basic information about the asset,
 * including its name, precision, and mempool statistics.
 */
export type AssetInfo = {
    /**
     * The name of the asset. This can be the name of a cryptocurrency or token.
     * Example: "Bitcoin", "Litecoin".
     */
    name: string

    /**
     * The precision of the asset, indicating how many decimal places can be used for the asset.
     * This is particularly important when calculating transaction amounts or fees.
     * Example: 8 for Bitcoin (up to 8 decimal places).
     */
    precision: number

    /**
     * Mempool statistics for the asset. This data is typically specific to the asset
     * and includes information on how transactions are handled in the mempool (transaction queue)
     * for this asset.
     * Example: A JSON object with specific statistics related to mempool usage.
     */
    mempool_stats: JSON
}

/**
 * Represents the result of a fetch operation, including the fetched data and any potential errors.
 * This structure is used to encapsulate the successful result and any errors that may have occurred
 * during the fetch operation, ensuring that the consuming code can handle both the result and errors appropriately.
 * 
 * @template T - The type of the results returned by the fetch operation. This allows the structure to be 
 * generalized for different data types, ensuring type safety.
 */
export type FetchResult<T> = {
    /**
     * The results of the fetch operation. This field contains the actual data retrieved from the request
     * and is typed according to the operation's expected result type.
     * Example: If the operation is fetching market balances, this could be an object representing those balances.
     */
    results: T

    /**
     * A list of errors encountered during the fetch operation. Each error is represented by an ErrorObject,
     * which provides details about the specific error, such as its status, message, and endpoint where it occurred.
     * If no errors occurred, this array will be empty.
     * Example: [{ status: 'error', message: 'Failed to fetch data', endpoint: '/api/fetch-market-balances' }]
     */
    errors: ErrorObject[]
}

// Explicit theme type for better type safety
export type Theme = 'light' | 'dark' | 'system'




/**
 * Fee represents the structure for fees applicable to base and quote assets.
 * Includes both percentage-based and fixed fees for each asset.
 */
type Fee = {
    percentageFee: {
        baseAsset: string
        quoteAsset: string
    }
    fixedFee: {
        baseAsset: string
        quoteAsset: string
    }
}

/**
 * Market represents a market structure, specifying base/quote assets and associated fees.
 */
export type Market = {
    /** The base asset in the market */
    baseAsset: string

    /** The quote asset in the market */
    quoteAsset: string

    /** Fees applicable for trades in the market */
    fee: Fee

    market?: Market
}

/**
 * MarketResults represents the result structure for a fetch operation, containing a list of markets.
 */
export type MarketResults = {
    /** Array of markets with their details */
    markets: Market[]
    price?: PriceDetails
}


/**
 * ResultData represents the result structure for a fetch operation from a specific endpoint.
 * It includes the endpoint URL, the fetched data (or an empty array if no data is available), 
 * and any errors related to the fetch operation.
 */
type ResultData = {
    /** Contains the URL of the endpoint and the fetched data (MarketData[] or an empty array) */
    endpoint: {
        /** The URL of the API endpoint that was queried */
        url: string

        /** The data fetched from the endpoint, can be MarketData[] or an empty array */
        data: MarketData[] | []
    }

    /** Optional list of errors associated with this particular fetch operation */
    errors?: ErrorObject[]

    /** Optional single error object if there's a global error for the entire endpoint */
    error?: ErrorObject[]
}

/**
 * Results is an array of ResultData objects, which represent the results of multiple fetch operations for different endpoints.
 */
export type Results = ResultData[]