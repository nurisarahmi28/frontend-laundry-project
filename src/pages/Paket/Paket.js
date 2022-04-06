import React from 'react'
import { Modal } from "bootstrap";
import { data } from 'jquery';
import axios from 'axios';
import { hide } from '@popperjs/core';
import Member from '../Member/Member';
import { baseUrl, formatNumber, authorization } from "../../config.js"
import './paket.css'

class Paket extends React.Component {
    constructor() {
        super();
        this.state = {
            id_paket: "",
            jenis_paket: "",
            harga: "",
            visible: true,
            pakets: [
                {
                    id_paket: "1",
                    jenis_paket: "cuci saja",
                    harga: "6000"
                },
                {
                    id_paket: "2",
                    jenis_paket: "cuci+setrika",
                    harga: "8000"
                },
                {
                    id_paket: "3",
                    jenis_paket: "setrika saja",
                    harga: "4000"
                },
            ],
        };
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        this.modalPaket = new Modal(document.getElementById("modal_paket"))
        this.modalPaket.show()
        this.setState({
            action: "tambah",
            id_paket: Math.random(1, 10000),
            jenis_paket: "",
            harga: "",
        })
    }

    ubahData(id_paket) {
        this.modalPaket = new Modal(document.getElementById("modal_paket"))
        this.modalPaket.show() //Menampilkan modal paket

        //mencari index posisi dari data member yg akan diubah
        let index = this.state.pakets.findIndex(
            paket => paket.id_paket === id_paket
        )

        this.setState({
            action: "ubah",
            id_paket: id_paket,
            jenis_paket: this.state.pakets[index].jenis_paket,
            harga: this.state.pakets[index].harga,
        })
    }

    simpanData(event) {
        event.preventDefault();

        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/paket`
            let data = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }
            // let temp = this.state.pakets
            // temp.push(data)
            // this.setState({ pakets: temp })
            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalPaket.hide()

        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/paket/` + this.state.id_paket
            let data = {
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }

            // let temp = this.state.pakets
            // let index = temp.findIndex(
            //     paket => paket.id_paket === this.state.id_paket
            // )

            // temp[index].jenis_paket = this.state.jenis_paket
            // temp[index].harga = this.state.harga
            // this.setState({ pakets: temp })
            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalPaket.hide()
        }
    }

    hapusData(id_paket) {
        if (window.confirm("are sure to delete this data?")) {
            let endpoint = `${baseUrl}/paket/` + id_paket
            
            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            //mencari posisi index dari data yg akan dihapus
            // let temp = this.state.pakets
            // let index = temp.findIndex(paket => paket.id_paket === id_paket)

            // //menghapus data paket pada array
            // temp.splice(index, 1)

            // this.setState({ pakets: temp })
        }
    }

    //mendapatkan data paket dari backend
    getData() {
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ pakets: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))

        this.setState({
            role: user.role
        })
        if (user.role === 'admin') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }

    showAddButton() {
        if (this.state.role === 'admin') {
            return (
                <button className='btn btn-sm btn-success my-1'
                    onClick={() => this.tambahData()}> Tambah data Paket
                </button>
            )
        }
    }

    render() {
        return (
            <>
            <div className='container custom-paket'>
                <div className='card card-custom'>
                    <div className='bg-transparent'>
                        <h3 className='' align="center">
                            List of Paket
                        </h3>
                    </div>

                    <div className='card-body'>
                        <ul className='list-group'>
                            {this.state.pakets.map(paket => (
                                <li className='list-group-item'>
                                    <div className='row'>
                                        <div className='col-lg-5'>
                                            <small className='text-info'>Jenis Paket</small> <br />
                                            <h6>{paket.jenis_paket}</h6>
                                        </div>
                                        <div className='col-lg-3'>
                                            <small className='text-info'>Harga</small> <br />
                                            <h6>{formatNumber(paket.harga)}</h6>
                                        </div>
                                        <div className='col-lg-4'>
                                            <small className='text-info'>Action </small><br />
                                            <button small className={`btn btn-sm btn-success mx-1 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.ubahData(paket.id_paket)}>
                                                Edit
                                            </button>
                                            <button className={`btn btn-sm btn-secondary mx-1 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(paket.id_paket)}>
                                                Hapus
                                            </button>
                                        </div>
                                    </div>

                                </li>
                            ))}
                        </ul>
                        <br />
                        <div className='col-lg-3'>
                            {this.showAddButton()}
                        </div>

                    </div>
                </div>

                {/*form modal data paket */}
            </div>
                <div className='modal fade' id="modal_paket">
                    <div className='modal-dialog modal-md'>
                        <div className='modal-content'>
                            <div className='modal-header bg-success'>
                                <h4 className="text-white">
                                    Form Paket
                                </h4>
                            </div>

                            <div className='modal-body'>
                                <form onSubmit={ev => this.simpanData(ev)}>
                                    Jenis Paket
                                    <input type="text" className='form-control mb-2'
                                        value={this.state.jenis_paket}
                                        onChange={(ev) => this.setState({ jenis_paket: ev.target.value })} />

                                    Harga
                                    <input type="text" className='form-control mb-2'
                                        value={this.state.harga}
                                        onChange={(ev) => this.setState({ harga: ev.target.value })} />

                                    <button className='btn btn-success btn-sm' type='submit'>
                                        Save
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

export default Paket;