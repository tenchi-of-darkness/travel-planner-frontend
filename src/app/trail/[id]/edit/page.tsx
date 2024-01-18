'use client';

import useGeolocation from "react-hook-geolocation";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useMutation, useQuery} from "react-query";
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
import TrailAPI from "@/api/trail";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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

export default function Page({params}: { params: { id: string } }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const [deleteDialogConfirmed, setDeleteDialogConfirmed] = useState(false)
    const [editDialogConfirmed, setEditDialogConfirmed] = useState(false)

    const auth = useContext(AuthContext);
    const [notInForm, setNotInForm] = useState<NotInForm>({start: null, end: null});

    const router = useRouter();

    const query = useQuery(["trail", params.id, auth.token], async () => {
        return (await TrailAPI.GetTrailById(params.id, auth.token))?.json();
    }, {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: !!auth.token,
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await fetch(`${baseApiUrl}/hike-service/trail/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
                },
                body: null,
            }).then(async x => {
                if (x.ok) {
                    router.push("/trail");
                } else {
                    //Show error
                }
            });
        },
    })

    const location = useGeolocation()

    const mutation = useMutation({
        mutationFn: async ({form, notInForm}: { form: z.infer<typeof formSchema>, notInForm: NotInForm }) => {
            return await fetch(`${baseApiUrl}/hike-service/trail`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
                },
                body: JSON.stringify({id: params.id, ...form, ...notInForm}),
            }).then(async x => {
                if (x.ok) {
                    await query.refetch();
                }
            });
        },
    })

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

    async function onDelete() {
        setDeleteDialogOpen(true)
    }

    useEffect(() => {
        if(deleteDialogConfirmed) deleteMutation.mutate();
        setDeleteDialogConfirmed(false);
    }, [deleteDialogConfirmed]);

    async function onSubmit(formValues: z.infer<typeof formSchema>) {
        if (!form.formState.isValid || notInForm.start == null || notInForm.end == null) {
            return;
        }

        setEditDialogOpen(true)
    }

    useEffect(() => {
        if(editDialogConfirmed)  mutation.mutate({form: form.getValues(), notInForm});
        setEditDialogConfirmed(false);
    }, [editDialogConfirmed]);

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

    function difficultyToNumber(difficulty: string) {
        switch (difficulty) {
            case 'Beginner':
                return 0;
            case 'Intermediate':
                return 10;
            case 'Hard':
                return 20;
            default:
                return 0;
        }
    }

    useEffect(() => {
        if (query.data && query.isSuccess) {
            form.reset({...query.data, difficulty: difficultyToNumber(query.data.difficulty)});
            setNotInForm(x => {
                return {
                    start: { type: "Point",coordinates: query.data.lineString.coordinates[0]},
                    end: {type: "Point",coordinates: query.data.lineString.coordinates.slice(-1)[0]},
                }
            })
        }
    }, [query.data]);

    if (!query.data || !query.isSuccess || !notInForm.start || !notInForm.start.coordinates) {
        return <></>
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
                    <Button disabled={!auth.token} type="button" variant="destructive" onClick={onDelete}>Delete</Button>
                </form>
            </Form>

            <Map setNotInForm={setNotInForm} notInForm={notInForm} isEdit={true} lineString={query.data.lineString} />

            {/*Dialogs*/}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]" style={{zIndex:51}}>
                    <DialogHeader>
                        <DialogTitle>Delete the current trail?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" onClick={() => {
                                setDeleteDialogConfirmed(true)
                            }}>Confirm</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]" style={{zIndex:51}}>
                    <DialogHeader>
                        <DialogTitle>Confirm the changes to the current trail?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" onClick={() => {
                                setEditDialogConfirmed(true)
                            }}>Confirm</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>

    )
}
