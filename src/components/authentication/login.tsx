'use client';
import React from "react";
import {Button} from "@/components/ui/button"
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, UserCredential} from "firebase/auth";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {FirebaseError, FirebaseOptions, initializeApp} from "@firebase/app";
import firebaseConfig from "@/config/firebase";

const provider = new GoogleAuthProvider();

export default function Login() {
    return (
        <main>
            <Button onClick={async () => {
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);

                try {
                    const result = await signInWithPopup(auth, provider);

                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential?.accessToken;
                    const user = result.user;

                } catch (e: any){

                }
            }}
            >Login</Button>
        </main>
    )
}
