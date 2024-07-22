/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss-khachhang/paper-dashboard-khachhang.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Khachhang.js";
import PublicLayout from "layouts/Public.js";
import EmployLayout from "layouts/Employ.js";
import Admin1Layout from "layouts/Admin1.js";
import BacsiLayout from "layouts/Bacsi.js";

import Dichvu from "views/ViewUser/Dichvu/Dichvu.js";
import { ToastContainer } from 'react-toastify';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF8pymeFJ4wKDQ2KhvEiSAiBfJ5Y8Eync",
  authDomain: "dichvuchamsocyte-2427f.firebaseapp.com",
  projectId: "dichvuchamsocyte-2427f",
  storageBucket: "dichvuchamsocyte-2427f.appspot.com",
  messagingSenderId: "830277224343",
  appId: "1:830277224343:web:b48084a33597b5f216a6d2",
  measurementId: "G-ZMPPSL1MT9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
    <Route path="/public/*" element={<PublicLayout />} />
      <Route path="/Khachhang/*" element={<AdminLayout />} />
      <Route path="/admin1/*" element={<Admin1Layout />} />
      <Route path="/employ/*" element={<EmployLayout />} />
      <Route path="/bacsi/*" element={<BacsiLayout />} />

      <Route path="/" element={<Navigate to="/public/login" replace />} />
      <Route path="/" element={<Navigate to="/Khachhang/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/admin1/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/employ/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/bacsi/dashboard" replace />} />

      {/* <ToastContainer /> */}

    </Routes>
    <ToastContainer />

  </BrowserRouter>
);
