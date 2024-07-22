import React from 'react';
import "./style.scss";
import { memo, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { loginAPI } from "assets/serviceAPI/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode }  from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';

import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Lỗi");
      return;
    }

    try {
      const res = await loginAPI(email, password);
      console.log(">>> Kiểm tra", res);

      if (res && res.data) {
        localStorage.setItem('data', JSON.stringify(res.data));

        const token = res.data;
        const decodedToken = jwtDecode(token);

        const unique_name = decodedToken.unique_name;
        const role = decodedToken.role;

        localStorage.setItem("unique_name", unique_name);
        localStorage.setItem("role", role);

        toast.success(`Đăng nhập thành công. Xin chào ${role}`);

        // Chuyển hướng tùy thuộc vào vai trò
        if (role === "KhachHang") {
          navigate("/Khachhang/dashboard");
        } else if (role === "NhanVien") {
          navigate("/employ/dashboard");
        }else if (role === "BacSi") {
          navigate("/bacsi/dashboard");
        }
        else if (role === "QuanLy") {
          navigate("/admin1/dashboard");
        } else {
          navigate("/");
          toast.success("Fail chuyển user!");
        }

        window.location.reload();
      } else {
        toast.error("Lỗi đăng nhập");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập", error);
      toast.error("Lỗi đăng nhập");
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image'
      style={{
        backgroundImage: 'url(https://martina.vn/wp-content/uploads/2020/05/dong-phuc-benh-vien-y-te-05.png)',
        height: '720px'
      }}
    >
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">Đăng Nhập</h2>
          <MDBInput wrapperClass='mb-4 ' size='lg' id='form2' type='email' placeholder="Email đăng nhập"
            style={{ borderRadius: '20px', height: '30px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-wrapper" style={{ position: 'relative', marginBottom: '1rem' }}>
            <MDBInput wrapperClass='mb-4' size='lg' id='form3' type={showPassword ? 'text' : 'password'} placeholder="Mật Khẩu"
              style={{ borderRadius: '20px', height: '30px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon 
              icon={showPassword ? faEyeSlash : faEye} 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: 'absolute', right: '10px', top: '8px', cursor: 'pointer' }} 
            />
          </div>

          <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg'
            style={{ borderRadius: '20px', height: '50px' }}
            onClick={handleLogin}>Đăng Nhập</MDBBtn>

          <p style={{ marginLeft: '-10px' }}>Hoặc</p>
          <Link to="/public/register">
            <MDBBtn  className='mb-4 w-100 gradient-custom-4'
              style={{ borderRadius: '20px', height: '50px', }}
            >Đăng Ký</MDBBtn>
          </Link>

        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default App;