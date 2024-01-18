'use client'

import React, {useContext, useDebugValue} from "react";

import {useMutation, useQuery} from "react-query";
import TrailAPI from "@/api/trail";
import Card from "@/components/card/card";
import {Button} from "@/components/ui/button";
import {HeartFilledIcon, HeartIcon} from "@radix-ui/react-icons";
import AuthContext from "@/providers/auth_context";
import * as z from "zod";
import {baseApiUrl} from "@/config/base_url";
import {NotInForm} from "@/app/trail/add/page";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";

const Map = dynamic(() => import('@/app/trail/[id]/map'), {
    ssr: false,
})

export default function Page({params}: { params: { id: string } }) {
    const auth = useContext(AuthContext);
    const query = useQuery(["trail", params.id, auth.token], async () => {
        return (await TrailAPI.GetTrailById(params.id, auth.token))?.json()
    });
    const router = useRouter();

    const favoriteMutation = useMutation({
        mutationFn: async ({favorite}: { favorite: boolean }) => {
            if (favorite) {
                return await fetch(`${baseApiUrl}/hike-service/trail/${params.id}/favorite`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`,
                    },
                    body: null,
                }).then(async x => await query.refetch());
            } else {
                return await fetch(`${baseApiUrl}/hike-service/trail/${params.id}/favorite`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`,
                    },
                    body: null,
                }).then(async x => await query.refetch());
            }
        },
    })

    if (!(query.isSuccess && query.data)) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                    Loading...
                </div>
            </main>
        )
    }

    if (query.isError) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                    Query failed
                </div>
            </main>
        )
    }

    console.log(query.data)

    return (
        <main className={"p-24"}>
            <div>Title: {query.data.title}</div>
            <div>Description: {query.data.description}</div>
            <div>Difficulty: {query.data.difficulty}</div>
            <div>Distance in meters: {query.data.distanceInMeters}</div>
            <div>Location: {query.data.locationName}</div>
            <div>
                <Button disabled={favoriteMutation.isLoading} variant="outline" size="icon" onClick={() => {
                    favoriteMutation.mutate({favorite: !query.data.isFavorite});
                }}>
                    {query.data.isFavorite ?
                        <HeartFilledIcon className="h-4 w-4"/> :
                        <HeartIcon className="h-4 w-4"/>}
                </Button>
                {query.data.ownerUserId === auth.decodedToken?.sub ?
                    <Button variant="default" size="icon" onClick={() => {
                        router.push(`/trail/${params.id}/edit`);
                    }}>
                        Edit
                    </Button> : null}
                <Map lineString={query.data.lineString}/>
            </div>
        </main>
    )
}
