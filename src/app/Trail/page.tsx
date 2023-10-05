'use client'

import React from "react";
import CardComponent from "../../../Components/CardComponent/CardComponent";

import {useQuery} from "react-query";
import {ReadonlyURLSearchParams, useSearchParams} from "next/navigation";
import {list} from "postcss";

export default function GetById(){
    const searchParams = useSearchParams()
    const guid = searchParams.get("id")
    const query = useQuery("getById", async() => {
        return(await fetch(`https://localhost:7236/api/Trails/${guid}/`)).text()
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                {query.isSuccess?<div>{query.data}</div>:<div>is loading</div>}
            </div>
        </main>
    )
}
