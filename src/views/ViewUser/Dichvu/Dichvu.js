import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardImg, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faStarHalfAlt as fasStarHalf } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import "./dichvustyle.css"; // Ensure you have the updated CSS imported
import banneryTe from "assets/img/yte1.jpg";

function Dichvu() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loaiDichVuId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching services for type ID:", loaiDichVuId); // Debugging log
    axios.get("http://localhost:5199/api/DichVu/get-all-dich-vu")
      .then(response => {
        console.log("Response data:", response.data); // Debugging log
        const filteredServices = response.data.filter(service => service.maLoaiDichVu === parseInt(loaiDichVuId));
        setServices(filteredServices);
        setLoading(false);
        filteredServices.forEach(service => {
          // fetchRating(service.id);
        });
      })
      .catch(error => {
        console.error("Error fetching data:", error); // Debugging log
        setError(error);
        setLoading(false);
      });
  }, [loaiDichVuId]);

  // const fetchRating = (serviceId) => {
  //   axios.get(`http://localhost:5199/api/DanhGia/get-sao-danh-gia?maDichVu=${serviceId}`)
  //     .then(response => {
  //       setRatings(prevRatings => ({ ...prevRatings, [serviceId]: response.data.soSaoTBDanhGia }));
  //     })
  //     .catch(error => {
  //       console.error("Error fetching rating data:", error); // Debugging log
  //     });
  // };

  
  const handleServiceClick = (id) => {
    navigate(`/Khachhang/datlich/${id}`);
  };

 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (services.length === 0) {
    return <div>No services found for this category.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="banner">
        <img src={banneryTe} alt="Banner" style={{ width: "100%", borderRadius: "20px" }} />
        <h2 style={{ position: "absolute", top: "20px", left: "20px", color: "#fff" }}>Nền tảng y tế - Sức khoẻ Toàn diện</h2>
      </div>
      <Row>
        {services.map(service => (
          <Col lg="4" md="6" sm="12" key={service.id} className="d-flex align-items-stretch">
            <Card className="fixed-size-card" onClick={() => handleServiceClick(service.id)}>
              <CardImg
                top
                width="100%"
                height="180px"
                src={
                  service.hinhAnh.startsWith("/")
                    ? `http://localhost:5199${service.hinhAnh}`
                    : service.hinhAnh
                }
                alt={service.tenDichVu}
              />
              <CardBody>
                <CardTitle tag="h5">{service.tenDichVu}</CardTitle>
                <p>{service.moTa}</p>
                <p className="price"><strong>Giá: </strong>{service.gia} VND</p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Dichvu;
