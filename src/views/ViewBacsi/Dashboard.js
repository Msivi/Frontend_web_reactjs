import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './dashboard.css';

const Dashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    // Fetch logged-in doctor information
    fetchLoggedInDoctor();
  }, []);

  useEffect(() => {
    if (doctor) {
      fetchDoctorSchedule(doctor.id);
    }
  }, [doctor]);

  const fetchLoggedInDoctor = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/BacSi/get-all-tt-bac-si-by-id');
      setDoctor(response.data);
    } catch (error) {
      toast.error('Lỗi khi lấy thông tin bác sĩ: ' + error.message);
    }
  };

  const fetchDoctorSchedule = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:5199/api/LichLamViec/get-lich-lam-viec-by-id-bac-si?maBacSi=${doctorId}`);
      setDoctorSchedules(response.data);
    } catch (error) {
      toast.error('Lỗi khi lấy lịch làm việc của bác sĩ: ' + error.message);
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
                  </div>
                ))}
                </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Container style={{marginTop:50}}>
      <ToastContainer />
      {doctor && (
        <Card className="mb-3">
          <Card.Header>
          <h1> Lịch làm việc   </h1>   
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

export default Dashboard;