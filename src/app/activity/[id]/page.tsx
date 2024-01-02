'use client'

import React from "react";

import {useQuery} from "react-query";
import {baseApiUrl} from "@/config/base_url";

export default function Page({params}: {params:{id:string}}){
    const query = useQuery(["trail", params.id], async() => {
        return(await fetch(`${baseApiUrl}/hike-service/trail/${params.id}/`)).text()
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                {query.isSuccess?<div>{query.data}</div>:<div>is loading</div>}
            </div>
        </main>
    )
}
