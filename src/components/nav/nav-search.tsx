'use client';

import {Input} from "@/components/ui/input"
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {SearchIcon} from "@nextui-org/shared-icons";

export function NavSearch() {
    const router = useRouter();
    const [value, setValue] = useState("");


    return (
        <div className="w-[25%] flex justify-end items-center relative">
            <Input
                type="search"
                placeholder="Search..."
                className="border border-gray-400 rounded-lg p-4 w-full"
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                onKeyDown={ (e) => {
                    if (e.key === "Enter") {
                         router.push(`/search?search=${value}`)
                    }
                }}
            />
            <svg
                onClick={ () => {
                     router.push(`/search?search=${value}`)
                }}
                className="absolute mr-2 w-10 w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
    )
}