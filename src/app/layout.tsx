'use client';
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {Providers} from "@/app/providers";
import Header from "../components/header";

const inter = Inter({subsets: ['latin']})

import "./globals.css";
import {useState} from "react";
import {AuthContextProps} from "@/providers/auth_context";

export default function RootLayout({children}: { children: React.ReactNode }) {
    const [authContext, setAuthContext] = useState<AuthContextProps>({
        logout: () => {
        },
        token: null,
        decodedToken: null,
    });

    return (
        <html lang="en" className='dark'>
        <body>
        <Providers authContext={authContext}>
            <Header setAuthContext={setAuthContext}/>
            {children}
        </Providers>
        </body>
        </html>
    );
}
