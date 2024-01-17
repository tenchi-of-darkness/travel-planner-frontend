'use client';
import React, {Dispatch, SetStateAction, useContext, useMemo} from "react";
import {Button} from "@/components/ui/button"
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, UserCredential} from "firebase/auth";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {FirebaseError, FirebaseOptions, initializeApp} from "@firebase/app";
import firebaseConfig from "@/config/firebase";
import AuthContext, {AuthContextProps} from "@/providers/auth_context";
import {jwtDecode, JwtPayload} from "jwt-decode";

const provider = new GoogleAuthProvider();

export default function Login({setAuthContext}: { setAuthContext:  Dispatch<SetStateAction<AuthContextProps>> }) {
    const auth = useContext(AuthContext);
    const decodedToken = useMemo<any>(()=>{
        if (!auth.token) return null;

        return ;
    }, [auth.token])

    return (
        <main>
            {auth.token==null?<Button onClick={async () => {
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);

                try {
                    const result = await signInWithPopup(auth, provider);
                    const token: string = await result.user.getIdToken();
                    const decodedToken: any = jwtDecode<JwtPayload>(token);

                    setAuthContext({
                        logout: () => {
                            setAuthContext({
                                logout: () => {

                                },
                                token: null,
                                decodedToken: null,
                            })
                        },
                        token: token,
                        decodedToken: decodedToken,
                    });
                } catch (e: any){
                    console.log(e)
                }
            }}
            >Login</Button>:<Button onClick={auth.logout}>Logout</Button>}
        </main>
    )
}
