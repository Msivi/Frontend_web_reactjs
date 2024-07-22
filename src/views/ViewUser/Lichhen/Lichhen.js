import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import Button from 'react-bootstrap/Button';

import { Card, Table, Image } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import './lichen.css'; // Import custom CSS file for additional styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import styled from 'styled-components';
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
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [payments, setPayments] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        // Fetch appointments
        axios.get('http://localhost:5199/api/LichHen/get-all-lich-hen-khach-hang')
            .then(response => {
                const sortedData = response.data.sort((a, b) => b.id - a.id);
                setAppointments(sortedData);
                sortedData.forEach(app => fetchPaymentStatus(app.id));
            })
            .catch(error => {
                toast.error("Failed to fetch appointments");
                console.error("There was an error fetching the appointments!", error);
            });

        // Fetch services
        axios.get('http://localhost:5199/api/DichVu/get-all-dich-vu')
            .then(response => {
                setServices(response.data);
            })
            .catch(error => {
                toast.error("Failed to fetch services");
                console.error("There was an error fetching the services!", error);
            });

        // Fetch doctors
        axios.get('http://localhost:5199/api/BacSi/get-all-bac-si')
            .then(response => {
                setDoctors(response.data);
            })
            .catch(error => {
                toast.error("Failed to fetch doctors");
                console.error("There was an error fetching the doctors!", error);
            });
    }, []);

    const getServiceName = (id) => {
        const service = services.find(s => s.id === id);
        return service ? service.tenDichVu : '';
    };

    const getDoctorName = (id) => {
        const doctor = doctors.find(d => d.id === id);
        return doctor ? doctor.tenBacSi : '';
    };

    const getDoctorImage = (id) => {
        const doctor = doctors.find(d => d.id === id);
        if (!doctor) return '';
        return doctor.hinhAnh.startsWith('/')
            ? `http://localhost:5199${doctor.hinhAnh}`
            : doctor.hinhAnh;
    };

    const updateCancelAppointment = (id) => {
        axios.put(`http://localhost:5199/api/LichHen/update-huy-lich-hen?id=${id}`)
            .then(response => {
                toast.success("Hủy Thành Công!");
                setAppointments(appointments.map(app => 
                    app.id === id ? { ...app, trangThai: "Đã hủy" } : app
                ));
            })
            .catch(error => {
                toast.error("Hủy Thất Bại");
                console.error("There was an error cancelling the appointment!", error);
            });
    };

    const fetchPaymentStatus = (id) => {
        axios.get(`http://localhost:5199/api/ThanhToanDV/get-thanh-toan-by-id-lich-hen?maLichHen=${id}`)
            .then(response => {
                setPayments(prevPayments => ({
                    ...prevPayments,
                    [id]: response.data
                }));
            })
            .catch(error => {
                console.error("There was an error fetching the payment status!", error);
                setPayments(prevPayments => ({
                    ...prevPayments,
                    [id]: { trangThai: false, tongTien: 0 }
                }));
            });
    };

    const displayFormattedTime = (time) => {
        return format(new Date(time), 'dd/MM/yyyy hh:mm a');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedAppointments = appointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(appointments.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / 3) * 3;
        return new Array(Math.min(3, Math.ceil(appointments.length / itemsPerPage) - start)).fill().map((_, idx) => start + idx + 1);
    };

    return (
        <>
        <div style={{marginTop:-10}} className="content">
            <div className="row">
                <div className="col-md-12">
                <Card style={{marginTop:100 }} className="custom-card">
                <Card.Header className="custom-card-header">Lịch Hẹn</Card.Header>
                <Card.Body style={{marginTop:-50}} className="custom-card-body">
                <h1 style={{fontWeight:'bold',color:'red',fontFamily:'arial',textAlign:'center'}}> Lịch Khám Khách Hàng</h1>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>ĐỊA ĐIỂM</th>
                                <th>TRẠNG THÁI</th>
                                <th>THỜI GIAN DỰ KIẾN</th>
                                <th>DỊCH VỤ</th>
                                <th>Ghi Chú</th>
                                <th>BÁC SĨ</th>
                                <th>HÌNH ẢNH BÁC SĨ</th>
                                <th>Hủy Lịch Hẹn</th>
                                <th>TRẠNG THÁI THANH TOÁN</th>
                                <th>TỔNG TIỀN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedAppointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.id}</td>
                                    <td>{appointment.diaDiem}</td>
                                    <td>{appointment.trangThai}</td>
                                    <td>{displayFormattedTime(appointment.thoiGianDuKien)}</td>
                                    <td>{getServiceName(appointment.maDichVu)}</td>
                                    <td>{appointment.ghiChu}</td>
                                    <td>{getDoctorName(appointment.maBacSi)}</td>
                                    <td>
                                        <img
                                            style={{ width: "50px" }}
                                            src={getDoctorImage(appointment.maBacSi)}
                                            alt="Doctor"
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            style={{ cursor: 'pointer', color: appointment.trangThai === "Đã khám" ? 'green' : 'red' }}
                                            onClick={() => updateCancelAppointment(appointment.id)}
                                        />
                                    </td>
                                    <td>{payments[appointment.id]?.trangThai === "True" ? "Thành công" : "Thất bại"}</td>
                                    <td>{payments[appointment.id]?.tongTien}</td>
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
                                onClick={() => handlePageChange(item)}
                                variant={item === currentPage ? 'primary' : 'secondary'}
                                className={item === currentPage ? 'm-1 active' : 'm-1'}
                            >
                                {item}
                            </Button>
                        ))}
                        <button className="icon-btn" onClick={handleNextPage} disabled={currentPage === Math.ceil(appointments.length / itemsPerPage)}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </Pagination>
                </Card.Body>
            </Card>
                </div>
            </div>
        </div>
         
        </>
    );
}

export default Lichhen;
