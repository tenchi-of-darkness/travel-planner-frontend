'use client'

import React, {createContext} from 'react';

const AuthContext = createContext<AuthContextProps>({
    logout: () => {},
    token: null
});

export interface AuthContextProps {
    logout: () => void;
    token: string|null;
}

export default AuthContext;