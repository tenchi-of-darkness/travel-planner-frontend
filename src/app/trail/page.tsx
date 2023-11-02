import React from "react";
import Card from "@/components/card/card";
import {useInfiniteQuery} from "@tanstack/react-query";

export default function Page() {

    return (
        <main>
                <h1>Trails</h1>
                <div className="grid grid-cols-4 p-24 gap-5">
                    <Card title={"Test title"} description={"This is a test description"} locationName={"Location on the planet Earth"}/>
                    <Card title={"Test title"} description={"This is a test description"} locationName={"Location on the planet Earth"}/>
                    <Card title={"Test title"} description={"This is a test description"} locationName={"Location on the planet Earth"}/>
                    <Card title={"Test title"} description={"This is a test description"} locationName={"Location on the planet Earth"}/>
                    <Card title={"Test title"} description={"This is a test description"} locationName={"Location on the planet Earth"}/>
                </div>
        </main>
    )
}
