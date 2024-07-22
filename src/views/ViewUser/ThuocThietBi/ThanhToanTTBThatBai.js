import React, { useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './KiemTraThanhToan.css'; // Import CSS file

function ThanhToanThatBai() {
  const navigate = useNavigate();

  const handleQuayLai = async () => {
    try {
      // Gọi API để lấy hóa đơn khách hàng mới nhất
      const hoaDonResponse = await fetch('http://localhost:5199/api/HoaDon/get-all-hoa-don-khach-hang');
      const hoaDonData = await hoaDonResponse.json();
      const latestHoaDon = hoaDonData[hoaDonData.length - 1]; // Lấy hóa đơn mới nhất
      const maHoaDon = latestHoaDon.id;

      // Kiểm tra trạng thái thanh toán
      if (latestHoaDon.trangThai !== "True") {
        // Xóa hóa đơn nếu chưa thanh toán
        await fetch(`http://localhost:5199/api/HoaDon/delete-hoa-don?keyId=${maHoaDon}`, { method: 'DELETE' });
      }

      // Điều hướng về trang DashBoard
      navigate('/khachhang/DashBoard');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="background-image">
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Row className="text-center">
          <Col>
            <Card>
              <Card.Body>
                <FontAwesomeIcon icon={faTimesCircle} size="4x" color="red" />
                <Card.Title className="mt-3">Thanh toán thất bại!</Card.Title>
                <Card.Text>
                  Mua hàng chưa được thanh toán
                  <br />
                  <br />
                  Hãy thử lại hoặc chọn phương thức thanh toán khác
                </Card.Text>
                <Button
                  className='mb-4 w-100 gradient-custom-4'
                  style={{ borderRadius: '20px', height: '50px' }}
                  onClick={handleQuayLai}
                >
                  Quay Lại
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ThanhToanThatBai;
