import React from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { baseUrl, authorization, formatNumber } from "../../config.js";
import './FormTransaksi.css'

export default class FormTransaksi extends React.Component {
    constructor() { //pendefinisian state
        super()
        this.state = { //semua variable yg dibutuhkan dan nilai awal
            id_member: "",
            tgl: "",
            batas_waktu: "",
            tgl_bayar: "",
            dibayar: false,
            id_user: "",
            detail_transaksi: [],
            members: [],
            pakets: [],
            id_paket: "",
            qty: 0,
            jenis_paket: "",
            harga: 0,

        };
        // mengecek token di localStorage, jika tidak ada token dilocalStorage maka diarahkan ke login
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getMember() {
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ members: response.data });
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        //fungsi ini dijalankan setelah fungsi render berjalan
        this.getMember()
        this.getPaket()

        let user = JSON.parse(localStorage.getItem("user"))
        // ketika diambil local Storage harus dikembalikan menjadi bentuk object atau array dengan menggunakan JSON.parse
        if (user.role !== 'admin' && user.role !== 'kasir') {
            window.alert(`Maaf anda tidak berhak untuk mengakses halaman ini!`)
            window.location.href = "/"
        }
    }

    getPaket() {
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ pakets: response.data })
            })
            .catch(error => console.log(error))
    }

    tambahPaket(ev) {
        ev.preventDefault()

        // utk menyimpan data paket yg dipilih beserta jumlahnya
        // ke dalam array detail_transaksi
        let idPaket = this.state.id_paket
        let selectedPaket = this.state.pakets.find(
            paket => paket.id_paket == idPaket
        )
        let newPaket = {
            id_paket: this.state.id_paket,
            qty: this.state.qty,
            jenis_paket: selectedPaket.jenis_paket,
            harga: selectedPaket.harga,
        }

        // ambil array detail transaksinya
        let temp = this.state.detail_transaksi
        temp.push(newPaket)
        this.setState({ detail_transaksi: temp })
        // tutup modal
        this.modal.hide()
    }

    addPaket() {
        //menampilkan form modal utk memilih paket
        this.modal = new Modal(document.getElementById('modal_paket'))
        this.modal.show()

        // kosongkan formnya
        this.setState({
            id_paket: "",
            qty: 0,
            jenis_paket: "",
            harga: 0
        })
    }

    hapusData(id_paket) {
        if (window.confirm("apakah anda yakin ingin menghapus data paket ini?")) {

            // mencari posisi index dari data yang akan dihapus
            let temp = this.state.detail_transaksi
            let index = temp.findIndex(detail => detail.id_paket === id_paket)

            // menghapus data pada array
            temp.splice(index, 1)
            this.setState({ details: temp })
        }
    }

    SimpanTransaksi() {
        // if (document.getElementById("member").value == "") {
        //     alert("missing member");
        //     return;
        // } 
        // if (document.getElementById("tgl").value == "") {
        //     alert("missing tanggal transaksi");
        //     return;
        // }
        // if (document.getElementById("batas_waktu").value == "") {
        //     alert("missing batas waktu");
        //     return;
        // }
        // if (document.getElementById("status").value == "") {
        //     alert("missing status");
        //     return;
        // }
        // if (this.state.detail_transaksi.length == 0){
        //     alert("missing paket");
        //     return;
        // }
        let endpoint = `${baseUrl}/transaksi`
        let user = JSON.parse(localStorage.getItem("user"))
        let newData = {
            id_member: this.state.id_member,
            tgl: this.state.tgl,
            batas_waktu: this.state.batas_waktu,
            tgl_bayar: this.state.tgl_bayar,
            dibayar: this.state.dibayar,
            id_user: user.id_user, // id_usernya mengambil dari localStoragenya
            detail_transaksi: this.state.detail_transaksi
        }
        axios.post(endpoint, newData, authorization)
            .then(response => {
                window.alert(response.data.message)
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <>
                <div className="container custom-FormTransaksi">
                    <div className="card card-custom">
                        <div className="bg-transparent">
                            <h4 className="" align="center">
                                Form Transaksi
                            </h4>
                        </div>

                        <div className="card-body">
                            Member
                            <select className="form-control mb-2"
                                value={this.state.id_member}
                                onChange={ev => this.setState({ id_member: ev.target.value })}>
                                {this.state.members.map(member => ( // melooping setiap element yang ada di data array
                                    <option value={member.id_member}>
                                        {member.nama}
                                    </option>
                                ))}
                            </select>

                            Tanggal Transaksi
                            <input type="date" className="form-control mb-2"
                                value={this.state.tgl}
                                onChange={ev => this.setState({ tgl: ev.target.value })} />

                            Batas Waktu
                            <input type="date" className="form-control mb-2"
                                value={this.state.batas_waktu}
                                onChange={ev => this.setState({ batas_waktu: ev.target.value })} />

                            Tanggal Bayar
                            <input type="date" className="form-control mb-2"
                                value={this.state.tgl_bayar}
                                onChange={ev => this.setState({ tgl_bayar: ev.target.value })} />

                            Status Bayar
                            <select className="form-control mb-2"
                                value={this.state.dibayar}
                                onChange={ev => this.setState({ dibayar: ev.target.value })}>
                                <option value={true}>Sudah Dibayar</option>
                                <option value={false}>Belum dibayar</option>
                            </select>

                            <button className="btn btn-sm btn-primary"
                                onClick={() => this.addPaket()}>
                                Pilih Paket
                            </button>


                            {/* tampilkan isi detail */}
                            <h5 className="text-warning pt-4">
                                Detail Transaksi:
                            </h5><br />

                            {this.state.detail_transaksi.map(detail => (
                                <div className="row">

                                    {/* area untuk nama paket */}
                                    <div className="col-lg-2">
                                        {detail.jenis_paket}
                                    </div>
                                    {/* area untuk qty */}
                                    <div className="col-lg-2">
                                        Qty: {detail.qty}
                                    </div>
                                    {/* area untuk harga paket */}
                                    <div className="col-lg-3">
                                        @ Rp {formatNumber(detail.harga)}
                                    </div>
                                    {/* area untuk harga total */}
                                    <div className="col-lg-4">
                                        Total Harga : Rp {formatNumber(detail.harga * detail.qty)}
                                    </div>
                                    <div className="col-lg-1 mb-2">
                                        <button className='btn btn-sm btn-danger mx-1'
                                            onClick={() => this.hapusData(detail.id_paket)}>
                                            Hapus
                                        </button>
                                    </div>

                                </div>
                            ))}
                            {/* modal utk pilihan paket */}
                            <button className="btn btn-sm btn-success mx-1"
                                onClick={() => this.SimpanTransaksi()}>
                                Simpan Transaksi
                            </button>


                        </div>
                    </div>
                </div >

                <div className="modal fade" id="modal_paket">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-secondary-custom">
                                <h4 className="text-white">
                                    Pilih paket
                                </h4>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={(ev) => this.tambahPaket(ev)}>
                                    Pilih paket
                                    <select className="form-control mb-2"
                                        value={this.state.id_paket}
                                        onChange={(ev) => this.setState({ id_paket: ev.target.value })}>

                                        <option value="">Pilih Paket</option>
                                        {this.state.pakets.map(paket => (
                                            <option value={paket.id_paket}>
                                                {paket.jenis_paket}
                                            </option>
                                        ))}
                                    </select>

                                    Jumlah(Qty)
                                    <input type="number" className="form-control mb-2"
                                        value={this.state.qty}
                                        onChange={(ev) => this.setState({ qty: ev.target.value })} />

                                    <button type="submit" className="btn btn-sm btn-success mx-1">
                                        Tambah
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