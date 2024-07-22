import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Card, Table, Modal, Form, Button } from "react-bootstrap";
import { FaEdit, FaPlus } from 'react-icons/fa';
import './thongtin.css';
import { toast } from "react-toastify";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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

function Lichhen() {
    const [appointmentsChuaKham, setAppointmentsChuaKham] = useState([]);
    const [appointmentsDaKham, setAppointmentsDaKham] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [results, setResults] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [moTa, setMoTa] = useState('');
    const [diaDiem, setDiaDiem] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 5;

    useEffect(() => {
        fetchAppointmentsChuaKham();
        fetchAppointmentsDaKham();
        fetchCustomers();
        fetchServices();
        fetchResults();
        fetchAllAppointments();
    }, []);

    const fetchAppointmentsChuaKham = async () => {
        try {
            const response = await axios.get('http://localhost:5199/api/LichHen/get-all-lich-hen-bac-si-chua-kham');
            setAppointmentsChuaKham(response.data);
        } catch (error) {
            console.error('Error fetching appointments chưa khám:', error);
        }
    };

    const fetchAppointmentsDaKham = async () => {
        try {
            const response = await axios.get('http://localhost:5199/api/LichHen/get-all-lich-hen-bac-si-da-kham');
            setAppointmentsDaKham(response.data);
        } catch (error) {
            console.error('Error fetching appointments đã khám:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5199/api/KhachHang/get-all-khach-hang');
            setCustomers(response.data);
} catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:5199/api/DichVu/get-all-dich-vu');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchResults = async () => {
        try {
            const response = await axios.get('http://localhost:5199/api/KetQuaDichVu/get-all-ket-qua-dich-vu-bac-si');
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching service results:', error);
        }
    };

    const fetchAllAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:5199/api/LichHen/get-all-lich-hen');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching all appointments:', error);
        }
    };

    const getCustomerName = (maKhachHang) => {
        const customer = customers.find(c => c.maKhachHang === maKhachHang);
        if (!customer) {
            console.warn(`Customer with ID ${maKhachHang} not found`);
            return 'Unknown';
        }
        return customer.tenKhachHang;
    };

    const getServiceName = (maDichVu) => {
        const service = services.find(s => s.id === maDichVu);
        return service ? service.tenDichVu : 'Unknown';
    };

    const getAppointmentDetail = (maLichHen) => {
        const appointment = appointments.find(a => a.id === maLichHen);
        if (!appointment) {
            return {
                diaDiem: 'Unknown',
                tenDichVu: 'Unknown',
                tenKhachHang: 'Unknown'
            };
        }
        const customer = customers.find(c => c.maKhachHang === appointment.maKhachHang);
        const dichVu = services.find(s => s.id === appointment.maDichVu);
        return {
            diaDiem: appointment.diaDiem,
            tenDichVu: dichVu ? dichVu.tenDichVu : 'Unknown',
            tenKhachHang: customer ? customer.tenKhachHang : 'Unknown'
        };
    };

    const handleCreateClick = (appointment) => {
        setSelectedAppointment(appointment);
        setShowCreateModal(true);
    };

    const handleCreate = async () => {
        if (selectedAppointment) {
            try {
                const response = await axios.post('http://localhost:5199/api/KetQuaDichVu/create-ket-qua-dich-vu', {
                    moTa: moTa,
                    maLichHen: selectedAppointment.id
                });
                toast.success('Tạo kết quả dịch vụ thành công');
                fetchResults();
                setShowCreateModal(false);
                window.location.reload();
            } catch (error) {
                console.error('Error creating service result:', error);
toast.error('Tạo kết quả dịch vụ thất bại');
            }
        }
    };

    const handleEdit = async (appointmentId) => {
        try {
            const response = await axios.get(`http://localhost:5199/api/LichHen/get-lich-hen-by-id?id=${appointmentId}`);
            setSelectedAppointment(response.data);
            setDiaDiem(response.data.diaDiem);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching appointment details:', error);
        }
    };

    const handleSave = async () => {
        if (selectedAppointment) {
            try {
                await axios.put(`http://localhost:5199/api/LichHen/update-lich-hen-nhan-vien?id=${selectedAppointment.id}&diaDiem=${diaDiem}`);
                setShowModal(false);
                fetchAppointmentsChuaKham();
                toast.success('Cập nhật lịch hẹn thành công');
                window.location.reload();
            } catch (error) {
                console.error('Error updating appointment:', error);
                toast.error('Cập nhật lịch hẹn thất bại');
            }
        }
    };

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

    const totalPages = Math.ceil(appointmentsChuaKham.length / appointmentsPerPage);
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = appointmentsChuaKham.slice(indexOfFirstAppointment, indexOfLastAppointment);

    return (
        <>
            <Card>
                <Card.Header className="header-custom">
                    <h4>Danh Sách Lịch Hẹn Chưa Khám</h4>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tên Khách Hàng</th>
                                <th>Tên Dịch Vụ</th>
                                <th>Địa Điểm</th>
                                <th>Trạng Thái</th>
                                <th>Thời Gian Dự Kiến</th>
                                <th>Ghi Chú</th>
                                <th>Kết Quả</th>
                                <th>Chỉnh Sửa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAppointments.map((appointment) => (
<tr key={appointment.id}>
                                    <td>{appointment.id}</td>
                                    <td>{getCustomerName(appointment.maKhachHang)}</td>
                                    <td>{getServiceName(appointment.maDichVu)}</td>
                                    <td>{appointment.diaDiem}</td>
                                    <td>{appointment.trangThai}</td>
                                    <td>{new Date(appointment.thoiGianDuKien).toLocaleString()}</td>
                                    <td>{appointment.ghiChu || 'Không có ghi chú'}</td>
                                    <td>
                                        {appointment.diaDiem !== "Link online sẽ được cập nhật khi đến thời gian khám" && (
                                            <FaPlus onClick={() => handleCreateClick(appointment)} style={{ cursor: 'pointer', color: 'green' }} />
                                        )}
                                    </td>
                                    <td>
                                        {appointment.diaDiem === "Link online sẽ được cập nhật khi đến thời gian khám" && (
                                            <FaEdit onClick={() => handleEdit(appointment.id)} style={{ cursor: 'pointer', color: 'blue' }} />
                                        )}
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
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className="header-custom">
                    <h4>Danh Sách Lịch Hẹn Đã Khám</h4>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Id</th>
<th>Tên Khách Hàng</th>
                                <th>Tên Dịch Vụ</th>
                                <th>Địa Điểm</th>
                                <th>Trạng Thái</th>
                                <th>Thời Gian Dự Kiến</th>
                                <th>Ghi Chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentsDaKham.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td>{appointment.id}</td>
                                    <td>{getCustomerName(appointment.maKhachHang)}</td>
                                    <td>{getServiceName(appointment.maDichVu)}</td>
                                    <td>{appointment.diaDiem}</td>
                                    <td>{appointment.trangThai}</td>
                                    <td>{new Date(appointment.thoiGianDuKien).toLocaleString()}</td>
                                    <td>{appointment.ghiChu || 'Không có ghi chú'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className="header-custom">
                    <h4>Kết Quả Dịch Vụ</h4>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Mã Kết Quả</th>
                                <th>Mô Tả</th>
                                <th>Địa Điểm</th>
                                <th>Tên Dịch Vụ</th>
                                <th>Tên Khách Hàng</th>
                                <th>Mã Lịch Hẹn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result) => {
                                const detail = getAppointmentDetail(result.maLichHen);
                                return (
                                    <tr key={result.id}>
                                        <td>{result.id}</td>
                                        <td>{result.moTa}</td>
                                        <td>{detail.diaDiem}</td>
                                        <td>{detail.tenDichVu}</td>
                                        <td>{detail.tenKhachHang}</td>
                                        <td>{result.maLichHen}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
<Modal.Title>Chỉnh Sửa Địa Điểm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>ID Lịch Hẹn</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedAppointment ? selectedAppointment.id : ''}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Địa Điểm</Form.Label>
                            <Form.Control
                                type="text"
                                value={diaDiem}
                                onChange={(e) => setDiaDiem(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSave}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo Kết Quả Dịch Vụ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Mô Tả</Form.Label>
                            <Form.Control
                                type="text"
                                value={moTa}
                                onChange={(e) => setMoTa(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCreate}>
                        Tạo
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Lichhen;