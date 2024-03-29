'use client';

import useGeolocation from "react-hook-geolocation";
import React, {useContext, useEffect, useRef, useState} from "react";
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
import {Slider} from "@/components/ui/slider";
import dynamic from "next/dynamic";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useRouter} from "next/navigation";

const Map = dynamic(() => import('@/app/trail/add/map'), {
    ssr: false,
})

const formSchema = z.object({
    rating: z.number().min(0).max(10),
    difficulty: z.number().min(0).max(20),
    title: z.string().min(2).max(20),
    description: z.string().max(255),
    locationName: z.string().max(30),
    distanceInMeters: z.number().min(100)
})

export interface NotInForm {
    start: Point | null;
    end: Point | null;
}

enum TrailDifficulty {
    Beginner = 0,
    Intermediate = 10,
    Hard = 20
}

export default function Page() {
    const [dialogOpen, setDialogOpen] = useState(false)

    const [dialogConfirmed, setDialogConfirmed] = useState(false)

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
    const router = useRouter();
    const [notInForm, setNotInForm] = useState<NotInForm>({start: null, end: null});

    useEffect(() => {
        setNotInForm(x => {
            return {start: {coordinates: [location.latitude, location.longitude], type: "Point"}, end: x.end}
        })
    }, [location.latitude, location.longitude])

    const mutation = useMutation({
        mutationFn: async ({form, notInForm}: { form: z.infer<typeof formSchema>, notInForm: NotInForm }) => {
            return await fetch(`${baseApiUrl}/hike-service/trail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
                },
                body: JSON.stringify({...form, ...notInForm}),
            }).then(x => {
                if(x.ok){
                    router.push("/trail")
                }
            });
        },
    })

    async function onSubmit(formValues: z.infer<typeof formSchema>) {
        if (!form.formState.isValid || notInForm.start == null || notInForm.end == null) {
            return;
        }

        setDialogOpen(true);
    }

    useEffect(() => {
        if(dialogConfirmed) mutation.mutate({form: form.getValues(), notInForm});
        setDialogConfirmed(false);
    }, [dialogConfirmed]);

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
        <main className={"flex"}>
            <Form {...form}>
                <form className={"w-[30vw] p-24"} onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Rating {field.value}</FormLabel>
                                <FormControl>
                                    <Slider onBlur={field.onBlur} disabled={field.disabled}
                                            onValueChange={(arr) => field.onChange(arr[0])} ref={field.ref}
                                            name={field.name} value={[field.value]} min={0} max={10}
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
                                            name={field.name} value={[field.value]} min={0} max={20}
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

                    <Button
                        disabled={!auth.token || !form.formState.isValid || notInForm.start == null || notInForm.end == null}
                        type="submit">Submit</Button>
                </form>
            </Form>

            <Map setNotInForm={setNotInForm} notInForm={notInForm} isEdit={false} lineString={null} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]" style={{zIndex:51}}>
                    <DialogHeader>
                        <DialogTitle>Confirm the changes to the current trail?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" onClick={() => {
                                setDialogConfirmed(true)
                            }}>Confirm</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>

    )
}
