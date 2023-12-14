import React, {Dispatch, SetStateAction} from "react";
import Search from "@/components/search/search";
import {NavMenu} from "@/components/nav/nav-menu";
import {NavSearch} from "@/components/nav/nav-search";
import Login from "@/components/authentication/login";
import {AuthContextProps} from "@/providers/auth_context";

const Header = ({setAuthContext}: { setAuthContext:  Dispatch<SetStateAction<AuthContextProps>> }) => {
    return (
        <header>
            <nav className={"flex flex-row"} >
                <NavMenu/>
                <NavSearch/>
                <Login setAuthContext={setAuthContext} />
            </nav>
        </header>
    );
}

export default Header;