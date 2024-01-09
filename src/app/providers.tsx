// app/providers.tsx
'use client'

import {NextUIProvider} from '@nextui-org/react'
import {QueryClient, QueryClientProvider} from "react-query";
import AuthContext, {AuthContextProps} from "@/providers/auth_context";
import {useState} from "react";
import { createSignalRContext } from "react-signalr/signalr";
import {baseApiUrl} from "@/config/base_url";

const SignalRContext = createSignalRContext();

const queryClient = new QueryClient()

export function Providers({children, authContext}: { children: React.ReactNode, authContext: AuthContextProps }) {
    const { token } = authContext;

    return (
        <QueryClientProvider client={queryClient}>
            <NextUIProvider>
                <AuthContext.Provider value={authContext}>
                    <SignalRContext.Provider
                        connectEnabled={token!==null}
                        accessTokenFactory={() => token!}
                        dependencies={[token]}

                        url={`${baseApiUrl}/hike-service/map-hub`}
                    >
                        {children}
                    </SignalRContext.Provider>
                </AuthContext.Provider>
            </NextUIProvider>
        </QueryClientProvider>
    )
}