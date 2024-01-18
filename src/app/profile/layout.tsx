'use client';

import React, {useContext, useMemo, useState} from "react";
import AuthContext from "@/providers/auth_context";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useQuery} from "react-query";
import UserAPI from "@/api/user";

export default function RootLayout({children}: { children: React.ReactNode }) {
    const auth = useContext(AuthContext)
    const query = useQuery(["profile", auth.token], async () => {
        const response = await UserAPI.GetUser(auth.token!);
        console.log(auth.token)
        return response!.json();
    }, {enabled: auth.token !== null});

    let userName = query.data?.userName;

    if (userName === null) userName=" ";

    return (
        <div className={"flex"}>
            <div className={"flex flex-col"}>
                {
                    !!query.data && query.isSuccess ?
                        <Card className={"m-4"}>
                            <CardHeader className={"p-4"}>
                                <CardTitle className={"flex items-center gap-2"}><Avatar>
                                    <AvatarImage src={auth.decodedToken.picture}/>
                                    <AvatarFallback>{userName[0]}</AvatarFallback>
                                </Avatar>{userName}</CardTitle>
                                <CardDescription className={"break-words max-w-[10rem]"}>{query.data.bio}</CardDescription>
                            </CardHeader>
                        </Card> : null
                }
                <NavigationMenu orientation="vertical">
                    <NavigationMenuList aria-orientation={"vertical"} className={"items-start"}>
                        <NavigationMenuItem>
                            <Link href={{
                                pathname: '/trail/favorite',
                            }} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Favorite trails
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href={{
                                pathname: '/activity',
                            }} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Favorite activities
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href={{
                                pathname: '/profile/edit',
                            }} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Edit profile
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}
