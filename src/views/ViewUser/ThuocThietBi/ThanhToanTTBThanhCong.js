import React, { useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGifts } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

function Thanhtoanthanhcong() {
  const navigate = useNavigate();

  useEffect(() => {
    const clearCart = async () => {
      try {
        const response = await axios.get('http://localhost:5199/api/KhachHang/get-tt-khach-hang');
        const maKhachHang = response.data.maKhachHang;
        localStorage.removeItem(`cart-${maKhachHang}`);
        console.log('Cart cleared successfully');
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    };

    clearCart();
  }, []);

  return (
    <div className="background-image">
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Row className="text-center">
          <Col>
            <Card>
              <Card.Body>
                <FontAwesomeIcon icon={faGifts} size="4x" color="red" />
                <Card.Title className="mt-3">Thanh toán thành công!</Card.Title>
                <Card.Text>
                  Xin Cám Ơn Qúy Khách
                  <br />
                  <br />
                </Card.Text>
                <Link to="/khachhang/danh-sach-hoa-don">
                  <Button>
                    Xem hóa đơn mua
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Thanhtoanthanhcong;
