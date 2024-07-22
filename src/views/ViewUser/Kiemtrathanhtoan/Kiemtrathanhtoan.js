import React, { useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Kiemtrathanhtoan.css'; // Import file CSS

function Kiemtrathanhtoan() {
  const navigate = useNavigate();

  useEffect(() => {
   
      handleQuayLai();
    
      }, []);

  const handleQuayLai = async () => {
    try {
      // Gọi API để lấy lịch hẹn khách hàng mới nhất
      const lichHenResponse = await fetch('http://localhost:5199/api/LichHen/get-all-lich-hen-khach-hang');
      const lichHenData = await lichHenResponse.json();
      const latestLichHen = lichHenData[lichHenData.length - 1]; // Lấy lịch hẹn mới nhất
      const maLichHen = latestLichHen.id;

      // Gọi API để kiểm tra trạng thái thanh toán
      const thanhToanResponse = await fetch(`http://localhost:5199/api/ThanhToanDV/get-thanh-toan-by-id-lich-hen?maLichHen=${maLichHen}`);
      const thanhToanData = await thanhToanResponse.json();

      if (thanhToanData.trangThai !== "True") {
        // Gọi API để xóa lịch hẹn nếu chưa thanh toán
        await fetch(`http://localhost:5199/api/LichHen/delete-lich-hen?keyId=${maLichHen}`, { method: 'DELETE' });
      }

      // Điều hướng về trang DashBoard
     
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const BackDashBoard = async () => {
    navigate('/khachhang/DashBoard');
  }

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
                  Dịch vụ chưa được thanh toán
                  <br />
                  <br />
                  Hãy thử lại hoặc chọn phương thức thanh toán khác
                </Card.Text>
                <Button
                  className='mb-4 w-100 gradient-custom-4'
                  style={{ borderRadius: '20px', height: '50px' }}
                  onClick={BackDashBoard}
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

export default Kiemtrathanhtoan;
