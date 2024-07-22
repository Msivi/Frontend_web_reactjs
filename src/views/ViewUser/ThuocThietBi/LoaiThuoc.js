import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardImg, Row, Col,  } from "reactstrap";
import bannerThuoc from "assets/img/yte1.jpg"; // Update with your actual image path

function LoaiThuoc() {
  const [thuoc, setThuoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { idLoaiThuoc } = useParams(); 
  console.log("Received ID from useParams:", idLoaiThuoc);
  const navigate = useNavigate();

  useEffect(() => {
    const a = parseInt(idLoaiThuoc);
    console.log(a);
    axios.get(`http://localhost:5199/api/Thuoc/get-thuoc-by-id-loai-thuoc?id=${idLoaiThuoc}`)
      .then(response => {
        setThuoc(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  }, [idLoaiThuoc]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (thuoc.length === 0) {
    return <div>No drugs found for this category.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="banner">
        <img src={bannerThuoc} alt="Banner" style={{ width: "100%", borderRadius: "20px" }} />
        <h2 style={{ position: "absolute", top: "20px", left: "20px", color: "#fff" }}>Nền tảng y tế - Sức khoẻ Toàn diện</h2>
      </div>
      <Row>
        {thuoc.map(item => (
          <Col lg="4" md="6" sm="12" key={item.id}>
       
            <Card className="fixed-size-card" >
              <CardImg
                top
                width="100%"
                height="180px"
                src={
                  item.hinhAnh.startsWith("/")
                    ? `http://localhost:5199${item.hinhAnh}`
                    : item.hinhAnh
                }
                alt={item.tenThuoc}
              />
              <CardBody>
                <CardTitle tag="h5">{item.tenThuoc}</CardTitle>
                <p><strong>Đơn giá: </strong>{item.donGia} VND</p>
                <p><strong>Số lượng: </strong>{item.soLuong}</p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default LoaiThuoc;
