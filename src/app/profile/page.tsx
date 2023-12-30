'use client'
import React, {useContext} from 'react'
import Card from "@/components/card/card";
import {useQuery} from "react-query";
import AuthContext from "@/providers/auth_context";

interface UserProfileProps {
    username: string;
    email: string;
    bio: string;
}

export default function Page() {
    const auth = useContext(AuthContext)
    const query = useQuery(["profile", auth.token], async () => {
        const response = await fetch(`https://localhost:7026/user-service/user`, {headers: {Authorization: "Bearer "+auth.token}});
        console.log(auth.token)
        return response.json();
    }, {enabled: auth.token!==null});

    if (query.isLoading || !query.data) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                    <div>Loading...</div>
                </div>
            </main>
        )
    }

    let profile = query.data;


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                <div>
                    {profile.userName}
                </div>
                <div>
                    {profile.bio}
                </div>
            </div>
        </main>
    )
}