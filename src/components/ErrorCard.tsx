// components/ErrorCard.tsx

'use client'

import { ErrorObject } from '@/types/types'
import { AlertCircle } from 'lucide-react'
import React, { useState } from 'react'

const ErrorCard: React.FC<{
    error: ErrorObject
    endpoint: string
}> = ({ error, endpoint }) => {
    const [showError, setShowError] = useState(false)

    return (
        <div className="mt-6 flex flex-col items-center justify-center">
            <div
                className={`${!showError ? 'text-red-600' : 'text-foreground italic'} cursor-pointer sm:text-base mb-4`}
                onClick={() => setShowError(!showError)}
            >
                <AlertCircle className="inline-block mr-2" />
                {!showError ? 'Error loading market data. Click for details.' : 'Click to close details'}
            </div>
            {showError && (
                <div className="mt-2 text-xs md:text-sm text-red-500 break-words w-full flex flex-col items-center justify-center">
                    <p className='max-w-full'><strong>Error Message:</strong> {error.message}</p>

                    <p className="text-foreground italic mt-2 mb-4">
                        Ensure the provided endpoint URL is correctly formatted.
                    </p>
                    
                    <p className="text-foreground max-w-full">
                        <strong>Tip:</strong> Verify that the endpoint is reachable by pinging it in your console:
                        <code className="block bg-accent text-accent-foreground p-2 mt-1 rounded font-semibold">
                            ping {endpoint}
                        </code>
                        or check with a tool like <code>curl</code> to see if a response is returned:
                        <code className="block bg-accent text-accent-foreground p-2 mt-1 rounded font-semibold">
                            curl -I {endpoint}
                        </code>
                    </p>

                    <div className="mt-4 text-left text-foreground space-y-2 max-w-full">
                        <p><strong>Expected Results:</strong></p>
                        <ul className="list-disc list-inside">
                            <li>
                                <code>ping</code>: If the endpoint is reachable, you should see a series of responses showing the time taken (in ms). For example:
                                <code className="block bg-card-bg-light/60 dark:bg-card-bg-dark/60 p-2 mt-1 mb-2 rounded">
                                    Reply from [IP address]: bytes=32 time=20ms TTL=54
                                </code>
                                If the endpoint is not reachable, you might see:
                                <code className="block bg-card-bg-light/60 dark:bg-card-bg-dark/60 p-2 mt-1 rounded">
                                    Request timed out.
                                </code>
                            </li>
                            <li className="mt-5">
                                <code>curl -I</code>: If the server responds, you’ll see HTTP headers with a status code. A successful response typically starts with:
                                <code className="block bg-card-bg-light/60 dark:bg-card-bg-dark/60 p-2 mt-1 mb-2 rounded">
                                    HTTP/1.1 200 OK
                                </code>
                                If there’s an issue, you might see an error like:
                                <code className="block bg-card-bg-light/60 dark:bg-card-bg-dark/60 p-2 mt-1 rounded">
                                    curl: (7) Failed to connect to {endpoint}
                                </code>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ErrorCard
