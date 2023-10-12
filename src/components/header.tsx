import React from "react";
import Search from "@/components/search/search";
import {NavMenu} from "@/components/nav/nav-menu";
import {NavSearch} from "@/components/nav/nav-search";

const Header = () => {
    return (
        <header>
            <nav className={"flex flex-row"} >
                <NavMenu/>
                <NavSearch/>
            </nav>
        </header>
    );
}

export default Header;