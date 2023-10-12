'use client';
import React, {useState} from "react";
import {Input} from "@nextui-org/input";
import {SearchIcon} from "@nextui-org/shared-icons";
import {useRouter} from "next/navigation";
import {set} from "zod";

const Search = () => {
    const router = useRouter();
    const [value, setValue] = useState("");

    return (
        <div>
            <Input
                label="Search"
                isClearable
                radius="lg"
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                onKeyDown={async (e) => {
                    if(e.key === "Enter"){
                        await router.push(`/search?search=${value}`)
                    }
                }}
                classNames={{
                    label: "text-black/50 dark:text-white/90",
                    input: [
                        "bg-transparent",
                        "text-black/90 dark:text-white/90",
                        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                        "shadow-xl",
                        "bg-default-200/50",
                        "dark:bg-default/60",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                        "hover:bg-default-200/70",
                        "dark:hover:bg-default/70",
                        "group-data-[focused=true]:bg-default-200/50",
                        "dark:group-data-[focused=true]:bg-default/60",
                        "!cursor-text",
                    ],
                }}
                placeholder="Type to search..."
                startContent={
                    <div onClick={async () => {
                        await router.push(`/search?search=${value}`)
                    }}>
                        <SearchIcon
                            className="text-black/50 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0"/>
                    </div>
                }
            />
        </div>
    );
}

export default Search;