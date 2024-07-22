import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, Card, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import './Lichhen.css';

function Lichhen() {
    const [appointments, setAppointments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [serviceResults, setServiceResults] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("Tất cả");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 5;

    useEffect(() => {
        fetchAppointments();
        fetchCustomers();
        fetchServices();
        fetchServiceResults();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:5199/api/LichHen/get-all-lich-hen');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
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

    const fetchServiceResults = async () => {
        try {
            const response = await axios.get('http://localhost:5199/api/KetQuaDichVu/get-all-ket-qua-dich-vu');
            setServiceResults(response.data);
        } catch (error) {
            console.error('Error fetching service results:', error);
        }
    };

    const getCustomerName = (maKhachHang) => {
        const customer = customers.find(c => c.maKhachHang === maKhachHang);
        return customer ? customer.tenKhachHang : 'Unknown';
    };

    const getServiceName = (maDichVu) => {
        const service = services.find(s => s.id === maDichVu);
        return service ? service.tenDichVu : 'Unknown';
    };

    const getCustomerNameFromServiceResult = (maLichHen) => {
        const appointment = appointments.find(a => a.id === maLichHen);
        if (appointment) {
            return getCustomerName(appointment.maKhachHang);
        }
        return 'Unknown';
    };

    const handleDeleteAppointment = async (id) => {
        try {
            await axios.delete(`http://localhost:5199/api/LichHen/delete-lich-hen?keyId=${id}`);
            alert('Xóa lịch hẹn thành công');
            fetchAppointments(); // Refresh the appointments list
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Xóa lịch hẹn thất bại');
        }
    };

    const handleRowClick = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (statusFilter !== "Tất cả" && appointment.trangThai !== statusFilter) {
            return false;
        }
        const customerName = getCustomerName(appointment.maKhachHang).toLowerCase();
        return customerName.includes(searchTerm.toLowerCase());
    });

    // Calculate the number of pages
    const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

    // Get the appointments for the current page
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

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
        <Card>
            <Card.Header className="header-custom">
                <h4>Danh Sách Lịch Hẹn Của Khách Hàng</h4>
            </Card.Header>
            <Row>
                <Col md={6}>
                    <Form.Group controlId="statusFilter">
                        <Form.Label>Lọc theo trạng thái</Form.Label>
                        <Form.Control style={{borderRadius:50}} as="select" value={statusFilter} onChange={handleStatusFilterChange}>
                            <option value="Tất cả">Tất cả</option>
                            <option value="Chưa khám">Chưa khám</option>
                            <option value="Đã khám">Đã khám</option>
                            <option value="Đã hủy">Đã hủy</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="searchTerm">
                        <Form.Label>Tìm kiếm theo tên khách hàng</Form.Label>
                        <Form.Control style={{borderRadius:50}} type="text" placeholder="Nhập tên khách hàng" value={searchTerm} onChange={handleSearchTermChange} />
                    </Form.Group>
                </Col>
            </Row>
            <Card.Body> 
                <Row>
                    <Col md={12}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th style={{ width: '15%' }}>Tên Khách Hàng</th>
                                    <th style={{ width: '20%' }}>Tên Dịch Vụ</th>
                                    <th style={{ width: '30%' }}>Địa Điểm</th>
                                    <th>Trạng Thái</th>
                                    <th>Thời Gian Dự Kiến</th>
                                    <th>Chỉnh Sửa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAppointments.map((appointment) => (
                                    <tr key={appointment.id} onClick={() => handleRowClick(appointment.id)}>
                                        <td>{appointment.id}</td>
                                        <td>{getCustomerName(appointment.maKhachHang)}</td>
                                        <td>{getServiceName(appointment.maDichVu)}</td>
                                        <td>{appointment.diaDiem}</td>
                                        <td style={{
                                            color: appointment.trangThai === 'Chưa khám' ? 'red' :
                                                appointment.trangThai === 'Đã hủy' ? 'green' :
                                                    appointment.trangThai === 'Đã khám' ? 'blue' : 'black'
                                        }}>
                                            {appointment.trangThai}
                                        </td>
                                        <td>{new Date(appointment.thoiGianDuKien).toLocaleString()}</td>
                                        <td>
                                            <FontAwesomeIcon style={{ color: 'red' }} onClick={() => handleDeleteAppointment(appointment.id)} icon={faTrashAlt} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="pagination">
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
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default Lichhen;
