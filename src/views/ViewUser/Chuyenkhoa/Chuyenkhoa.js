import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams , useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardImg, CardFooter, Row, Col, Button } from "reactstrap";
import "./chuyenkhoastyle.css"; // Ensure you have the updated CSS imported
import banneryTe from "assets/img/yte1.jpg";

function Chuyenkhoa() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { chuyenKhoaId  } = useParams();
  const navigate = useNavigate();

 
 const handleServiceClick = (id) => {
    navigate(`/khachhang/datlich/${id}`);
  };

  useEffect(() => {
    console.log("Fetching services for type ID:", chuyenKhoaId ); // Debugging log
    axios.get("http://localhost:5199/api/DichVu/get-all-dich-vu")
      .then(response => {
        console.log("Response data:", response.data); // Debugging log
        const filteredServices = response.data.filter(service => service.maChuyenKhoa === parseInt(chuyenKhoaId ));
        setServices(filteredServices);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error); // Debugging log
        setError(error);
        setLoading(false);
      });

    

  }, [chuyenKhoaId]);

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
          <Col lg="4" md="6" sm="12" key={service.id}>
            <Card className="fixed-size-card" onClick={() => handleServiceClick(service.id)} style={{ marginBottom: "20px" }}>
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
                <p  className="price"><strong>Giá: </strong>{service.gia} VND</p>
              </CardBody>
          
            </Card>
          </Col>
        ))}
      </Row>

  
   
    </div>
  );
}

export default Chuyenkhoa;
