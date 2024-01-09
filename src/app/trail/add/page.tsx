'use client'

import React, {useContext} from "react";
import {useMutation} from "@tanstack/react-query";
import AuthContext from "@/providers/auth_context";
import {baseApiUrl} from "@/config/base_url";
import * as z from "zod";

const formSchema = z.object({
    userName: z.string().min(2 )
        .max(30),
    bio: z.string().min(2).max(255)
})

export default function Page(){
    const auth = useContext(AuthContext);

    const mutation = useMutation({
        mutationFn: async (trail) => {
            return await fetch(`${baseApiUrl}/hike-service/trail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
                },
                body: JSON.stringify(trail),
            });
        },
    })

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">

            </div>
        </main>
    )
}
