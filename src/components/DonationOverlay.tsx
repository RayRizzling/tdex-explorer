import React, { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "./ui/button"
import { btcAddress, btcLiquidAddress, lightningAddress } from "@/config/config"
import { useToast } from "./ui/use-toast"
import Image from "next/image"
import { BackgroundBeams } from "./ui/background-beams"

interface DonationOverlayProps {
  isVisible: boolean
  onClose: () => void
}

export const DonationOverlay: React.FC<DonationOverlayProps> = ({
  isVisible,
  onClose
}) => {
  const [selectedAddress, setSelectedAddress] = useState<'btc' | 'btcLiquid' | 'lightning' | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { toast } = useToast()

  // Handle change of the donation method
  const handleAddressChange = (address: 'btc' | 'btcLiquid' | 'lightning') => {
    setSelectedAddress(address)
    setIsDropdownOpen(false) // Close dropdown when selection is made
  }

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
        toast({
            title: 'Address copied to clipboard!',
            duration: 2500
        })
    }).catch(err => {
      toast({
        title: 'Failed to copy address:',
        description: err,
        duration: 2500
      })
    })
  }

  // Mapping addresses to their respective QR codes and background colors
  const getAddressAndQRCode = () => {
    switch (selectedAddress) {
      case 'btc':
        return { address: btcAddress, qrCodeValue: `bitcoin:${btcAddress}`, qrCodeBgColor: "#FF9900" } // orange
      case 'btcLiquid':
        return { address: btcLiquidAddress, qrCodeValue: `liquid:${btcLiquidAddress}`, qrCodeBgColor: "#007AFF" } // blue
      case 'lightning':
        return { address: lightningAddress, qrCodeValue: lightningAddress, qrCodeBgColor: "#FFDD00" } // yellow
      default:
        return { address: '', qrCodeValue: '', qrCodeBgColor: "#ffffff" } // default white background for QR code
    }
  }

  if (!isVisible) return null

  const { address, qrCodeValue, qrCodeBgColor } = getAddressAndQRCode()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-lg w-full space-y-4">
        <h2 className="text-xl font-bold text-center text-foreground">Donate Bitcoin <p className="italic text-lg font-semibold text-gray-700 dark:text-white/80">and support this project</p></h2>

        {/* Custom Address Selector */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Please choose a donation method:</p>
          <div className="relative inline-block text-left min-w-40">
            {/* Display the selected address */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
              className="cursor-pointer flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-700 rounded-md"
            >
              {selectedAddress ? (
                <>
                  <Image height={64} width={64} src={`/${selectedAddress}.png`} alt={`${selectedAddress} logo`} className="w-7 h-7 mr-2" />
                  <span className="text-gray-800 dark:text-gray-300">
                    {selectedAddress === 'btc' ? 'Bitcoin native' : selectedAddress === 'btcLiquid' ? 'Liquid Bitcoin' : 'Lightning'}
                  </span>
                </>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">Select layer</span>
              )}
            </div>

            {/* Dropdown menu with options */}
            {isDropdownOpen && (
              <div className="absolute mt-2 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md whitespace-nowrap min-w-fit">
                <div
                  className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center rounded-md"
                  onClick={() => handleAddressChange('btc')}
                >
                  <Image width={32} height={32} src="/btc.png" alt="Bitcoin logo" className="w-5 h-5 mr-2" />
                  Bitcoin native
                </div>
                <div
                  className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center rounded-md"
                  onClick={() => handleAddressChange('btcLiquid')}
                >
                  <Image width={32} height={32} src="/btcLiquid.png" alt="Liquid Bitcoin logo" className="w-5 h-5 mr-2" />
                  Liquid Bitcoin
                </div>
                <div
                  className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center rounded-md"
                  onClick={() => handleAddressChange('lightning')}
                >
                  <Image width={32} height={32} src="/lightning.png" alt="Lightning logo" className="w-5 h-5 mr-2" />
                  Lightning
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QR Code and Address Display */}
        {selectedAddress && (
          <>
            <div className="flex justify-center mb-4 bg-black/30 dark:bg-white/80 w-fit justify-self-center p-2 rounded-xl">
              <QRCodeSVG value={qrCodeValue} size={256} bgColor={qrCodeBgColor} fgColor="#000000"/>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Address:</p>
              <p 
                className="font-mono text-gray-800 dark:text-gray-300 cursor-pointer truncate"
                onClick={() => copyToClipboard(address)}
              >
                {address}
              </p>
            </div>
          </>
        )}

        {/* Close Button */}
        <div className="text-center">
          <Button 
            variant="outline"   
            onClick={() => {
              setIsDropdownOpen(false)
              onClose()
            }}
          >
            Close
          </Button>
        </div>
        <BackgroundBeams className="-z-10" />
      </div>
    </div>
  )
}
