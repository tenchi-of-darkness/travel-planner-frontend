'use client';
import React, {Dispatch, SetStateAction, useContext} from "react";
import {Button} from "@/components/ui/button"
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, UserCredential} from "firebase/auth";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {FirebaseError, FirebaseOptions, initializeApp} from "@firebase/app";
import firebaseConfig from "@/config/firebase";
import AuthContext, {AuthContextProps} from "@/providers/auth_context";

const provider = new GoogleAuthProvider();

export default function Login({setAuthContext}: { setAuthContext:  Dispatch<SetStateAction<AuthContextProps>> }) {
    const auth = useContext(AuthContext);
    return (
        <main>
            {auth.token==null?<Button onClick={async () => {
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);

                try {
                    const result = await signInWithPopup(auth, provider);

                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token: string = await result.user.getIdToken();

                    setAuthContext({
                        logout: () => {
                            setAuthContext({
                                logout: () => {

                                },
                                token: null
                            })
                        },
                        token: token
                    });
                } catch (e: any){

                }
            }}
            >Login</Button>:<Button onClick={auth.logout}>Logout</Button>}
        </main>
    )
}
