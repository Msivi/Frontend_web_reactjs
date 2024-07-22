import React from 'react';
import "./style.scss";
import { memo, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { registerKhachHang } from "assets/serviceAPI/userService";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardImg, Row, Col } from "reactstrap";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { jwtDecode } from 'jwt-decode';

import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox
} from 'mdb-react-ui-kit';

function App() {
  const navigate = useNavigate();

  const [tenKhachHang, setTenKhachHang] = useState("");
  const [email, setEmail] = useState("");
  const [matKhau, setmatKhau] = useState("");
  const [sdt, setSdt] = useState("");
  const [cmnd, setCmnd] = useState("");
  const [ngaySinh, setNgaySinh] = useState("");
  const [gioiTinh, setGioiTinh] = useState("");
  const [ngaySinhError, setNgaySinhError] = useState("");

  const handleRegister = async () => {
    if (ngaySinhError) {
      toast.error("Ngày sinh không hợp lệ.");
      return;
    }

    try {
      // Tùy thuộc vào API của bạn, bạn có thể cần thay đổi tham số truyền vào cho phù hợp
      const response = await registerKhachHang(tenKhachHang, email, matKhau, sdt, cmnd, ngaySinh, gioiTinh);
      if (response.data.success) {
        toast.success("Đăng ký tài khoản thành công");
      } else {
        toast.success("Đăng ký tài khoản thành công.");
        navigate("/public/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi trong quá trình đăng ký.");
    }
  };

  const handleNgaySinhChange = (e) => {
    const value = e.target.value;
    setNgaySinh(value);
    validateNgaySinh(value);
  };

  const validateNgaySinh = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      setNgaySinhError("Ngày sinh không được lớn hơn ngày hiện tại.");
    } else {
      setNgaySinhError("");
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image'
      style={{
        backgroundImage: 'url(https://martina.vn/wp-content/uploads/2020/05/dong-phuc-benh-vien-y-te-05.png)',
        height: '720px'  // Thêm chiều cao ở đây
      }}
    >
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">Đăng Ký Tài Khoản</h2>

        <Row>
          <Col md={12}>
          
          <MDBInput wrapperClass='mb-4' label='Tên Khách Hàng' size='lg' id='form2' type='text' style={{ borderRadius: '20px', height: '30px' }}
            value={tenKhachHang}
            onChange={(e) => setTenKhachHang(e.target.value)}
          />
          <MDBInput wrapperClass='mb-4' label='Email' size='lg' id='form3' type='email' style={{ borderRadius: '20px', height: '30px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </Col>

        </Row>
       
          <MDBInput wrapperClass='mb-4' label='Mật Khẩu' size='lg' id='form2' type='text' style={{ borderRadius: '20px', height: '30px' }}
            value={matKhau}
            onChange={(e) => setmatKhau(e.target.value)}
          />
          <MDBInput wrapperClass='mb-4' label='Số Điện Thoại' size='lg' id='form2' type='text' style={{ borderRadius: '20px', height: '30px' }}
            value={sdt}
            onChange={(e) => setSdt(e.target.value)}
          />
          <MDBInput wrapperClass='mb-4' label='Chứng Minh Nhân Dân' size='lg' id='form2' type='text' style={{ borderRadius: '20px', height: '30px' }}
            value={cmnd}
            onChange={(e) => setCmnd(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Ngày sinh"
            size="lg"
            id="form3"
            type="date"
            style={{
              borderRadius: '20px',
              height: '50px',
              padding: '0.375rem 0.75rem',
              lineHeight: 'normal', // Ensure the line height does not clip the text
            }}
            value={ngaySinh}
            onChange={handleNgaySinhChange}
            onBlur={() => validateNgaySinh(ngaySinh)}
          />
          {ngaySinhError && <div style={{ color: 'red', marginBottom: '10px' }}>{ngaySinhError}</div>}

          <div className="d-flex">
            <div className="radio-button">
              <input
                className="radio-input"
                id="form4-nam"
                type="radio"
                value="Nam"
                checked={gioiTinh === "Nam"}
                onChange={(e) => setGioiTinh(e.target.value)}
              />
              <label className="radio-label" htmlFor="form4-nam">Nam</label>
            </div>
            <div className="radio-button">
              <input
                className="radio-input"
                id="form4-nu"
                type="radio"
                value="Nữ"
                checked={gioiTinh === "Nữ"}
                onChange={(e) => setGioiTinh(e.target.value)}
              />
              <label className="radio-label" htmlFor="form4-nu">Nữ</label>
            </div>
          </div>

          <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg'
            style={{ borderRadius: '20px', height: '50px' }}
            onClick={handleRegister}>Đăng Ký</MDBBtn>
          <Link to="/public/login">
            <MDBBtn className='mb-4 w-100 gradient-custom-4'
              style={{ borderRadius: '20px', height: '50px' }}
            >Quay Lại</MDBBtn>
          </Link>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default App;
