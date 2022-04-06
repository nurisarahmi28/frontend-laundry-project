import React from 'react'
import { Modal } from "bootstrap";
import axios from 'axios';
import './Member.css'
import { baseUrl, authorization } from "../../config.js";

class Member extends React.Component {
    constructor() {
        super();
        this.state = {
            id_member: "",
            nama: "",
            alamat: "",
            jenis_kelamin: "",
            telepon: "",
            action: "",
            role: "",
            visible: true,
            members: [],
        }
        // jika tidak ada token dilocalstorage maka akan diarahkan kebagian login
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        this.modalMember = new Modal(document.getElementById("modal_member"))
        this.modalMember.show() //Menampilkan modal member
        //reset state untuk form member
        this.setState({
            action: "tambah",
            id_member: Math.random(1, 10000),
            nama: "",
            alamat: "",
            jenis_kelamin: "Wanita",
            telepon: "",
        })
    }

    ubahData(id_member) {
        this.modalMember = new Modal(document.getElementById("modal_member"))
        this.modalMember.show() //Menampilkan modal member

        //mencari index posisi dari data member yg akan diubah
        let index = this.state.members.findIndex(
            member => member.id_member === id_member
        )

        this.setState({
            action: "ubah",
            id_member: id_member,
            nama: this.state.members[index].nama,
            alamat: this.state.members[index].alamat,
            jenis_kelamin: this.state.members[index].jenis_kelamin,
            telepon: this.state.members[index].telepon
        })
    }

    simpanData(event) {
        event.preventDefault();
        //prevent default -> mencegah aksi default dari form submit

        // cek aksi tambah atau edit
        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/member`
            //menampung data isian dari user
            let data = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                jenis_kelamin: this.state.jenis_kelamin,
                telepon: this.state.telepon,
            }

            //tambahkan ke state members(array)
            // let temp = this.state.members
            // //menambah data dalam array
            // temp.push(data)
            // this.setState({ members: temp })
            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            //menghilangkan modal
            this.modalMember.hide()

        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/member/` + this.state.id_member

            let data = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                jenis_kelamin: this.state.jenis_kelamin,
                telepon: this.state.telepon
            }
            // let temp = this.state.members
            // let index = temp.findIndex(
            //     member => member.id_member === this.state.id_member
            // )

            // temp[index].nama = this.state.nama
            // temp[index].alamat = this.state.alamat
            // temp[index].telepon = this.state.telepon
            // temp[index].jenis_kelamin = this.state.jenis_kelamin

            // this.setState({ members: temp })

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalMember.hide()
        }
    }

    hapusData(id_member) {
        if (window.confirm("apakah anda yakin ingin menghapus data?")) {

            let endpoint = `${baseUrl}/member/` + id_member

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // mencari posisi index dari data yang akan dihapus
            // let temp = this.state.members
            // let index = temp.findIndex(member => member.id_member === id_member)

            // //menghapus data pada array
            // temp.splice(index, 1)

            // this.setState({ members: temp })
        }
    }

    //langkah mendaptkan data member dari backend
    getData() {
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ members: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        // fungsi ini dijalankan setelah fungsi render berjalan
        
        // cara pertama
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        console.log(user)

        this.setState({
            role: user.role
        })

        // cara kedua
        if (user.role === 'admin' || user.role === 'kasir') {
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
        if (this.state.role === 'admin' || this.state.role === 'kasir') {
            return (
                <button type='button' className='btn btn-outline-dark my-1'
                    onClick={() => this.tambahData()}>
                        Tambah data Member
                </button>
            )
        }
    }

    render() {
        return (
            <>
            <div className="Membercontainer">
                <div className='card card-custom'>
                    <div className=' bg-trasparent'>
                        <h3 className='' align="center">
                            List of Member
                        </h3>
                    </div>
                    <div className='card-body'>
                        <ul className='list-group'>
                            {this.state.members.map(member => (
                                // mapping untuk mengscanning atau menglooping sebuah array
                                <li className='list-group-item'>
                                    <div className='row' >
                                        <div className="col-lg-5">
                                            <small className='text-info'>Nama</small><br />
                                            <h6>{member.nama}</h6>
                                        </div>
                                        <div className='col-lg-2'>
                                            <small className='text-info'>Jenis Kelamin</small><br />
                                            <h6>{member.jenis_kelamin}</h6>
                                        </div>
                                        <div className='col-lg-3'>
                                            <small className='text-info'>Telepon</small><br />
                                            <h6>{member.telepon}</h6>
                                        </div>
                                        <div className='col-lg-2'>
                                            <small className='text-info'>Action</small><br />
                                            <button className="btn btn-sm btn-warning mx-1"
                                                onClick={() => this.ubahData(member.id_member)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-sm btn-danger mx-1"
                                                onClick={() => this.hapusData(member.id_member)}>
                                                Hapus
                                            </button>

                                        </div>
                                    </div>
                                    <div className='col-lg-10'>
                                        <small className='text-info'>Alamat</small><br />
                                        <h6>{member.alamat}</h6>
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

            </div>
                {/*form modal data member */}
                <div className='modal fade' id="modal_member">
                    <div className='modal-dialog modal-md'>
                        <div className='modal-content'>
                            <div className='modal-header bg-primary'>
                                <h4 className="text-white">
                                    Form Data Member
                                </h4>
                            </div>

                            <div className='modal-body'>
                                <form onSubmit={ev => this.simpanData(ev)}>
                                    Nama
                                    <input type="text" className='form-control mb-2'
                                        value={this.state.nama}
                                        onChange={(ev) => this.setState({ nama: ev.target.value })} required />

                                    Alamat
                                    <input type="text" className='form-control mb-2'
                                        value={this.state.alamat}
                                        onChange={(ev) => this.setState({ alamat: ev.target.value })} required />

                                    Jenis Kelamin
                                    <select className='form-control mb-2'
                                        value={this.state.jenis_kelamin}
                                        onChange={(ev) => this.setState({ jenis_kelamin: ev.target.value })}>
                                        <option value="Wanita">Wanita</option>
                                        <option value="Pria">Pria</option>
                                    </select>

                                    Telepon
                                    <input type="text" className='form-control mb-2'
                                        value={this.state.telepon}
                                        onChange={(ev) => this.setState({ telepon: ev.target.value })} required />

                                    <button className='btn btn-sm btn-primary' type="submit">
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
export default Member;