'use client';

import Image from 'next/image'
import React from "react";
import {Input} from "@nextui-org/input";
import {SearchIcon} from "@nextui-org/shared-icons";
import SearchComponent from "../../../Components/Search/SearchComponent";
import HeaderComponent from "../../../Components/HeaderComponent";
import {useQuery} from "react-query";
import {useSearchParams} from "next/navigation";

export default function Search() {
    const searchParams = useSearchParams()
    const searchValue = searchParams.get("search")
    const query = useQuery("search" + searchValue, async () => {
        return (await fetch(`https://localhost:7236/Trail/SearchTrailByTitle?searchValue=${searchValue}&page=1&pageSize=15`)).json()
    });

    const items = [];
    if(query.isSuccess) {
        for (const item of query.data) {
            items.push(<div>{item.title}</div>)
        }
    }


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                {query.isSuccess?<div>{items}</div>:<div>is loading</div>}
            </div>
        </main>
    )
}
