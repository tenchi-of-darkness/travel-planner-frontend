'use client'
import React, {useContext} from 'react'
import {useQuery, useQueryClient} from "react-query";
import AuthContext from "@/providers/auth_context";
import {baseApiUrl} from "@/config/base_url";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {Textarea} from "@/components/ui/textarea";
import UserAPI from "@/api/user";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

const formSchema = z.object({
    userName: z.string().min(2 )
        .max(30),
    bio: z.string().min(2).max(255)
})

export default function Page() {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
        },
    })
    const auth = useContext(AuthContext)

    async function onSubmit(values: z.infer<typeof formSchema>){
        if(auth.token === null) return;

        const response = await UserAPI.SetUser(values, auth.token);
        await queryClient.refetchQueries(["profile", auth.token]);
    }


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>This is your public display name.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} id={"bio"}/>
                                    </FormControl>
                                    <FormDescription>This is your public bio.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </main>
    )
}