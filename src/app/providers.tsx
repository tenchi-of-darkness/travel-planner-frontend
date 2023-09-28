// app/providers.tsx
'use client'

import {NextUIProvider} from '@nextui-org/react'
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient()

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </QueryClientProvider>
    )
}