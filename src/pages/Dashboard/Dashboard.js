import React from "react"
import axios from "axios"
import './Dashboard.css'
import { baseUrl, formatNumber, authorization } from "../../config"
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChildren } from "@fortawesome/free-solid-svg-icons"
import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons"
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons"



export default class Dashboard extends React.Component {
    constructor() {
        super()

        this.state = {
            jmlMember: 0,
            jmlPaket: 0,
            jmlTransaksi: 0,
            income: 0
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getSummary() {
        // get jumlah member
        let endpoint = `${baseUrl}/member`
        console.log(endpoint)
        console.log(authorization)
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ jmlMember: response.data.length })
            })
            .catch(error => console.log(error))

        // get jumlah paket
        endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ jmlPaket: response.data.length })
            })
            .catch(error => console.log(error))

        // get jumlah transaksi
        endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                let income = 0
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)
                    }

                    income += total
                }
                this.setState({
                    jmlTransaksi: response.data.length,
                    income: income
                })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getSummary()
    }

    render() {
        return (
            <div className="container custom-center">
                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="card text-center border border-primary m-1 text-dark">
                            <div className="card-body"> <FontAwesomeIcon icon={faChildren} size="2x" />
                                <h4 className="card-title">Data Member</h4>
                                <h2>{this.state.jmlMember}</h2>
                                <h6>Members who have joined this laundry</h6>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <div className="card text-center border border-info m-1 text-dark">
                            <div className="card-body"> <FontAwesomeIcon icon={faBoxOpen} size="2x" />
                                <h4 className="card-title">Data Paket</h4>
                                <h2>{this.state.jmlPaket}</h2>
                                <h6>Packages we have served</h6>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <div className="card text-center border border-warning m-1 text-dark">
                            <div className="card-body">  <FontAwesomeIcon icon={faMoneyBillTransfer} size="2x" />
                                <h4 className="card-title">Data Transaksi</h4>
                                <h2>{this.state.jmlTransaksi}</h2>
                                <h6>Transactions that we have served </h6>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3">
                    </div>
                    <div className="col-lg-6">
                        <div className="card text-center mt-4 border border-secondary md-1 text-dark">
                            <div className="card-body"> <FontAwesomeIcon icon={faHandHoldingDollar} size="2x" />
                                <h4 className="card-title">Income</h4>
                                <h2>Rp {formatNumber(this.state.income)}</h2>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        )
    }
}