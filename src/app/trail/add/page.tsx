'use client'

import React, {useContext, useEffect, useState} from "react";
import {useMutation} from "react-query";
import AuthContext from "@/providers/auth_context";
import {baseApiUrl} from "@/config/base_url";
import * as z from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Point} from "geojson";
import useGeolocation from "react-hook-geolocation";
import {Slider} from "@/components/ui/slider";

const formSchema = z.object({
    rating: z.number().min(0).max(10),
    difficulty: z.number().min(0).max(20),
    title: z.string().min(2).max(20),
    description: z.string().max(255),
    locationName: z.string().max(30),
    distanceInMeters: z.number().min(100)
})

interface NotInForm {
    start: Point | null;
    end: Point | null;
}

enum TrailDifficulty {
    Beginner = 0,
    Intermediate = 10,
    Hard = 20
}

export default function Page() {
    const location = useGeolocation()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: 0,
            difficulty: 0,
            title: "",
            description: "",
            locationName: "",
            distanceInMeters: 0
        },
        mode: "onChange"
    });

    const auth = useContext(AuthContext);
    const [notInForm, setNotInForm] = useState<NotInForm>({start: null, end: null});

    useEffect(() => {
        setNotInForm(x => {
            return {start: {coordinates: [location.latitude, location.longitude], type: "Point"}, end: x.end}
        })
    }, [location.latitude, location.longitude])

    const onNewPoint = (point: Point) => {
        setNotInForm(x => {
            return {start: x.start, end: point}
        })
    }

    const mutation = useMutation({
        mutationFn: async ({form, notInForm}: { form: z.infer<typeof formSchema>, notInForm: NotInForm }) => {
            return await fetch(`${baseApiUrl}/hike-service/trail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
                },
                body: JSON.stringify({...form, ...notInForm}),
            });
        },
    })

    async function onSubmit(formValues: z.infer<typeof formSchema>) {
        if (!form.formState.isValid || notInForm.start == null || notInForm.end == null) {
            return;
        }

        const response = await mutation.mutateAsync({form: formValues, notInForm});
    }

    function renderSwitch(difficulty: number) {
        switch (difficulty) {
            case 0:
                return 'Beginner';
            case 10:
                return 'Intermediate';
            case 20:
                return 'Hard';
            default:
                return '';
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Rating {field.value}</FormLabel>
                                    <FormControl>
                                        <Slider onBlur={field.onBlur} disabled={field.disabled}
                                                onValueChange={(arr) => field.onChange(arr[0])} ref={field.ref}
                                                name={field.name} defaultValue={[field.value]} min={0} max={10}
                                                step={1}/>
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="difficulty"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Difficulty {renderSwitch(field.value)}</FormLabel>
                                    <FormControl>
                                        <Slider onBlur={field.onBlur} disabled={field.disabled}
                                                onValueChange={(arr) => field.onChange(arr[0])} ref={field.ref}
                                                name={field.name} defaultValue={[field.value]} min={0} max={20}
                                                step={10}/>
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription>Type the description of the trail here</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="locationName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>This the starting location of your trail</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="distanceInMeters"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Distance in meters</FormLabel>
                                    <FormControl>
                                        <Input {...field} onChange={event => field.onChange(+event.target.value)}
                                               type={"number"} min={100}/>
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button disabled={!form.formState.isValid || notInForm.start == null || notInForm.end == null}
                                type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </main>
    )
}
