// config/config.ts

export const DEFAULT_THEME = 'dark' // Default theme for the dashboard (dark or light)
export const DEFAULT_LANGUAGE: string = 'en' // Default language for the UI
export const debug: boolean = false // true = run with debug logs
export const btcAddress: string = "bc1q94ukzpqz62efpw900sht88rrcct2v5grc5qn8z" // bitcoin donation address
export const btcLiquidAddress: string = 'lq1qq2yl2werxx205634jj7el4uu4jk8jf48dtj0c82qjwnsphscxg35wpjhywm58e4wlcxer0r7g8vp8j03mv4nkp520e5alcyh0' // liquid bitcoin donation address
export const lightningAddress: string = "lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhhxarfvekx2erww46rjwqsgw7fd" // lightning donation address

/**
 * Default Blockstream Liquid Explorer URL for fetching asset data.
 * This URL serves as the default explorer for Liquid network assets.
 */
export const esplora: string = "https://blockstream.info/liquid/asset/"

/**
 * Blockstream Liquid API URL for interacting with the Liquid network's data.
 * This endpoint provides access to Liquid network APIs for transactions, blocks, and asset information.
 */
export const esploraApi: string = "https://blockstream.info/liquid/api/"

/**
 * Proxy URL for fetching onion (Tor) endpoints.
 * This proxy allows access to Tor-hidden services for TDEX network endpoints.
 * Ensure that the proxy URL is stable and accessible from the client.
 */
export const torProxyUrl: string = 'https://proxy.tdex.network/'

/**
 * LBTC hash used to uniquely identify a specific Liquid Bitcoin asset on the network.
 * This hash is often used for referencing the LBTC asset in transactions or balances.
 */
export const lbtcHash: string = '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d'

/**
 * URL for the TDEX network's development environment.
 * This URL links to the development instance of TDEX's core application, typically used for testing or staging.
 */
export const tdexUrl: string = 'https://dev.tdex.network/'

/**
 * URL for fetching the list of TDEX provider endpoints from the TDEX registry.
 * This JSON file provides a centralized list of all known TDEX providers and their metadata.
 */
export const PROVIDER_URL: string = 'https://raw.githubusercontent.com/tdex-network/tdex-registry/master/registry.json'
