import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import './TimKiem.css';

const BASE_URL = 'http://localhost:5199';

const TimKiem6 = () => {
  const [dichVu, setDichVu] = useState([]);
  const [bacSi, setBacSi] = useState([]);
  const [search, setSearch] = useState('');
  const [chuyenKhoaList, setChuyenKhoaList] = useState([]);
  const [selectedLoaiDichVu, setSelectedLoaiDichVu] = useState(null);
  const [selectedChuyenKhoa, setSelectedChuyenKhoa] = useState(null);
  const [filteredDichVu, setFilteredDichVu] = useState([]);
  const [filteredBacSi, setFilteredBacSi] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [filterType, setFilterType] = useState('dichVu');
  const [modal, setModal] = useState(false);
  const [hoveredDoctorDetails, setHoveredDoctorDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDichVu();
    fetchChuyenKhoa();
    fetchBacSi();
  }, []);

  const fetchDichVu = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/DichVu/get-all-dich-vu`);
      setDichVu(response.data);
      setFilteredDichVu(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchChuyenKhoa = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/ChuyenKhoa/get-all-chuyen-khoa`);
      setChuyenKhoaList(response.data);
    } catch (error) {
      console.error('Failed to fetch specialties:', error);
    }
  };

  const fetchBacSi = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/BacSi/get-all-bac-si`);
      setBacSi(response.data);
      setFilteredBacSi(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const handleSearch = () => {
    const searchLower = search.toLowerCase();
    if (filterType === 'dichVu') {
      let filteredServices = dichVu.filter(service => service.tenDichVu.toLowerCase().includes(searchLower));
      if (selectedLoaiDichVu !== null) {
        filteredServices = filteredServices.filter(service => service.maLoaiDichVu === selectedLoaiDichVu);
      }
      if (selectedChuyenKhoa !== null) {
        filteredServices = filteredServices.filter(service => service.maChuyenKhoa === selectedChuyenKhoa);
      }
      setFilteredDichVu(filteredServices);
      setNoResults(filteredServices.length === 0);
    } else if (filterType === 'bacSi') {
      let filteredDoctors = bacSi.filter(doctor => doctor.tenBacSi.toLowerCase().includes(searchLower));
      if (selectedChuyenKhoa !== null) {
        filteredDoctors = filteredDoctors.filter(doctor => doctor.maChuyenKhoa === selectedChuyenKhoa);
      }
      setFilteredBacSi(filteredDoctors);
      setNoResults(filteredDoctors.length === 0);
    }
  };

  const clearSearch = () => {
    setSearch('');
    if (filterType === 'dichVu') {
      setFilteredDichVu(dichVu);
    } else if (filterType === 'bacSi') {
      setFilteredBacSi(bacSi);
    }
    setNoResults(false);
  };

  const toggleLoaiDichVu = (id) => {
    setSelectedLoaiDichVu(selectedLoaiDichVu === id ? null : id);
  };

  const toggleChuyenKhoa = (id) => {
    setSelectedChuyenKhoa(selectedChuyenKhoa === id ? null : id);
  };

  const handleServiceClick = (id) => {
    navigate(`/Khachhang/datlich/${id}`);
  };

  const handleDoctorClick = async (id) => {
    try {
      const doctorResponse = await axios.get(`${BASE_URL}/api/BacSi/get-bac-si-by-id?id=${id}`);
      const doctor = doctorResponse.data;

      const specialtyResponse = await axios.get(`${BASE_URL}/api/CTBacSi/get-all-ct-bac-si`);
      const specialties = specialtyResponse.data.filter(s => s.maBacSi === id);

      const servicesResponse = await axios.get(`${BASE_URL}/api/LoaiDichVu/get-all-loai-dich-vu`);
      const services = servicesResponse.data.filter(service => specialties.some(s => s.maChuyenKhoa === service.id));

      const specialtiesNames = await Promise.all(specialties.map(async (s) => {
        const specialtyResponse = await axios.get(`${BASE_URL}/api/ChuyenKhoa/get-chuyen-khoa-by-id?id=${s.maChuyenKhoa}`);
        return specialtyResponse.data.tenChuyenKhoa;
      }));

      const servicesNames = await Promise.all(services.map(async (s) => {
        const serviceResponse = await axios.get(`${BASE_URL}/api/DichVu/get-all-dich-vu-theo-loai-theo-chuyen-khoa?loaiDichVuId=${s.id}&chuyenKhoaId=${specialties[0].maChuyenKhoa}`);
        return serviceResponse.data[0]?.tenDichVu || '';
      }));

      setHoveredDoctorDetails({
        doctor,
        specialtiesNames,
        servicesNames,
      });

      setModal(true);
    } catch (error) {
      console.error('Failed to fetch doctor details', error);
    }
  };

  const handleModalClose = () => {
    setModal(false);
    setHoveredDoctorDetails({});
  };

  const renderService = (service) => (
    <Col lg="3" md="6" sm="6" key={service.id}>
      <Card className="service-card6" onClick={() => handleServiceClick(service.id)}>
        <CardImg top src={`${BASE_URL}${service.hinhAnh}`} alt={service.tenDichVu} className="service-image6" />
        <CardBody>
          <CardTitle className="service-name6">{service.tenDichVu}</CardTitle>
          <p className="service-price6">{service.gia.toLocaleString('vi-VN')} đ</p>
        </CardBody>
      </Card>
    </Col>
  );

  const renderDoctor = (doctor) => (
    <Col lg="3" md="6" sm="6" key={doctor.id}>
      <Card className="doctor-card6" onClick={() => handleDoctorClick(doctor.id)}>
        <CardImg style={{marginLeft:85}} top src={`${BASE_URL}${doctor.hinhAnh}`} alt={doctor.tenBacSi} className="service-image6" />
        <CardBody>
          <CardTitle className="doctor-name6">{doctor.tenBacSi}</CardTitle>
        </CardBody>
      </Card>
    </Col>
  );

  return (
    <Container style={{marginTop:100}} className="search-container6">
      <div className="search-bar6">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {search.length > 0 && (
          <Button onClick={clearSearch} className="clear-button6">
            X
          </Button>
        )}
        <Button onClick={handleSearch}>
          LỌC
        </Button>
      </div>
      <div className="filterContainer6">
        <FormGroup>
          <div className="filterOptionsContainer6">
            <Button
              color={filterType === 'dichVu' ? 'primary' : 'secondary'}
              onClick={() => setFilterType('dichVu')}
            >
              Dịch vụ
            </Button>
            <Button
              color={filterType === 'bacSi' ? 'primary' : 'secondary'}
              onClick={() => setFilterType('bacSi')}
            >
              Bác sĩ
            </Button>
          </div>
        </FormGroup>
        {filterType === 'dichVu' && (
          <FormGroup>
            <label>Loại dịch vụ</label>
            <div className="filterOptionsContainer6">
              <Button
                color={selectedLoaiDichVu === 1 ? 'primary' : 'secondary'}
                onClick={() => toggleLoaiDichVu(1)}
              >
                Khám tại nhà
              </Button>
              <Button
                color={selectedLoaiDichVu === 2 ? 'primary' : 'secondary'}
                onClick={() => toggleLoaiDichVu(2)}
              >
                Khám online
              </Button>
            </div>
          </FormGroup>
        )}
        <FormGroup>
          <label>Chuyên khoa</label>
          <div className="filterOptionsContainer6">
            {chuyenKhoaList.map((khoa) => (
              <Button 
             
                key={khoa.id}
                color={selectedChuyenKhoa === khoa.id ? 'primary' : 'secondary'}
                onClick={() => toggleChuyenKhoa(khoa.id)}
              >
                {khoa.tenChuyenKhoa}
              </Button>
            ))}
          </div>
        </FormGroup>
      </div>
      <Row>
        {filterType === 'dichVu'
          ? filteredDichVu.map(renderService)
          : filteredBacSi.map(renderDoctor)}
      </Row>
      <Modal isOpen={modal} toggle={handleModalClose}>
        <ModalHeader toggle={handleModalClose}>Thông tin bác sĩ</ModalHeader>
        <ModalBody>
          {hoveredDoctorDetails.doctor && (
            <>
              <p><strong>Tên bác sĩ:</strong> {hoveredDoctorDetails.doctor.tenBacSi}</p>
              <p><strong>Bằng cấp:</strong> {hoveredDoctorDetails.doctor.bangCap}</p>
              <p><strong>Chuyên khoa:</strong> {hoveredDoctorDetails.specialtiesNames.join(', ')}</p>
              <p><strong>Dịch vụ:</strong> {hoveredDoctorDetails.servicesNames.join(', ')}</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleModalClose}>Đóng</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default TimKiem6;
