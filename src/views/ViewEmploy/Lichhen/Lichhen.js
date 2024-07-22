import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Table, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './thongtin.css';

const Lichhen = () => {
  const [searchKey, setSearchKey] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [chuyenKhoa, setChuyenKhoa] = useState([]);
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllDoctors();
    fetchAllChuyenKhoa();
  }, []);

  const fetchAllDoctors = () => {
    axios.get('http://localhost:5199/api/BacSi/get-all-bac-si')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        toast.error('Lỗi khi lấy danh sách bác sĩ: ' + error.message);
      });
  };

  const fetchAllChuyenKhoa = () => {
    axios.get('http://localhost:5199/api/ChuyenKhoa/get-all-chuyen-khoa')
      .then(response => {
        setChuyenKhoa(response.data);
      })
      .catch(error => {
        toast.error('Lỗi khi lấy danh sách chuyên khoa: ' + error.message);
      });
  };

  const searchDoctors = async () => {
    try {
      const response = await axios.get(`http://localhost:5199/api/BacSi/search-bac-si?searchKey=${searchKey}`);
      setDoctors(response.data);
    } catch (error) {
      toast.error('Lỗi khi tìm kiếm bác sĩ: ' + error.message);
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    fetchDoctorSchedule(doctor.id);
  };

  const fetchDoctorSchedule = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:5199/api/LichLamViec/get-lich-lam-viec-by-id-bac-si?maBacSi=${doctorId}`);
      setDoctorSchedules(response.data);
    } catch (error) {
      toast.error('Lỗi khi lấy lịch làm việc của bác sĩ: ' + error.message);
    }
  };

  const assignSchedule = async () => {
    if (!selectedDoctor || !scheduleDate) {
      toast.error('Vui lòng chọn bác sĩ và ngày làm việc');
      return;
    }

    const existingSchedule = doctorSchedules.find(schedule => new Date(schedule.ngay).toDateString() === new Date(scheduleDate).toDateString());
    if (existingSchedule) {
      toast.error('Ngày này đã được phân lịch');
      return;
    }

    const scheduleData = {
      ngay: new Date(scheduleDate).toISOString(),
      gioBatDau: `${scheduleDate}T08:00:00.000Z`,
gioKetThuc: `${scheduleDate}T17:30:00.000Z`,
      maBacSi: selectedDoctor.id
    };

    try {
      await axios.post('http://localhost:5199/api/LichLamViec/create-lich-lam-viec', scheduleData);
      toast.success('Lịch làm việc đã được phân công');
      fetchDoctorSchedule(selectedDoctor.id);
    } catch (error) {
      toast.error('Lỗi khi phân công lịch làm việc: ' + error.message);
    }
  };

  const deleteSchedule = async (scheduleId) => {
    try {
      await axios.delete(`http://localhost:5199/api/LichLamViec/delete-lich-lam-viec?keyId=${scheduleId}`);
      toast.success('Lịch làm việc đã được xóa');
      fetchDoctorSchedule(selectedDoctor.id);
    } catch (error) {
      toast.error('Lỗi khi xóa lịch làm việc: ' + error.message);
    }
  };

  const isDateDisabled = (date) => {
    if (date.getDay() === 0 || date.getDay() === 6) {
      return true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return true;
    }

    const assignedDates = doctorSchedules.map(schedule => new Date(schedule.ngay).toDateString());
    if (assignedDates.includes(date.toDateString())) {
      return true;
    }

    return false;
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (isDateDisabled(selectedDate)) {
      toast.error('Ngày này không khả dụng để phân lịch');
      setScheduleDate('');
    } else {
      setScheduleDate(e.target.value);
    }
  };

  const handleWeekChange = (offset) => {
    setWeekOffset(weekOffset + offset);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = (`0${d.getDate()}`).slice(-2);
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderScheduleGrid = () => {
    const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1 + weekOffset * 7));
    const currentWeek = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      currentWeek.push(day);
    }

    return (
      <div className="schedule-grid">
        <div className="header-row">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="header-cell">
              {day} <br /> {formatDate(currentWeek[index])}
            </div>
          ))}
        </div>
        <div className="content-row">
          {daysOfWeek.map((_, index) => (
            <div key={index} className="content-cell">
              {doctorSchedules
                .filter(schedule => new Date(schedule.ngay).toDateString() === currentWeek[index].toDateString())
                .map(schedule => (
<div key={schedule.id} className="schedule-item">
                    <p>{`Ngày: ${formatDate(schedule.ngay)}`}</p>
                    <p>{`Giờ làm việc: 08:00 - 17:30`}</p>
                    {new Date(schedule.ngay) > new Date() && (
                      <FontAwesomeIcon icon={faTrashAlt} onClick={() => deleteSchedule(schedule.id)} style={{ color: "red", marginLeft: "30px" }} />
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const filteredDoctors = doctors.filter(doctor => {
    return (
      (!filterSpecialty || doctor.chuyenKhoa.includes(filterSpecialty)) &&
      (!searchKey || doctor.tenBacSi.toLowerCase().includes(searchKey.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const displayedDoctors = filteredDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <ToastContainer />
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 style={{ fontWeight: 'bold', fontSize: 40 }} className="mb-4">Tìm kiếm và Lọc Bác Sĩ</h4>
          <Form>
            <Row>
              <Col sm="5">
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo tên"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
              </Col>
              <Col sm="5">
                <Form.Control
                  as="select"
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                >
                  <option value="">Lọc theo chuyên khoa</option>
                  {chuyenKhoa.map(chuyen => (
                    <option key={chuyen.id} value={chuyen.tenChuyenKhoa}>{chuyen.tenChuyenKhoa}</option>
                  ))}
                </Form.Control>
              </Col>
              <Col sm="2">
                <Button style={{ marginTop: -2 }} variant="secondary" onClick={() => { setSearchKey(''); setFilterSpecialty(''); setCurrentPage(1); }}>Load</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {doctors.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Bác Sĩ</th>
                  <th>Bằng Cấp</th>
                  <th>Chuyên Khoa</th>
                  <th>Hình Ảnh</th>
                  <th>Chọn</th>
                </tr>
              </thead>
              <tbody>
                {displayedDoctors.map(doctor => (
<tr key={doctor.id} onClick={() => handleSelectDoctor(doctor)} className="doctor-item">
                    <td>{doctor.id}</td>
                    <td>{doctor.tenBacSi}</td>
                    <td>{doctor.bangCap}</td>
                    <td>{doctor.chuyenKhoa}</td>
                    <td>{doctor.hinhAnh ? <img src={`http://localhost:5199${doctor.hinhAnh}`} alt={doctor.tenBacSi} style={{ width: '100px' }} /> : ''}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleSelectDoctor(doctor)}>
                        Chọn
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="pagination">
              {[...Array(totalPages).keys()].map(number => (
                <Button
                  key={number + 1}
                  variant={number + 1 === currentPage ? 'primary' : 'light'}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </Button>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {selectedDoctor && (
        <Card className="mb-3">
          <Card.Header>Phân lịch làm cho bác sĩ: {selectedDoctor.tenBacSi}</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Chọn ngày làm việc</Form.Label>
                <Form.Control
                  type="date"
                  value={scheduleDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </Form.Group>
              <Button onClick={assignSchedule}>Phân lịch</Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {doctorSchedules.length > 0 && selectedDoctor && (
        <Card className="mb-3">
          <Card.Header>
            Lịch làm việc của bác sĩ: {selectedDoctor.tenBacSi}
            <div className="float-right">
              <Button variant="secondary" onClick={() => handleWeekChange(-1)}>Tuần trước</Button>
              <Button variant="secondary" className="ml-2" onClick={() => handleWeekChange(1)}>Tuần tiếp theo</Button>
            </div>
          </Card.Header>
          <Card.Body>
            {renderScheduleGrid()}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Lichhen;