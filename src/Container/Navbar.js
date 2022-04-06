import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandsBubbles } from '@fortawesome/free-solid-svg-icons'
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons'



function Logout() {
    // remove data token dan user dari local storage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
}

function checkUser() {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        let ls = user.username;
        return (
            <div className="d-flex gap-3 justify-content-end">
                <small>
                    Logged in as <h6>{ls}</h6>
                </small>

                <button
                    type="button"
                    className="btn btn-transparent"
                    onClick={() => Logout()}
                >
                    <FontAwesomeIcon icon={faRightFromBracket} size="2x" style={{color:"red"}} data-toggle="ReactTooltip" title="Logout" />
                </button>
            </div>
        );
    } else {

        return (
            <a href="/auth" className="text-decoration-none">
                <h6>Login</h6>
            </a>
        );
    }
}

export default function Navbar(props) {

    const activeItem = (page) => {
        if (window.location.pathname.includes(page)) {
            return "nav-link active";
        } else {
            return "nav-link";
        }

    }
    console.log(activeItem('/member'))
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light navbar-mainbg sticky-top">


                <div className="container-fluid">
                    {/* brand */}
                    <h1 className="navbar-logo">
                        Risa's Londre <FontAwesomeIcon icon={faHandsBubbles} />
                    </h1>

                    {/* button toggler */}
                    <button className="navbar-toggler"
                        data-bs-toggle="collapse"
                        data-bs-target="#myNav"
                        aria-controls="myNav"
                        aria-expanded="false">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* define menu's */}
                    <div className="collapse navbar-collapse" id="myNav">

                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">


                            <li className="nav-item">
                                <Link to="/home" className={activeItem("/home")}>
                                    Home
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/member" className={activeItem("/member")}>
                                    Member
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/paket" className={activeItem("/paket")}>
                                    Paket
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/user" className={activeItem("/user")}>
                                    User
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/transaksi" className={activeItem("/transaksi")}>
                                    Transaksi
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/formtransaksi" className={activeItem("/formtransaksi")}>
                                    Transaksi Baru
                                </Link>
                            </li>

                        </ul>
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">
                                    {checkUser()}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

            </nav>
            {props.children}
        </div>
    )
}