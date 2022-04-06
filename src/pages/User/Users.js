import React from 'react'
import { Modal } from 'bootstrap';
import axios from 'axios';
import { baseUrl, authorization } from "../../config.js"
import './Users.css'

class Users extends React.Component {
    constructor() {
        super();
        this.state = {
            id_user: "",
            nama: "",
            username: "",
            password: "",
            role: "",
            action: "",
            visible: true,
            fillPassword: true,
            user: [],
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        this.modalUsers = new Modal(document.getElementById("modal_users"))
        this.modalUsers.show() //Menampilkan modal user
        //reset state untuk form user
        this.setState({
            action: "tambah",
            id_user: Math.random(1, 10000),
            nama: "",
            username: "",
            password: "",
            role: " ",
            fillPassword: true,
        })
    }

    ubahData(id_user) {
        this.modalUsers = new Modal(document.getElementById("modal_users"))
        this.modalUsers.show()

        let index = this.state.user.findIndex(
            user => user.id_user === id_user
        )

        this.setState({
            action: "ubah",
            id_user: id_user,
            nama: this.state.user[index].nama,
            username: this.state.user[index].username,
            password: "",
            role: this.state.user[index].role,
            fillPassword: false,
        })
    }

    simpanData(event) {
        event.preventDefault();

        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/users`

            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // //menambah state members(array)
            // let temp = this.state.members
            // //menambah data dalam array
            // temp.push(data)
            // this.setState({ members: temp })

            this.modalUsers.hide()

        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/users/` + this.state.id_user

            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                // password: this.state.password,
                role: this.state.role
            }
            if (this.state.fillPassword === true) (
                data = this.state.password
            )

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            this.modalUsers.hide()

            // let temp = this.state.users
            // let index = temp.findIndex(
            //     user => user.id_user === this.state.id_user
            // )
            // this.setState({ users: temp })
            // this.modalUser.hide()
        }
    }

    hapusData(id_user) {
        if (window.confirm("are u sure to delete this data?")) {
            let endpoint = `${baseUrl}/users/` + id_user

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // //mencari posisi index dari data yang akan dihapus
            // let temp = this.state.users
            // let index = temp.findIndex(user => user.id_user === id_user)

            // //menghapus data pada array
            // temp.splice(index, 1)
            // this.setState({ users: temp })
        }
    }

    getData() {
        let endpoint = `${baseUrl}/users`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ user: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        // fungsi ini di jalankan setelah fungsi render berjalan
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        console.log(user)
        if (user.role !== 'admin') {
            window.alert(`Maaf anda tidak berhak mengakses halaman ini!`)
            window.location.href = "/"
        }
    }

    showPassword() {
        if (this.state.fillPassword == true) {
            return (
                <div>
                    password
                    <input type="password" className='form-control mb-1' required
                        value={this.state.password}
                        onChange={ev => this.setState({ password: ev.target.value })} />
                </div>
            )
        } else {
            return (
                <button className='mb-1 btn btn-success'
                    onClick={() => this.setState({ fillPassword: true })}>
                    change password
                </button>
            )
        }
    }

    render() {
        return (
            <>
                <div className="container custom-user">
                    <div className='card card-custom'>
                        <div className='bg-transparent'>
                            <h3 className='' align="center">
                                List of User
                            </h3>
                        </div>
                        <div className='card-body'>

                            <ul className='list-group'>
                                {this.state.user.map(user => (
                                    <li className='list-group-item'>
                                        <div className='row' >
                                            <div className="col-lg-4">
                                                <small className='text-info'>Nama</small><br />
                                                <h6>{user.nama}</h6>
                                            </div>

                                            <div className='col-lg-3'>
                                                <small className='text-info'>Username</small><br />
                                                <h6>{user.username}</h6>
                                            </div>

                                            <div className='col-lg-2'>
                                                <small className='text-info'>Role</small><br />
                                                <h6>{user.role}</h6>
                                            </div>

                                            <div className='col-lg-3'>
                                                <small className='text-info'>Action</small><br />

                                                <button small className='btn btn-sm btn-warning mx-1'
                                                    onClick={() => this.ubahData(user.id_user)}>
                                                    Edit
                                                </button>

                                                <button className='btn btn-sm btn-danger mx-1'
                                                    onClick={() => this.hapusData(user.id_user)}>
                                                    Delete
                                                </button>

                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <br />
                            <button className={`btn btn-sm btn-warning my-2 text-white ${this.state.visible ? `` : `d-none`}`}
                                onClick={() => this.tambahData()}>
                                Tambah data User
                            </button>
                        </div>
                    </div>

                    {/** FORM MODAL USER */}
                </div>
                <div className="modal fade" id="modal_users">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-success">
                                <h4 className="text-white">
                                    Form Users
                                </h4>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={ev => this.simpanData(ev)}>
                                    Nama
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.nama}
                                        onChange={ev => this.setState({ nama: ev.target.value })}
                                        required
                                    />

                                    Username
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.username}
                                        onChange={ev => this.setState({ username: ev.target.value })}
                                        required
                                    />

                                    {this.showPassword()}
                                    <br />

                                    {/* Password
                                    <input type="password" className="form-control mb-2"
                                        value={this.state.password}
                                        onChange={ev => this.setState({ password: ev.target.value })}
                                        required
                                    /> */}

                                    Role
                                    <select className="form-control mb2"
                                        value={this.state.role}
                                        onChange={ev => this.setState({ role: ev.target.value })}>
                                        <option value="admin">Admin</option>
                                        <option value="Member">Member</option>
                                        <option value="kasir">Kasir</option>
                                    </select>
                                    <br />
                                    <button className="btn btn-success btn-sm" type="submit">
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default Users;
