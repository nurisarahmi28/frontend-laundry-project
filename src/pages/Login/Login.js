import React from "react"
import axios from "axios"
import { baseUrl } from "../../config"
import gambar from '../../Assets/login pict 2.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import './main.css'
import './util.css'
import "./login.css"

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: ""
        }
    }

    loginProcess(event) {
        event.preventDefault()
        let endpoint = `${baseUrl}/auth`
        let request = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post(endpoint, request) // dari frontend ke backend
            .then(result => {
                if (result.data.logged) {
                    // store token in local storage
                    localStorage.setItem("token", result.data.token)
                    localStorage.setItem(
                        "user", JSON.stringify(result.data.user)
                    )
                    window.alert("Congratulations, you're logged!")
                    window.location.href = "/home"
                } else {
                    window.alert("Sorry, your username and password is incorrect, make sure you have the right one.")
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div class="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-7 col-lg-6 col-xl-5 h-100">
                            <img className="gambar align-self-center" src={gambar} alt="side pict"></img>
                        </div>

                        <div className="col-md-5 col-lg-4 col-xl-5 offset-xl-2">
                            <h4 className="text-center-custom text-dark text-bold">Login</h4>
                            <br />
                            <form onSubmit={ev => this.loginProcess(ev)}>


                                <div class="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                                    <input class="input100" type="text" name="Username" placeholder="Username"
                                        required value={this.state.username}
                                        onChange={ev => this.setState({ username: ev.target.value })} />
                                    <span class="focus-input100"></span>
                                    <span class="symbol-input100">
                                        <i class="fa fa-envelope" aria-hidden="true"></i>
                                    </span>
                                </div>

                                <div class="wrap-input100 validate-input" data-validate="Password is required">
                                    <input class="input100" type="password" name="pass" placeholder="Password"
                                        required value={this.state.password}
                                        onChange={ev => this.setState({ password: ev.target.value })} />
                                    <span class="focus-input100"></span>
                                    <span class="symbol-input100">
                                        <i class="fa fa-lock" aria-hidden="true"></i>
                                    </span>
                                </div>
                                
                                <div class="container-login100-form-btn">
                                    <button class="login100-form-btn" type="submit">
                                        Login
                                    </button>
                                </div>

                            </form >

                        </div>
                    </div>
                </div >
            </section>



        )
    }
}

export default Login;