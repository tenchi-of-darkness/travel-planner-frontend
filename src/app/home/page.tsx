import Image from 'next/image'
import React from "react";
import {Input} from "@nextui-org/input";
import {SearchIcon} from "@nextui-org/shared-icons";
import SearchComponent from "../../../Components/Search/SearchComponent";
import HeaderComponent from "../../../Components/HeaderComponent";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                Home page
            </div>
        </main>
    )
}
