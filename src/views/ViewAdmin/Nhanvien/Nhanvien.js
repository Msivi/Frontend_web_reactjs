import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Table, Button, Form, InputGroup, Row, Col, Modal } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.min.css';
import './nhanvien.css';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faInfoCircle , faAdd } from '@fortawesome/free-solid-svg-icons';

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  .btn, .icon-btn {
    padding: 5px 10px;
    margin: 0 2px;
    font-size: 12px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon-btn {
    width: 30px;
  }

  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    color: white;
  }

  .btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
    color: white;
  }

  .btn.active {
    background-color: #28a745;
    border-color: #28a745;
    color: white;
  }
`;

function Nhanvien() {
  const [nhanViens, setNhanViens] = useState([]);
  const [selectedNhanVien, setSelectedNhanVien] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // State để điều khiển modal tạo nhân viên
  const [newNhanVien, setNewNhanVien] = useState({
    tenNhanVien: "",
    email: "",
    matKhau: "",
    sdt: "",
    cmnd: ""
  }); // State để lưu thông tin nhân viên mới
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lichLamViec, setLichLamViec] = useState([]);
  const [bacSi, setBacSi] = useState([]);
  const devicesPerPage = 5;

  useEffect(() => {
    fetchNhanViens();
    fetchBacSi();
  }, [searchKey, currentPage]);

  const fetchNhanViens = async () => {
    try {
      const response = await axios.get(`http://localhost:5199/api/NhanVien/get-all-nhan-vien?searchKey=${searchKey}`);
      const filteredNhanViens = response.data.filter(nv => nv.role === "NhanVien");
      setNhanViens(filteredNhanViens);
    } catch (error) {
      console.error("There was an error fetching the nhan viens!", error);
      toast.error("Failed to fetch nhan viens");
    }
  };

  const fetchBacSi = async () => {
    try {
      const response = await axios.get("http://localhost:5199/api/BacSi/get-all-bac-si");
      setBacSi(response.data);
    } catch (error) {
      console.error("There was an error fetching the bac si!", error);
      toast.error("Failed to fetch bac si");
    }
  };

  const fetchLichLamViec = async (createBy) => {
    try {
      const response = await axios.get("http://localhost:5199/api/LichLamViec/get-all-lich-lam-viec");
      const filteredLichLamViec = response.data.filter(llv => llv.createBy === createBy);
      setLichLamViec(filteredLichLamViec);
    } catch (error) {
      console.error("There was an error fetching the lich lam viec!", error);
      toast.error("Failed to fetch lich lam viec");
    }
  };

  const handleDetailClick = (createBy) => {
    fetchLichLamViec(createBy);
    setShowDetailModal(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5199/api/NhanVien/delete-nhan-vien?keyId=${id}`);
      toast.success("Nhân viên đã được xóa thành công!");
      fetchNhanViens(); // Refresh the list after deletion
    } catch (error) {
      console.error("There was an error deleting the nhan vien!", error);
      toast.error("Failed to delete nhan vien");
    }
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
    setCurrentPage(1);
  };

  const handleReload = () => {
    setSearchKey("");
    setCurrentPage(1);
    fetchNhanViens();
  };

  const handleCreateNhanVienChange = (e) => {
    const { name, value } = e.target;
    setNewNhanVien((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateNhanVien = async () => {
    try {
      await axios.post("http://localhost:5199/api/Authentication/create-nhan-vien", newNhanVien);
      toast.success("Thành Công!");
      setShowCreateModal(false);
      fetchNhanViens(); // Refresh the list after creation
      window.location.reload();
    } catch (error) {
      console.error("There was an error creating the nhan vien!", error);
      toast.error("Failed to create nhan vien");
    }
  };

  const filteredDevices = nhanViens.filter(device => {
    return (!searchKey || device.tenNhanVien.toLowerCase().includes(searchKey.toLowerCase()));
  });

  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);
  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / 3) * 3;
    return new Array(Math.min(3, totalPages - start)).fill().map((_, idx) => start + idx + 1);
  };

  return (
    <>
      <div style={{ marginTop: 100 }} className="">
        <h1 style={{color:'red',fontWeight:'bold',textAlign:'center'}}>Nhân Viên</h1>
        <Form className="mb-3">
          <Row>
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Tìm Kiếm"
                  value={searchKey}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
            <FontAwesomeIcon
                              icon={faAdd}
                              style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' , marginTop:10 }}
                              onClick={() => setShowCreateModal(true)}
                            />
            </Col>
            <Col md={2}>
              <Button style={{ marginTop:-2 , height:40 }} onClick={handleReload}>Load</Button>
            </Col>
          </Row>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Nhân Viên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>CMND</th>
              <th>Xem Thông Tin</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {currentDevices.map((nv) => (
              <tr key={nv.id}>
                <td>{nv.id}</td>
                <td>{nv.tenNhanVien}</td>
                <td>{nv.email}</td>
                <td>{nv.sdt}</td>
                <td>{nv.cmnd}</td>
                <td>
                  <Button variant="info" onClick={() => handleDetailClick(nv.id)}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </Button>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteClick(nv.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination>
          <button className="icon-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {getPaginationGroup().map(item => (
            <Button
              key={item}
              onClick={() => setCurrentPage(item)}
              variant={item === currentPage ? 'primary' : 'secondary'}
              className={item === currentPage ? 'm-1 active' : 'm-1'}
            >
              {item}
            </Button>
          ))}
          <button className="icon-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </Pagination>

        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thông Tin Chi Tiết</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {lichLamViec.map((lich, index) => {
              const doctor = bacSi.find(bs => bs.id === lich.maBacSi);
              return (
                <div key={index}>
                  <p>Ngày: {lich.ngay}</p>
                  <p>Giờ Bắt Đầu: {lich.gioBatDau}</p>
                  <p>Giờ Kết Thúc: {lich.gioKetThuc}</p>
                  <p>Mã Bác Sĩ: {lich.maBacSi}</p>
                  <p>Tên Bác Sĩ: {doctor ? doctor.tenBacSi : "N/A"}</p>
                  <hr />
                </div>
              );
            })}
          </Modal.Body>
          <Modal.Footer>
    
          </Modal.Footer>
        </Modal>

        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm Nhân Viên </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Tên Nhân Viên</Form.Label>
                <Form.Control
                  type="text"
                  name="tenNhanVien"
                  value={newNhanVien.tenNhanVien}
                  onChange={handleCreateNhanVienChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newNhanVien.email}
                  onChange={handleCreateNhanVienChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Mật Khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="matKhau"
                  value={newNhanVien.matKhau}
                  onChange={handleCreateNhanVienChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Số Điện Thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="sdt"
                  value={newNhanVien.sdt}
                  onChange={handleCreateNhanVienChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>CMND</Form.Label>
                <Form.Control
                  type="text"
                  name="cmnd"
                  value={newNhanVien.cmnd}
                  onChange={handleCreateNhanVienChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
        
            <Button variant="primary" onClick={handleCreateNhanVien}>
              Tạo
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default Nhanvien;
