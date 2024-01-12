'use client'
import React, {useContext} from 'react'
import {useQuery} from "react-query";
import AuthContext from "@/providers/auth_context";
import {baseApiUrl} from "@/config/base_url";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {Textarea} from "@/components/ui/textarea";

const formSchema = z.object({
    userName: z.string().min(2 )
        .max(30),
    bio: z.string().min(2).max(255)
})

export default function Page() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
        },
    })
    const auth = useContext(AuthContext)
    const query = useQuery(["profile", auth.token], async () => {
        const response = await fetch(`${baseApiUrl}/user-service/user`, {headers: {Authorization: "Bearer " + auth.token}});
        console.log(auth.token)
        return response.json();
    }, {enabled: auth.token !== null});

    if (query.isLoading || !query.data) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                    <div>Loading...</div>
                </div>
            </main>
        )
    }

    let profile = query.data;

    async function onSubmit(values: z.infer<typeof formSchema>){
        const response = await fetch(`${baseApiUrl}/user-service/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`,
            },
            body: JSON.stringify(values),
        });
        await query.refetch();
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
                <div>
                    {profile.userName}
                </div>
                <div>
                    {profile.bio}
                </div>
            </div>
        </main>
    )
}