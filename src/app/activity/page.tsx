'use client';
import React from "react";
import {useQuery} from "react-query";
import Card from "@/components/card/card";
import {baseApiUrl} from "@/config/base_url";
import ActivityAPI from "@/api/activity";

export default function Activity() {

    const query = useQuery("activity", async () => {
        return await (await ActivityAPI.GetActivities(1))?.json()
    });

    const items = [];
    if (query.isSuccess && query.data) {
        for (const item of query.data) {
            items.push(<Card title={item.name} description={item.description}
                             locationName={item.locationName}/>)
        }
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
        <main>
            <div className="grid grid-cols-4 p-24 gap-5">
                {query.isSuccess ? <div>{items.length > 0 ? items : "No results found"}</div> : <div>is loading</div>}
            </div>
        </main>
    )
}
