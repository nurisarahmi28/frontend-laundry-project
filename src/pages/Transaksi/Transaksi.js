import React from "react";
import axios from "axios";
import { baseUrl, formatNumber, authorization } from "../../config";
import ReactToPdf from "react-to-pdf"
import domToPdf from "dom-to-pdf"
import "./Transaksi.css"

export default class Transaksi extends React.Component {
    constructor() { //mendefinisikan state
        super()
        this.state = {
            transaksi: []

        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getData() {
        let endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
            .then(response => { //menampilkan data
                let dataTransaksi = response.data
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)
                    }

                    // tambahkan key "total"
                    dataTransaksi[i].total = total
                }
                this.setState({ transaksi: dataTransaksi })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() { //fungsi ini dijalankan setelah render
        this.getData()

        // untuk memastikan agar yang berwenang saja yg dapat mengakses page.
        let user = JSON.parse(localStorage.getItem("user"))
        if (user.role !== 'admin' && user.role !== 'kasir') {
            window.alert(`Maaf anda tidak berhak untuk mengakses halaman ini!`)
            window.location.href = "/"
        }
    }

    showAddButton() {
        if (this.state.role === 'admin' || this.state.role === 'kasir') {
            return (
                <button type='button' className='btn btn-outline-dark'
                    onClick={() => this.tambahData()}>
                    Tambah data Member
                </button>
            )
        }
    }

    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div className="badge bg-info">
                    Transaksi Baru
                    <br />

                    <a onClick={() => this.changeStatus(id_transaksi, 2)}
                        className="text-dark">
                        Ubah Status
                    </a>
                </div>
            )
        } else if (status === 2) {
            return (
                <div className="badge bg-warning-custom">
                    Sedang diproses
                    <br />

                    <a onClick={() => this.changeStatus(id_transaksi, 3)}
                        className="text-dark">
                        Ubah Status
                    </a>
                </div>
            )
        } else if (status === 3) {
            return (
                <div className="badge bg-primary-custom text-white">
                    Siap diambil
                    <br />

                    <a onClick={() => this.changeStatus(id_transaksi, 4)}
                        className="text-dark">
                        Ubah Status
                    </a>
                </div>
            )
        } else if (status === 4) {
            return (
                <div className="badge bg-success-custom">
                    Telah diambil
                </div>
            )
        }
    }

    changeStatus(id, status) {
        if (window.confirm('Apakah Anda yakin ingin mengganti status transaksi ini?')) {
            let endpoint = `${baseUrl}/transaksi/status/${id}`
            let data = {
                status: status
            }

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(`Status telah diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    convertStatusBayar(id_transaksi, dibayar) {
        if (dibayar === 0) {
            return (
                <div className="badge bg-warning text-white">
                    Belum Dibayar
                    <br />

                    <a className="text-dark"
                        onClick={() => this.changeStatusBayar(id_transaksi, 1)}>
                        Ubah status
                    </a>
                </div>
            )
        } else if (dibayar === 1) {
            return (
                <div className="badge bg-success text-white">
                    Sudah Dibayar
                </div>
            )
        }
    }

    changeStatusBayar(id, status) {
        if (window.confirm('Apakah anda yakin ingin mengubah status pembayaran ini?')) {
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`
            axios.get(endpoint, authorization)
                .then(response => {
                    window.alert('Status pembayaran telah diubah')
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    hapusTransaksi(id) {
        if (window.confirm("Apakah anda yakin ingin menghapus transaksi ini?")) {
            let endpoint = `${baseUrl}/transaksi/${id}`

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    convertPdf() {
        // ambil element yang akan diconvert ke PDF
        let element = document.getElementById(`target`)
        let options = {
            filename: "Coba laundry.pdf"
        }

        domToPdf(element, options, () => {
            window.alert("File will donwloading soon")
        })
    }

    printStruk(id) {
        var element = document.getElementById(`struk${id}`);
        var options = {
            filename: `struk-${id}.pdf`
        };
        domToPdf(element, options, function (pdf) {
            window.alert('Struck will donwload soon')
        })
    }

    render() {
        const target = React.createRef() //untuk menandai element atau bagian mana yg akan ditempel di pdfnya.
        const optionPDF = {
            orientation: `landscape`,
            unit: `cm`,
            format: [21, 29.7]
        }
        return (
            <div className="container custom-transaksi">
                <div className="card card-custom">


                    <div className="card-body">

                        {/* <ReactToPdf targetRef={target} filename = "coba laundry.pdf"
                        scale={1} option={optionPDF}>
                            { ({toPdf}) => (
                                <button className="btn btn-danger"
                                onClick={toPdf}>
                                    Generate PDF
                                </button>
                            )}

                        </ReactToPdf> */}


                        <div ref={target} id="target">
                            <h3 className="text-center">List Transaksi</h3>
                            <br />
                            <ul ref={target} id="target" className="list-group">
                                {this.state.transaksi.map(trans => (
                                    <li className="list-group-item">
                                        <div className="row">

                                            {/* this is member area*/}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Member
                                                </small> <br />
                                                {trans.member.nama}
                                            </div>

                                            {/* this's tgl transaksi area */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Tgl Transaksi
                                                </small> <br />
                                                {trans.tgl}
                                            </div>

                                            {/* this's batas waktu area */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Batas Waktu
                                                </small> <br />
                                                {trans.batas_waktu}
                                            </div>

                                            {/* this's tgl bayar area */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Tanggal Bayar
                                                </small> <br />
                                                {trans.tgl_bayar}
                                            </div>

                                            {/* this's status area */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Status
                                                </small> <br />
                                                <h6>{this.convertStatus(trans.id_transaksi, trans.status)}</h6>
                                            </div>

                                            {/* this struck area col-3*/}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Struck
                                                </small> <br />
                                                <button className="btn btn-sm btn-custom"
                                                    onClick={() => this.printStruk(trans.id_transaksi)}>
                                                    Struck Pdf
                                                </button>
                                            </div>

                                            <div style={{ display: 'none' }}>
                                                <div className="col-lg-12 p-3"
                                                    id={`struk${trans.id_transaksi}`}>
                                                    <h3 className="text-secondary text-center">
                                                        Risa's Laundry
                                                    </h3>
                                                    <h5 className="text-center">
                                                        Jln.doang jadian kagak No.123 desa gantung kec.Php
                                                        <br />
                                                        Telp.09876445092 | IG: @salondry

                                                    </h5>

                                                    <h4 className="text-warning">Member:  {trans.member.nama}</h4>
                                                    <h4 className="text-warning">Tanggal: {trans.tgl}</h4>

                                                    <div className="row mt-3"
                                                        style={{ borderBottom: `1px dotted black` }}>
                                                        <div className="col-4">
                                                            paket
                                                        </div>
                                                        <div className="col-2">
                                                            Qty
                                                        </div>
                                                        <div className="col-3">
                                                            Harga Satuan
                                                        </div>
                                                        <div className="col-3">
                                                            Total
                                                        </div>
                                                    </div>

                                                    {trans.detail_transaksi.map(detail => (
                                                        <div className="row mt-3"
                                                            style={{ borderBottom: `1px dotted Black` }}>
                                                            <div className="col-4">
                                                                {detail.paket.jenis_paket}
                                                            </div>
                                                            <div className="col-2">
                                                                {detail.qty}
                                                            </div>
                                                            <div className="col-3">
                                                                Rp {formatNumber(detail.paket.harga)}
                                                            </div>
                                                            <div className="col-3">
                                                                Rp {formatNumber(detail.paket.harga * detail.qty)}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <div className="row mt-2">
                                                        <div className="col-lg-9"></div>
                                                        <div className="col-lg-3">
                                                            <h4> Rp {formatNumber(trans.total)}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Pembayaran area */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Status Pembayaran
                                                </small><br />
                                                <h6>{this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}</h6>
                                            </div>



                                            {/* this is total area */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Total
                                                </small><br />
                                                Rp {formatNumber(trans.total)}
                                            </div>

                                            {/* delete button */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Action
                                                </small><br />
                                                <button className="btn btn-sm btn-danger"
                                                    onClick={() => this.hapusTransaksi(trans.id_transaksi)}>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>

                                        <br />
                                        <hr />

                                        {/* area detail transaksi */}
                                        <h5>Detail Transaksi</h5>
                                        {trans.detail_transaksi.map(detail => (
                                            <div className="row">

                                                {/* area untuk nama paket*/}
                                                <div className="col-lg-3">
                                                    {detail.paket.jenis_paket}
                                                </div>
                                                {/* area untuk qty*/}
                                                <div className="col-lg-2">
                                                    Qty: {detail.qty}
                                                </div>
                                                {/* area untuk harga paket*/}
                                                <div className="col-lg-3">
                                                    @ Rp {formatNumber(detail.paket.harga)}
                                                </div>
                                                {/* area untuk harga total */}
                                                <div className="col-lg-4">
                                                    Total Harga : Rp {formatNumber(detail.paket.harga * detail.qty)}
                                                </div>
                                            </div>
                                        ))}

                                    </li>
                                ))}
                            </ul>
                        </div>
                        <br />
                        <button small className="btn btn-sm btn-danger mb-1"
                            onClick={() => this.convertPdf()}>
                            Convert
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}