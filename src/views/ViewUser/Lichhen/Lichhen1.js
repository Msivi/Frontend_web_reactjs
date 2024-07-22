import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import { editThongTinKhachHang, changePassword } from "assets/serviceAPI/userService";
import { Card, Table, Button, Image } from "react-bootstrap";

import Modal from 'react-bootstrap/Modal';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Lichhen() {
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        // Fetch appointments
        axios.get('http://localhost:5199/api/LichHen/get-all-lich-hen-khach-hang')
            .then(response => {
                const fetchedAppointments = response.data;
                const filteredAppointments = [];

                // Process each appointment to check its payment status
                const checkPayments = fetchedAppointments.map(appointment => {
                    return axios.get(`http://localhost:5199/api/ThanhToanDV/get-thanh-toan-by-id-lich-hen?maLichHen=${appointment.id}`)
                        .then(paymentResponse => {
                            const paymentData = paymentResponse.data;
                            if (paymentData.trangThai === "True") {
                                filteredAppointments.push(appointment);
                            } else {
                                // Delete the appointment if the payment status is not "True"
                                // return axios.delete(`http://localhost:5199/api/LichHen/delete-lich-hen?keyId=${appointment.id}`);
                            }
                        })
                        .catch(error => {
                            console.error(`Error checking payment status for appointment ${appointment.id}`, error);
                        });
                });

                // After all payment checks are done, update the appointments state
                Promise.all(checkPayments).then(() => {
                    setAppointments(filteredAppointments);
                });
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
                toast.success("Hủy Thành Côngg!");
                setAppointments(appointments.map(app => 
                    app.id === id ? { ...app, trangThai: "Đã hủy" } : app
                ));
            })
            .catch(error => {
                toast.error("Hủy Thất Bại");
                console.error("There was an error cancelling the appointment!", error);
            });
    };

    return (
        <div className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="card card-user">
                        <div className="card-header">
                            <h5 className="card-title" style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>Lịch Hẹn</h5>
                        </div>
                        <div className="card-body">
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
                                        <th>Chỉnh Sửa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment, index) => (
                                        <tr key={index}>
                                            <td>{appointment.id}</td>
                                            <td>{appointment.diaDiem}</td>
                                            <td>{appointment.trangThai}</td>
                                            <td>{appointment.thoiGianDuKien}</td>
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
                                                    style={{ cursor: 'pointer', color:'red' }}
                                                    onClick={() => updateCancelAppointment(appointment.id)}
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
        </div>
  );
}

export default Lichhen;
