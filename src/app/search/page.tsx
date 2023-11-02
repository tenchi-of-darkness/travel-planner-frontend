'use client';

import Image from 'next/image'
import React from "react";
import {Input} from "@nextui-org/input";
import {SearchIcon} from "@nextui-org/shared-icons";
import Header from "../../components/header";
import {useQuery} from "react-query";
import {useSearchParams} from "next/navigation";
import Card from "@/components/card/card";

export default function Search() {
    const searchParams = useSearchParams()
    const searchValue = searchParams.get("search")
    const query = useQuery("search" + searchValue, async () => {
        const searchValueString = searchValue !== null && searchValue.length > 0 ? `SearchValue=${searchValue}&` : "";
        return (await fetch(`https://localhost:7236/api/trails?${searchValueString}Page=1&PageSize=15`)).json()
    });

    const items = [];
    if (query.isSuccess && query.data) {
        for (const item of query.data) {
            items.push(<Card title={item.title} description={item.description}
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
