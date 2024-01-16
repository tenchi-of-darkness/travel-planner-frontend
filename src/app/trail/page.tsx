'use client';

import React from "react";
import {useQuery} from "react-query";
import Card from "@/components/card/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import TrailAPI from "@/api/trail";
import {useRouter, useSearchParams} from "next/navigation";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function Trail() {
    const searchParams = useSearchParams();
    const router = useRouter()
    const page = parseInt(searchParams.get("page") || "1");

    const query = useQuery(["trails", page], async () => {
        return await (await TrailAPI.GetTrails(page))?.json();
    });

    const items = [];
    if (query.isSuccess && query.data) {
        for (const item of query.data) {
            items.push(<Card title={item.title} description={item.description}
                             locationName={item.locationName}
                             key={item.id}
                             onClick={() => {
                                 router.push("/trail/"+item.id);
                             }}/>)
        }
    } else {
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

    let currentPage = page;

    let showPages: number[] = [];

    while (currentPage >= 1 && showPages.length <= 3 && currentPage != 1) {
        showPages.push(currentPage);
        currentPage--;
    }

    showPages.sort();

    return (
        <main>
            <Button asChild>
                <Link href={{
                    pathname: '/trail/add',
                }}>
                    Add Trail
                </Link>
            </Button>

            <Pagination>
                <PaginationContent>
                    {(page !== 1) ? <PaginationItem>
                        <PaginationPrevious href={"/trail?page=" + (page - 1)}/>
                    </PaginationItem> : null}

                    <PaginationItem>
                        <PaginationLink href="/trail?page=1">1</PaginationLink>
                    </PaginationItem>

                    {(showPages.length !== 0 && !showPages.includes(2)) ? <PaginationItem>
                        <PaginationEllipsis/>
                    </PaginationItem> : null}

                    {showPages.map((innerPage) => <PaginationItem>
                        <PaginationLink href={"/trail?page=" + (innerPage)}>{innerPage}</PaginationLink>
                    </PaginationItem>)}


                    {query.data.length === 15 ? <PaginationItem>
                        <PaginationNext href={"/trail?page=" + (page + 1)}/>
                    </PaginationItem> : null}


                </PaginationContent>
            </Pagination>

            <div className="grid grid-cols-4 p-24 gap-5">
                {query.isSuccess ? <div>{items.length > 0 ? items : "No results found"}</div> : <div>is loading</div>}
            </div>
        </main>
    )
}
