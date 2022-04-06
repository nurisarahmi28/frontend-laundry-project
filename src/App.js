import React from "react"
import "./App.css";
import Paket from "./pages/Paket/Paket"
import Member from "./pages/Member/Member"
import User from "./pages/User/Users"
import Login from "./pages/Login/Login"
import Transaksi from "./pages/Transaksi/Transaksi"
import FormTransaksi from './pages/Form Transaksi/FormTransaksi';
import Dashboard from "./pages/Dashboard/Dashboard"
import Footer from "./Container/footer"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Container/Navbar';

export default function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/home"
          element={<Navbar><Dashboard /><Footer /></Navbar>} />

        <Route path="/login"
          element={<Login />} />

        <Route path="/member"
          element={<Navbar><Member /><Footer /></Navbar>} />

        <Route path="/paket"
          element={<Navbar><Paket /><Footer /></Navbar>} />

        <Route path="/user"
          element={<Navbar><User /><Footer /></Navbar>} />

        <Route path="/transaksi"
          element={<Navbar><Transaksi /><Footer /></Navbar>} />

        <Route path="/formtransaksi"
          element={<Navbar><FormTransaksi /><Footer /></Navbar>} />
          

        
      </Routes>
      
    </BrowserRouter>
  )
}