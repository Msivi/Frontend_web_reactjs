import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  CardImg,
  Col,
  Button,
  Input,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "./Dashboard.css";
import banneryTe from "assets/img/yte1.jpg";
import iconKhamTaiNha from "assets/img/iconkhamtainha.png";
import iconKhamOnline from "assets/img/iconkhamonline.png";
import icon1 from "assets/img/icon1.png";
import icon2 from "assets/img/icon2.png";
import icon3 from "assets/img/icon3.png";
import icon4 from "assets/img/icon4.png";

const serviceIcons = {
  "Khám tại nhà": iconKhamTaiNha,
  "Khám online": iconKhamOnline,
};

const ChuyenKhoaIcons = {
  "Khám bệnh": icon1,
  "Nội tiết": icon2,
  "Nhi": icon3,
  "Da liễu": icon4,
  "Sản": icon1,
  "Mắt": icon2,
  "Tai mũi họng": icon3,
  "Dinh dưỡng": icon4,
  "Thần kinh": icon4,
};

function Dashboard() {
  const [data, setData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [hoveredDoctor, setHoveredDoctor] = useState(null);
  const [hoveredDoctorDetails, setHoveredDoctorDetails] = useState({});
  const [modal, setModal] = useState(false);
  
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadAllData = () => {
      axios.get("http://localhost:5199/api/DichVu/get-all-dich-vu")
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.log(error);
        });

      axios.get("http://localhost:5199/api/BacSi/get-all-bac-si")
        .then(response => {
          setDoctors(response.data);
        })
        .catch(error => {
          console.log(error);
        });

      axios.get("http://localhost:5199/api/LoaiDichVu/get-all-loai-dich-vu")
        .then(response => {
          setServices(response.data);
        })
        .catch(error => {
          console.log(error);
        });

      axios.get("http://localhost:5199/api/ChuyenKhoa/get-all-chuyen-khoa")
        .then(response => {
          setSpecialties(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    };

    loadAllData();
  }, []);

  const handleDatLichClick = (id) => {
    navigate(`/Khachhang/datlich/${id}`);
  };

  const handleSpecialtyClick = (id) => {
    navigate(`/Khachhang/chuyenkhoa/${id}`);
  };

  const handleServiceClick = (id) => {
    navigate(`/Khachhang/dichvu/${id}`);
  };

  const handleDoctorMouseEnter = async (id) => {
    try {
      const doctorResponse = await axios.get(`http://localhost:5199/api/BacSi/get-bac-si-by-id?id=${id}`);
      const doctor = doctorResponse.data;

      const specialtyResponse = await axios.get(`http://localhost:5199/api/CTBacSi/get-all-ct-bac-si`);
      const specialties = specialtyResponse.data.filter(s => s.maBacSi === id);

      const servicesResponse = await axios.get(`http://localhost:5199/api/LoaiDichVu/get-all-loai-dich-vu`);
      const services = servicesResponse.data.filter(service => specialties.some(s => s.maChuyenKhoa === service.id));

      // Fetch the names of specialties and services
      const specialtiesNames = await Promise.all(specialties.map(async (s) => {
        const specialtyResponse = await axios.get(`http://localhost:5199/api/ChuyenKhoa/get-chuyen-khoa-by-id?id=${s.maChuyenKhoa}`);
        return specialtyResponse.data.tenChuyenKhoa;
      }));

      const servicesNames = await Promise.all(services.map(async (s) => {
        const serviceResponse = await axios.get(`http://localhost:5199/api/DichVu/get-all-dich-vu-theo-loai-theo-chuyen-khoa?loaiDichVuId=${s.id}&chuyenKhoaId=${specialties[0].maChuyenKhoa}`);
        return serviceResponse.data[0]?.tenDichVu || '';
      }));

      setHoveredDoctorDetails({
        doctor,
        specialtiesNames,
        servicesNames
      });

      setHoveredDoctor(id);
      setModal(true);
    } catch (error) {
      console.error("Failed to fetch doctor details", error);
    }
  };

  const handleModalClose = () => {
    setModal(false);
    setHoveredDoctor(null);
    setHoveredDoctorDetails({});
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  return (
    <>
      <div className="content">
        <div className="banner">
          <img src={banneryTe} alt="Banner" style={{ width: "100%", borderRadius: "20px" }} />
          <h2 style={{ position: "absolute", top: "20px", left: "20px", color: "#fff" }}>Nền tảng y tế - Sức khoẻ Toàn diện</h2>
        </div>

        <Form style={{ marginTop: "20px" }}>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <Input
              type="text"
              placeholder="Tìm tất cả"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Button type="submit" color="primary" className="search-button">
              Tìm kiếm
            </Button>
          </div>
        </Form>

        <h3 style={{ margin: "20px 0" }}>Dịch Vụ Toàn Diện</h3>
        <Row>
          {services.map(service => (
            <Col lg="3" md="6" sm="6" key={service.id}>
              <Card className="service-card" onClick={() => handleServiceClick(service.id)}>
                <CardBody className="d-flex align-items-center">
                  <div className="service-icon">
                    <img src={serviceIcons[service.tenLoai]} alt="icon" />
                  </div>
                  <div className="service-name">
                    {service.tenLoai}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <h3 style={{ margin: "20px 0" }}>Chuyên khoa</h3>
        <Row>
          {specialties.map(specialty => (
            <Col lg="3" md="6" sm="6" key={specialty.id}>
              <Card className="specialty-card" onClick={() => handleSpecialtyClick(specialty.id)}>
                <CardBody className="d-flex align-items-center">
                  <div className="specialty-icon">
                    <img src={ChuyenKhoaIcons[specialty.tenChuyenKhoa]} alt="icon" />
                  </div>
                  <div className="specialty-name">
                    {specialty.tenChuyenKhoa}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <h3 style={{ margin: "20px 0" }}>Dịch Vụ</h3>
        <Row className="card-container">
          <TransitionGroup className="card-container">
            {data.map((item) => (
              <CSSTransition key={item.id} timeout={500} classNames="item">
                <Col lg="3" md="6" sm="6" className="item">
                  <Card style={{ height: 350 }} className="fixed-size-card" onClick={() => handleDatLichClick(item.id)}>
                    <CardBody className="d-flex flex-column justify-content-between">
                      <Row>
                        <Col md="12" xs="12">
                          <p style={{ color: "red", fontWeight: "bold", fontSize: "20", textAlign: "center" }} className="card-category">{item.tenDichVu}</p>
                          <div className="numbers">
                            <CardImg height={80} src={item.hinhAnh.startsWith("/") ? `http://localhost:5199${item.hinhAnh}` : item.hinhAnh} alt={item.tenDichVu} />
                            <CardTitle style={{ color: "red", fontWeight: "bold", fontSize: 20, textAlign: 'center' }} className="card-gia">{`${item.gia} vnđ`}</CardTitle>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter>
                      <hr />
                      <div className="stats">
                        <i className="fas fa-sync-alt" /> Dịch Vụ
                      </div>
                    </CardFooter>
                  </Card>
                </Col>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </Row>
      </div>

      <h3 style={{ marginLeft: "30px" }}>Bác Sĩ Nổi Bật</h3>
      <div style={{ marginTop: "-20px" }} className="content">
        <Row>
          {doctors.map(doctor => (
            <Col lg="3" md="6" sm="6" key={doctor.id}>
              <Card
                style={{ height: 400 }}
                className="doctor-card"
                onMouseEnter={() => handleDoctorMouseEnter(doctor.id)}
              >
                <CardBody className="text-center">
                  <CardImg style={{ height: 200 }} src={doctor.hinhAnh.startsWith("/") ? `http://localhost:5199${doctor.hinhAnh}` : doctor.hinhAnh} alt={doctor.tenBacSi} />
                  <CardTitle tag="h5">{doctor.tenBacSi}</CardTitle>
                  <p>{doctor.bangCap}</p>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal isOpen={modal} toggle={handleModalClose} onBackdropClick={handleBackdropClick}>
        <ModalHeader toggle={handleModalClose}>Thông tin bác sĩ</ModalHeader>
        <ModalBody>
          {hoveredDoctorDetails.doctor && (
            <>
              <p><strong>Tên bác sĩ:</strong> {hoveredDoctorDetails.doctor.tenBacSi}</p>
              <p><strong>Bằng cấp:</strong> {hoveredDoctorDetails.doctor.bangCap}</p>
              <p><strong>Chuyên khoa:</strong> {hoveredDoctorDetails.specialtiesNames.join(", ")}</p>
              <p><strong>Dịch vụ:</strong> {hoveredDoctorDetails.servicesNames.join(", ")}</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleModalClose}>Đóng</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Dashboard;
