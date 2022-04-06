import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
    return (
        <nav>
            <NavLink exact activeClassName="active" to="/pages/Paket">
                Paket
            </NavLink>
            <NavLink exact activeClassName="active" to="/pages/Member.js">
                Member
            </NavLink>
            <NavLink exact activeClassName="active" to="/pages/Users.js">
                Users
            </NavLink>
            {/* <Navlink exact activeClassName="active" to="/pages/Login.js">
                Login
            </Navlink> */}
        </nav>
    )
}

export default Header;
