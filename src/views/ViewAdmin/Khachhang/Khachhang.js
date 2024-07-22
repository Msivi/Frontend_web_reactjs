import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Table, Form, Row, Col, InputGroup } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './khachang.css'; // Import a custom CSS file for additional styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faAdd } from '@fortawesome/free-solid-svg-icons';
function Khachhang() {
    const [listDanhSachKhachHang, setlistDanhSachKhachHang] = useState([]);
    const [filteredKhachHang, setFilteredKhachHang] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [selectedKhachHang, setSelectedKhachHang] = useState(null);
    const [lichHen, setLichHen] = useState([]);
    const [bacSi, setBacSi] = useState([]);
    const [dichVu, setDichVu] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const GETTTKHACHHANG = async () => {
        try {
            let res = await axios.get('http://localhost:5199/api/KhachHang/get-all-khach-hang');
            if (res.data) {
                setlistDanhSachKhachHang(res.data);
                setFilteredKhachHang(res.data);
            }
        } catch (error) {
            toast.error("Error fetching data");
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchKey(value);
        setFilteredKhachHang(
            listDanhSachKhachHang.filter(khachHang =>
                khachHang.tenKhachHang.toLowerCase().includes(value)
            )
        );
    };

    const handleViewInfo = async (khachHang) => {
        setSelectedKhachHang(khachHang);

        try {
            let lichHenRes = await axios.get('http://localhost:5199/api/LichHen/get-all-lich-hen');
            let bacSiRes = await axios.get('http://localhost:5199/api/BacSi/get-all-bac-si');
            let dichVuRes = await axios.get('http://localhost:5199/api/DichVu/get-all-dich-vu');

            if (lichHenRes.data && bacSiRes.data && dichVuRes.data) {
                setLichHen(lichHenRes.data.filter(item => item.maKhachHang === khachHang.maKhachHang));
                setBacSi(bacSiRes.data);
                setDichVu(dichVuRes.data);
            }

            setShowModal(true);
        } catch (error) {
            toast.error("Error fetching detailed information");
        }
    };

    const handleDeleteKhachHang = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
            try {
                await axios.delete(`http://localhost:5199/api/KhachHang/delete-khach-hang?keyId=${id}`);
                toast.success("Xóa khách hàng thành công");
                GETTTKHACHHANG();
            } catch (error) {
                toast.error("Lỗi khi xóa khách hàng");
            }
        }
    };

    useEffect(() => {
        GETTTKHACHHANG();
    }, []);

    const renderLichHen = () => {
        return lichHen.map((item, index) => {
            const doctor = bacSi.find(b => b.id === item.maBacSi);
            const service = dichVu.find(d => d.id === item.maDichVu);
            return (
                <tr key={index}>
                    <td>{item.diaDiem}</td>
                    <td>{item.trangThai}</td>
                    <td>{item.ghiChu}</td>
                    <td>{item.thoiGianDuKien}</td>
                    <td>{doctor ? doctor.tenBacSi : 'N/A'}</td>
                    <td>{service ? service.tenDichVu : 'N/A'}</td>
                    <td>{service ? service.gia : 'N/A'}</td>
                </tr>
            );
        });
    };

    return (
        <div className="container" style={{ marginTop: '50px', maxWidth: '100%', marginLeft:-30 }}>
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div style={{ marginTop: -80 }} className="card card-user">
                            <h1 style={{ fontWeight: 'bold', color: 'red', textAlign: 'center' }}>Thông tin khách hàng</h1>
                            <Form className="mb-3">
                                <Row>
                                    <Col md={12}>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tìm Kiếm"
                                                value={searchKey}
                                                onChange={handleInputChange}
                                                style={{ padding: '10px', fontSize: '16px' }}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Form>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Tên Khách Hàng</th>
                                        <th>Email</th>
                                        <th>Số Điện Thoại</th>
                                        <th>CMND</th>
                                        <th>Ngày Sinh</th>
                                        <th>Giới Tính</th>
                                        <th>Thông Tin</th>
                                        <th>Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredKhachHang.map((list, index) => (
                                        <tr key={index}>
                                            <td>{list.maKhachHang}</td>
                                            <td>{list.tenKhachHang}</td>
                                            <td>{list.email}</td>
                                            <td>{list.sdt}</td>
                                            <td>{list.cmnd}</td>
                                            <td>{list.ngaySinh}</td>
                                            <td>{list.gioiTinh}</td>
                                            <td>
                                                <Button variant="info" style={{ padding: '5px 10px' }} onClick={() => handleViewInfo(list)}> thông tin</Button>
                                            </td>
                                            <td>
                                               
                                                <FontAwesomeIcon
                              icon={faTrashAlt}
                              style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                              onClick={() => handleDeleteKhachHang(list.maKhachHang)}
                            />
                                         
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi Tiết Khách Hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedKhachHang && (
                        <>
                            <h5>Thông tin khách hàng</h5>
                            <p>Tên: {selectedKhachHang.tenKhachHang}</p>
                            <p>Email: {selectedKhachHang.email}</p>
                            <p>Số điện thoại: {selectedKhachHang.sdt}</p>
                            <p>CMND: {selectedKhachHang.cmnd}</p>
                            <p>Ngày sinh: {selectedKhachHang.ngaySinh}</p>
                            <p>Giới tính: {selectedKhachHang.gioiTinh}</p>
                            <h5>Lịch hẹn</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Địa Điểm</th>
                                        <th>Trạng Thái</th>
                                        <th>Ghi Chú</th>
                                        <th>Thời Gian Dự Kiến</th>
                                        <th>Bác Sĩ</th>
                                        <th>Dịch Vụ</th>
                                        <th>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderLichHen()}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Khachhang;
