import React from 'react';

interface AuthContext {
    login: () => {};
    logout: () => {};
    token: string;
}

interface AuthProviderProps {
    context: AuthContext;
}

function AuthProvider(props: AuthProviderProps) {
    return (
        <div></div>
    );
}

export default AuthProvider;