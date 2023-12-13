'use client';
import React from "react";
import { Button } from "@/components/ui/button"
import {getAuth, GoogleAuthProvider, signOut, onAuthStateChanged} from "firebase/auth";

const provider = new GoogleAuthProvider();

export default function Login() {
    return (
        <main>
            <Button onClick={async () => {
                const auth = getAuth();
                const result = await signOut(auth);

            }}>Button</Button>
        </main>
    )
}
