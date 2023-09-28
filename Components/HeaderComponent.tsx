import React from "react";
import SearchComponent from "./Search/SearchComponent";

const HeaderComponent = () => {
    return (
        <header className={"flex justify-between"} >Travel Planner
            <SearchComponent/>
        </header>
    );
}

export default HeaderComponent;