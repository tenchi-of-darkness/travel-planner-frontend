'use client'

import React from "react";

import {useQuery} from "react-query";
import TrailAPI from "@/api/trail";
import Card from "@/components/card/card";

export default function Page({params}: { params: { id: string } }) {
    const query = useQuery(["trail", params.id], async () => {
        return (await TrailAPI.GetTrailById(params.id))?.json()
    });

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

    return (
        <main className={"p-24"}>
            <div>Title: {query.data.title}</div>
            <div>Location: {query.data.locationName}</div>
        </main>
    )
}
