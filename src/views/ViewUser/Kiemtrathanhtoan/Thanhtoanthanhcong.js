import React, { useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGifts } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

function Thanhtoanthanhcong() {
  

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
            
              <Link to="/khachhang/lichhen">
              <Button>
              Xem thông tin lịch khám

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
