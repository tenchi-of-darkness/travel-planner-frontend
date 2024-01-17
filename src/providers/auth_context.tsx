'use client'

import React, {createContext} from 'react';

const AuthContext = createContext<AuthContextProps>({
    logout: () => {},
    token: null,
    decodedToken: null,
});

export interface AuthContextProps {
    logout: () => void;
    token: string|null;
    decodedToken: any|null;
}

export default AuthContext;