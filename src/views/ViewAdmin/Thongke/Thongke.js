import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, Form, Row, Col, Button, Card, Container } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'chartjs-plugin-datalabels';
import './Thongke.css';

function Thongke() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [lichHen, setLichHen] = useState([]);
    const [dichVu, setDichVu] = useState([]);
    const [bacSi, setBacSi] = useState([]);
    const [khachHang, setKhachHang] = useState([]);
    const [danhGia, setDanhGia] = useState([]);
    const [ketQuaDichVu, setKetQuaDichVu] = useState([]);
    const [loaiDichVu, setLoaiDichVu] = useState([]);
    const [selectedLoaiDichVu, setSelectedLoaiDichVu] = useState("");
    const [selectedBacSi, setSelectedBacSi] = useState("");
    const [selectedDichVu, setSelectedDichVu] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [doctorFilteredData, setDoctorFilteredData] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [doctorTotalAmount, setDoctorTotalAmount] = useState(0);
    const [reviewChartData, setReviewChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [selectedForm, setSelectedForm] = useState(""); // Thêm trạng thái để quản lý form được chọn

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            let lichHenRes = await axios.get('http://localhost:5199/api/LichHen/get-all-lich-hen');
            let dichVuRes = await axios.get('http://localhost:5199/api/DichVu/get-all-dich-vu');
            let bacSiRes = await axios.get('http://localhost:5199/api/BacSi/get-all-bac-si');
            let khachHangRes = await axios.get('http://localhost:5199/api/KhachHang/get-all-khach-hang');
            let danhGiaRes = await axios.get('http://localhost:5199/api/DanhGia/get-all-danh-gia-da-duyet');
            let ketQuaDichVuRes = await axios.get('http://localhost:5199/api/KetQuaDichVu/get-all-ket-qua-dich-vu');
            let loaiDichVuRes = await axios.get('http://localhost:5199/api/LoaiDichVu/get-all-loai-dich-vu');

            if (lichHenRes.data && dichVuRes.data && bacSiRes.data && khachHangRes.data && danhGiaRes.data && ketQuaDichVuRes.data && loaiDichVuRes.data) {
                setLichHen(lichHenRes.data);
                setDichVu(dichVuRes.data);
                setBacSi(bacSiRes.data);
                setKhachHang(khachHangRes.data);
                setDanhGia(danhGiaRes.data);
                setKetQuaDichVu(ketQuaDichVuRes.data);
                setLoaiDichVu(loaiDichVuRes.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleFilter = () => {
        const filtered = lichHen.filter(item => {
            const appointmentDate = new Date(item.thoiGianDuKien);
            const service = dichVu.find(dv => dv.id === item.maDichVu);
            const serviceType = service ? loaiDichVu.find(ldv => ldv.id === service.maLoaiDichVu) : null;
            return appointmentDate >= startDate && appointmentDate <= endDate &&
                (!selectedLoaiDichVu || (serviceType && serviceType.tenLoai === selectedLoaiDichVu));
        });

        const total = filtered.reduce((acc, item) => {
            const service = dichVu.find(dv => dv.id === item.maDichVu);
            return acc + (service ? service.gia : 0);
        }, 0);

        setFilteredData(filtered);
        setTotalAmount(total);
    };

    const handleDoctorStatistics = () => {
        const filtered = lichHen.filter(item => {
            const appointmentDate = new Date(item.thoiGianDuKien);
            return appointmentDate >= startDate && appointmentDate <= endDate && item.maBacSi === parseInt(selectedBacSi);
        });

        const total = filtered.reduce((acc, item) => {
            const service = dichVu.find(dv => dv.id === item.maDichVu);
            return acc + (service ? service.gia : 0);
        }, 0);

        setDoctorFilteredData(filtered);
        setDoctorTotalAmount(total);
    };

    const handleReviewStatistics = () => {
        const filteredReviews = danhGia.filter(dg => {
            const ketQua = ketQuaDichVu.find(kq => kq.id === dg.maKetQuaDichVu);
            const lichHenItem = ketQua ? lichHen.find(lh => lh.id === ketQua.maLichHen) : null;
            return lichHenItem && lichHenItem.maDichVu === parseInt(selectedDichVu);
        });

        const reviews = filteredReviews.map(dg => {
            const ketQua = ketQuaDichVu.find(kq => kq.id === dg.maKetQuaDichVu);
            const lichHenItem = ketQua ? lichHen.find(lh => lh.id === ketQua.maLichHen) : null;
            const khachHangItem = lichHenItem ? khachHang.find(kh => kh.maKhachHang === lichHenItem.maKhachHang) : null;
            const dichVuItem = lichHenItem ? dichVu.find(dv => dv.id === lichHenItem.maDichVu) : null;
            return {
                soSaoDanhGia: dg.soSaoDanhGia,
                tenDichVu: dichVuItem ? dichVuItem.tenDichVu : 'N/A',
                tenKhachHang: khachHangItem ? khachHangItem.tenKhachHang : 'N/A',
            };
        });

        const chartData = {
            labels: reviews.map((item) => `${item.tenDichVu} - ${item.tenKhachHang}`),
            datasets: [
                {
                    label: 'Số Sao Đánh Giá',
                    data: reviews.map(item => item.soSaoDanhGia),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
            ],
        };

        setReviewData(reviews);
        setReviewChartData(chartData);
    };

    const handleReload = () => {
        setSelectedForm("");
        setStartDate(new Date());
        setEndDate(new Date());
        setSelectedLoaiDichVu("");
        setSelectedBacSi("");
        setSelectedDichVu("");
        setFilteredData([]);
        setDoctorFilteredData([]);
        setReviewData([]);
        setTotalAmount(0);
        setDoctorTotalAmount(0);
        setReviewChartData({ labels: [], datasets: [] });
    };

    const chartData = {
        labels: filteredData.map(item => new Date(item.thoiGianDuKien).toLocaleDateString()), // Chuyển đổi thành ngày tháng
        datasets: [{
            label: 'Tổng Tiền',
            data: filteredData.map(item => {
                const service = dichVu.find(dv => dv.id === item.maDichVu);
                return service ? service.gia : 0;
            }),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            datalabels: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const item = filteredData[context.dataIndex];
                        const service = dichVu.find(dv => dv.id === item.maDichVu);
                        const serviceName = service ? service.tenDichVu : 'N/A';
                        return [
                            `Tổng Tiền: ${context.raw.toLocaleString()} VND`,
                            `Dịch Vụ: ${serviceName}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                display: false // Ẩn trục x
            }
        }
    };

    const doctorChartData = {
        labels: doctorFilteredData.map(item => new Date(item.thoiGianDuKien).toLocaleDateString()), // Chuyển đổi thành ngày tháng
        datasets: [{
            label: 'Tổng Tiền',
            data: doctorFilteredData.map(item => {
                const service = dichVu.find(dv => dv.id === item.maDichVu);
                return service ? service.gia : 0;
            }),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }]
    };

    const doctorChartOptions = {
        responsive: true,
        plugins: {
            datalabels: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const item = doctorFilteredData[context.dataIndex];
                        const service = dichVu.find(dv => dv.id === item.maDichVu);
                        const serviceName = service ? service.tenDichVu : 'N/A';
                        return [
                            `Tổng Tiền: ${context.raw.toLocaleString()} VND`,
                            `Dịch Vụ: ${serviceName}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                display: false // Ẩn trục x
            }
        }
    };

    const reviewChartOptions = {
        responsive: true,
        plugins: {
            datalabels: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const item = reviewData[context.dataIndex];
                        return [
                            `Số Sao Đánh Giá: ${item.soSaoDanhGia}`,
                            `Dịch Vụ: ${item.tenDichVu}`,
                            `Khách Hàng: ${item.tenKhachHang}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                display: false // Ẩn trục x
            }
        }
    };

    return (
        <Container>
            <Card style={{marginTop:100}} className="mb-4 shadow-sm">
                <Card.Body>
                    <h4 style={{ fontWeight: 'bold', fontSize: 40 }} className="mb-4">Thống Kê</h4>
                    <Form.Group controlId="formSelection">
                        <Form.Label>Chọn Loại Thống Kê</Form.Label>
                        <Form.Control as="select" value={selectedForm} onChange={e => setSelectedForm(e.target.value)}>
                            <option value="">Chọn</option>
                            <option value="dichVu">Thống Kê Dịch Vụ</option>
                            <option value="bacSi">Thống Kê Bác Sĩ</option>
                            <option value="danhGia">Thống Kê Đánh Giá</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="secondary" onClick={handleReload} className="mt-3">Reload</Button>
                </Card.Body>
            </Card>

            {selectedForm === "dichVu" && (
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <h4 style={{ fontWeight: 'bold', fontSize: 40 }} className="mb-4">Thống Kê Dịch Vụ</h4>
                        <Form>
                            <Row>
                                <Col md={3}>
                                    <Form.Group controlId="startDate">
                                        <Form.Label>Ngày Bắt Đầu</Form.Label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            className="form-control"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="endDate">
                                        <Form.Label>Ngày Kết Thúc</Form.Label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            className="form-control"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="loaiDichVu">
                                        <Form.Label>Loại Dịch Vụ</Form.Label>
                                        <Form.Control as="select" value={selectedLoaiDichVu} onChange={e => setSelectedLoaiDichVu(e.target.value)}>
                                            <option value="">Tất cả</option>
                                            {loaiDichVu.map(ldv => (
                                                <option key={ldv.id} value={ldv.tenLoai}>{ldv.tenLoai}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="d-flex align-items-end">
                                    <Button style={{ height: 45, marginTop: 20 }} variant="primary" onClick={handleFilter}>Thống Kê</Button>
                                </Col>
                            </Row>
                        </Form>
                        <div className="mt-4">
                            <h5 style={{ color: 'red' }}>Tổng tiền: {totalAmount.toLocaleString()} VND</h5>
                        </div>
                        <Bar data={chartData} options={chartOptions} />
                    </Card.Body>
                </Card>
            )}

            {selectedForm === "bacSi" && (
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <h4 style={{ fontWeight: 'bold', fontSize: 40 }} className="mb-4">Thống Kê Bác Sĩ</h4>
                        <Form>
                            <Row>
                                <Col md={3}>
                                    <Form.Group controlId="startDateDoctor">
                                        <Form.Label>Ngày Bắt Đầu</Form.Label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            className="form-control"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="endDateDoctor">
                                        <Form.Label>Ngày Kết Thúc</Form.Label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            className="form-control"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="bacSi">
                                        <Form.Label>Bác Sĩ</Form.Label>
                                        <Form.Control as="select" value={selectedBacSi} onChange={e => setSelectedBacSi(e.target.value)}>
                                            <option value="">Chọn bác sĩ</option>
                                            {bacSi.map(bs => (
                                                <option key={bs.id} value={bs.id}>{bs.tenBacSi}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="d-flex align-items-end">
                                    <Button style={{ height: 45, marginTop: 20 }} variant="primary" onClick={handleDoctorStatistics}>Thống Kê</Button>
                                </Col>
                            </Row>
                        </Form>
                        <div className="mt-4">
                            <h5 style={{ color: 'red' }}>Tổng tiền: {doctorTotalAmount.toLocaleString()} VND</h5>
                        </div>
                        <Bar data={doctorChartData} options={doctorChartOptions} />
                    </Card.Body>
                </Card>
            )}

            {selectedForm === "danhGia" && (
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <h4 style={{ fontWeight: 'bold', fontSize: 40 }} className="mb-4">Thống Kê Đánh Giá Của Khách Hàng Dịch Vụ</h4>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="dichVu">
                                        <Form.Label>Tên Dịch Vụ</Form.Label>
                                        <Form.Control as="select" value={selectedDichVu} onChange={e => setSelectedDichVu(e.target.value)}>
                                            <option value="">Chọn dịch vụ</option>
                                            {dichVu.map(dv => (
                                                <option key={dv.id} value={dv.id}>{dv.tenDichVu}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="d-flex align-items-end">
                                    <Button style={{ height: 45, marginTop: 20 }} variant="primary" onClick={handleReviewStatistics}>Thống Kê</Button>
                                </Col>
                            </Row>
                        </Form>
                        <Bar data={reviewChartData} options={reviewChartOptions} />
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default Thongke;
