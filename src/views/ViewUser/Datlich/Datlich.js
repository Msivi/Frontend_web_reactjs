import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  CardImg,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
 Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import banneryTe from "assets/img/yte1.jpg";
import { toast, ToastContainer } from "react-toastify";
import "./datlichstyle.css";

function Datlich() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [previousAddresses, setPreviousAddresses] = useState([]);

  const [appointmentData, setAppointmentData] = useState({
    diaDiem: '',
    thoiGianDuKien: '',
    maBacSi: 0,
    maDichVu: 0,
    ghiChu: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBacSi, setSelectedBacSi] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId } = useParams();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    province: '',
    district: '',
    ward: '',
    specificAddress: ''
  });

  useEffect(() => {
    const fetchServiceAndDoctors = async () => {
      try {
        const today = new Date();
        const inAWeek = new Date(today);
        inAWeek.setDate(today.getDate() + 7);
    
        const serviceResponse = await axios.get(`http://localhost:5199/api/DichVu/get-dich-vu-by-id?id=${serviceId}`);
        setAppointmentData(prevData => ({ ...prevData, maDichVu: serviceResponse.data.id }));
        const doctorsResponse = await axios.get('http://localhost:5199/api/BacSi/get-all-bac-si');
        const doctorSpecialtyResponse = await axios.get('http://localhost:5199/api/CTBacSi/get-all-ct-bac-si');
        const schedulesResponse = await axios.get('http://localhost:5199/api/LichLamViec/get-all-lich-lam-viec');
        const addressesResponse = await axios.get('http://localhost:5199/api/DiaChi/get-all-dia-chi');
        const ratingResponse = await axios.get(`http://localhost:5199/api/DanhGia/get-sao-danh-gia?maDichVu=${serviceId}`);
        const reviewsResponse = await axios.get(`http://localhost:5199/api/DanhGia/get-all-danh-gia-by-ma-dich-vu?maDichVu=${serviceId}`);
    
        const filtered = doctorSpecialtyResponse.data.filter(item => item.maChuyenKhoa === serviceResponse.data.maChuyenKhoa);
        const filteredDoctorIds = filtered.map(item => item.maBacSi);
    
        const availableDoctors = filteredDoctorIds.filter(doctorId => {
          const doctorSchedules = schedulesResponse.data.filter(schedule => schedule.maBacSi === doctorId);
          return doctorSchedules.some(schedule => {
            const scheduleDate = new Date(schedule.ngay);
            return scheduleDate >= today && scheduleDate <= inAWeek;
          });
        }).map(doctorId => {
          return doctorsResponse.data.find(doctor => doctor.id === doctorId);
        });
    
        const usersData = await Promise.all(reviewsResponse.data.map(async (review) => {
          const userResponse = await axios.get(`http://localhost:5199/api/KhachHang/get-khach-hang-by-id?id=${review.createBy}`);
          return {
            ...review,
            tenKhachHang: userResponse.data.tenKhachHang,
            avatar: userResponse.data.avatar,
          };
        }));
    
        setService(serviceResponse.data);
        setDoctors(doctorsResponse.data);
        setFilteredDoctors(availableDoctors);
        setPreviousAddresses(addressesResponse.data); // Load addresses here
        setRating(ratingResponse.data.length > 0 ? ratingResponse.data[0].soSaoTBDanhGia : null);
        setReviews(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchServiceAndDoctors();
  }, [serviceId]);


  useEffect(() => {
    axios.get('https://api.npoint.io/ac646cb54b295b9555be')
      .then(response => {
        const hcmCity = response.data.filter(province => province.Name === "TP HCM");
        setProvinces(hcmCity);
      })
      .catch(error => {
        console.error("Error fetching provinces:", error);
      });
  }, []);

  useEffect(() => {
    const handleBackButtonClick = (event) => {
      event.preventDefault();
      navigate('/Khachhang/datlich');
    };

    const backButton = document.querySelector('.ubtn-text');
    if (backButton) {
      backButton.addEventListener('click', handleBackButtonClick);
    }

    return () => {
      if (backButton) {
        backButton.removeEventListener('click', handleBackButtonClick);
      }
    };
  }, [navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get('error');
    if (error) {
      toast.error(Error`: ${error}`);
    }
  }, [location]);

  // New useEffect to handle navigation to dashboard and show toast
  useEffect(() => {
if (location.pathname === '/admin/dashboard') {
      toast.error('Thanh toán thất bại');
    }
  }, [location]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const selectedProvinceName = e.target.options[e.target.selectedIndex].text;
    setSelectedProvince(selectedProvinceName);
    setNewAddress(prev => ({ ...prev, province: selectedProvinceName }));

    axios.get('https://api.npoint.io/34608ea16bebc5cffd42')
      .then(response => {
        const filteredDistricts = response.data.filter(district => district.ProvinceId === parseInt(provinceCode));
        setDistricts(filteredDistricts);
        setWards([]);
        setSelectedDistrict('');
        setSelectedWard('');
        updateDiaDiem(selectedProvinceName, '', '');
      })
      .catch(error => {
        console.error("Error fetching districts:", error);
      });
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const selectedDistrictName = e.target.options[e.target.selectedIndex].text;
    setSelectedDistrict(selectedDistrictName);
    setNewAddress(prev => ({ ...prev, district: selectedDistrictName }));

    axios.get('https://api.npoint.io/dd278dc276e65c68cdf5')
      .then(response => {
        const filteredWards = response.data.filter(ward => ward.DistrictId === parseInt(districtCode));
        setWards(filteredWards);
        setSelectedWard('');
        updateDiaDiem(selectedProvince, selectedDistrictName, '');
      })
      .catch(error => {
        console.error("Error fetching wards:", error);
      });
  };

  const handleWardChange = (e) => {
    const wardName = e.target.value;
    setSelectedWard(wardName);
    setNewAddress(prev => ({ ...prev, ward: wardName }));
    updateDiaDiem(selectedProvince, selectedDistrict, wardName);
  };

  const updateDiaDiem = (province, district, ward) => {
    const diaDiem = `${province} ${district} ${ward}`;
    setAppointmentData(prevData => ({ ...prevData, diaDiem }));
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prevData => ({ ...prevData, [name]: value }));
  };

  const saveNewAddress = async () => {
    const fullAddress = `${newAddress.province} ${newAddress.district} ${newAddress.ward} ${newAddress.specificAddress}`;
    try {
      await axios.post('http://localhost:5199/api/DiaChi/create-dia-chi', {
        tenDiaChi: fullAddress
      });
      setAppointmentData(prevData => ({ ...prevData, diaDiem: fullAddress }));
      const addressesResponse = await axios.get('http://localhost:5199/api/DiaChi/get-all-dia-chi');
      setPreviousAddresses(addressesResponse.data); // Update the addresses after adding new one
      toggleModal();
    } catch (error) {
console.error("Error saving new address:", error);
    }
  };

  const handleAddressSelect = (e) => {
    const selectedAddress = e.target.value;
    setAppointmentData(prevData => ({ ...prevData, diaDiem: selectedAddress }));
  };

  const checkDoctorAvailability = async (doctorId) => {
    try {
      const response = await axios.get('http://localhost:5199/api/LichLamViec/get-all-lich-lam-viec');
      const today = new Date();
      const availableDates = response.data
        .filter(item => item.maBacSi === doctorId && new Date(item.ngay) > today)
        .map(item => new Date(item.ngay));

      return availableDates.length > 0;
    } catch (error) {
      console.error("Error checking doctor availability:", error);
      return false;
    }
  };

  const fetchAvailableDates = async (doctorId) => {
    try {
      const response = await axios.get('http://localhost:5199/api/LichLamViec/get-all-lich-lam-viec');
      const today = new Date();
      const inAWeek = new Date(today);
      inAWeek.setDate(today.getDate() + 7); // Set to 7 days later
  
      const dates = response.data
        .filter(item => item.maBacSi === doctorId && new Date(item.ngay) >= today && new Date(item.ngay) <= inAWeek)
        .map(item => new Date(item.ngay));
      dates.sort((a, b) => a - b); // Sort dates in ascending order
  
      setAvailableDates(dates);
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };

  const getDayName = (date) => {
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[date.getDay()];
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedBacSi(doctorId);
    setAppointmentData(prevData => ({ ...prevData, maBacSi: doctorId }));
    fetchAvailableDates(doctorId);
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    setAppointmentData(prevData => ({ ...prevData, thoiGianDuKien: localDate }));
    await checkUnavailableTimes(date, selectedBacSi);
  };

  const checkUnavailableTimes = async (date, selectedBacSi) => {
    try {
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const response = await axios.get('http://localhost:5199/api/LichHen/get-all-lich-hen');
      
      const filteredAppointments = response.data.filter(appointment => {
        const appointmentDate = new Date(appointment.thoiGianDuKien);
        const formattedAppointmentDate = `${appointmentDate.getFullYear()}-${(appointmentDate.getMonth() + 1).toString().padStart(2, '0')}-${appointmentDate.getDate().toString().padStart(2, '0')}`;
        return formattedAppointmentDate === formattedDate && appointment.maBacSi === selectedBacSi;
      });
const times = filteredAppointments.map(item => {
        const appointmentDate = new Date(item.thoiGianDuKien);
        return `${appointmentDate.getHours().toString().padStart(2, '0')}:${appointmentDate.getMinutes().toString().padStart(2, '0')}`;
      });
  
      const allTimes = [
        '08:00', '09:00', '10:00', '13:30', '14:30', '15:30', '16:30'
      ];
  
      const availableTimes = allTimes.filter(time => !times.includes(time));
      setAvailableTimes(availableTimes);
      setUnavailableTimes(times);
    } catch (error) {
      console.error('Failed to fetch unavailable times:', error);
    }
  };
  

  const handleTimeSelect = (time) => {
    setAppointmentData(prevData => ({ ...prevData, thoiGianDuKien: `${appointmentData.thoiGianDuKien}T${time}` }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5199/api/LichHen/create-lich-hen', appointmentData);
      
      await handlePayment();
    } catch (error) {
      console.error("Lỗi:", error);
      alert('Lỗi');
    }
  };

  const handlePayment = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/LichHen/get-all-lich-hen-khach-hang');
      const appointments = response.data;
      const latestAppointment = appointments.reduce((latest, appointment) => {
        return appointment.id > latest.id ? appointment : latest;
      }, appointments[0]);
      const maLichHen = latestAppointment.id;
      const paymentResponse = await axios.post(`http://localhost:5199/api/ThanhToanDV/thanh-toan-by-id?maLichHen=${maLichHen}`, {});
      const paymentData = paymentResponse.data;
      if (paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        alert('Không có URL thanh toán');
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert('Lỗi trong quá trình thanh toán');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(<span key={i} className="fa fa-star checked"></span>);
        } else if (hasHalfStar && i === fullStars + 1) {
            stars.push(<span key={i} className="fa fa-star-half-alt checked"></span>);
        } else {
            stars.push(<span key={i} className="fa fa-star"></span>);
        }
    }
    return stars;
};


  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!service) {
return <div>Service not found</div>;
  }

  return (
    <div className="container mt-5">
      <div className="banner">
        <img src={banneryTe} alt="Banner" />
      </div>
      <Card className="card">
        <CardImg
          top
          width="100%"
          height="300px"
          src={
service.hinhAnh.startsWith("/")
              ? `http://localhost:5199${service.hinhAnh}`
              : service.hinhAnh
          }
          alt={service.tenDichVu}
        />
        <CardBody>
          <CardTitle style={{fontSize:28}} tag="h5">{service.tenDichVu}</CardTitle>
          <p style={{fontSize:20}}>{service.moTa}</p>
          <p style={{fontSize:25}} className="price"><strong>Giá: </strong>{service.gia.toLocaleString('vi-VN')} VND</p>

          <p className="rating">
  <strong>Đánh giá: </strong>
  {rating > 0 ? renderStars(rating) : "Chưa có đánh giá"}
</p>


          <div className="form-section">
            <CardTitle tag="h5">Đặt lịch hẹn</CardTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label style={{fontSize:18}} for="maBacSi">Chọn bác sĩ</Label>
                <div className="doctor-selection">
                  {filteredDoctors.map(doctor => (
                    <div
                      key={doctor.id}
                      className={`doctor-item ${selectedBacSi === doctor.id ? 'selected' : ''}`}
                      onClick={() => handleDoctorSelect(doctor.id)}
                    >
                      <div className="doctor-image-wrapper">
                        <img
                          src={`http://localhost:5199${doctor.hinhAnh}`}
                          alt={doctor.tenBacSi}
                          className="doctor-image"
                        />
                      </div>
                      <p>{doctor.tenBacSi}</p>
                    </div>
                  ))}
                </div>
              </FormGroup>

              {selectedBacSi && (
                <>
                  <FormGroup>
                    <Label for="availableDates">Chọn ngày</Label>
                    <div className="date-selection">
                      {availableDates.map((date, index) => (
                        <div
                          key={index}
                          className={`date-item ${selectedDate && selectedDate.toDateString() === date.toDateString() ? 'selected' : ''}`}
                          onClick={() => handleDateSelect(date)}
                        >
                          <p>{getDayName(date)} - {date.getDate()}/{date.getMonth() + 1}</p>
                        </div>
                      ))}
                    </div>
                  </FormGroup>

                  {selectedDate && (
                    <FormGroup>
                      <Label for="availableTimes">Chọn giờ</Label>
                      <div className="time-slot-selection">
                        <div className="time-slot-group">
                          {availableTimes.slice(0, 6).map((time, index) => (
                            <div
key={index}
                              className={`time-slot ${appointmentData.thoiGianDuKien.endsWith(time) ? 'selected' : ''}`}
onClick={() => handleTimeSelect(time)}
                            >
                              <p>{time} - {(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0') + ':' + time.split(':')[1]}</p>
                            </div>
                          ))}
                        </div>
                        <div className="time-slot-group">
                          {availableTimes.slice(6).map((time, index) => (
                            <div
                              key={index}
                              className={`time-slot ${appointmentData.thoiGianDuKien.endsWith(time) ? 'selected' : ''}`}
                              onClick={() => handleTimeSelect(time)}
                            >
                              <p>{time} - {(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0') + ':' + time.split(':')[1]}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormGroup>
                  )}

                  {selectedDate && availableTimes.length === 0 && (
                    <div className="no-times">Không có lịch hẹn khả dụng cho ngày này</div>
                  )}
                </>
              )}

              <FormGroup>
                <Label style={{fontSize:18}} for="diaDiem">Địa điểm</Label>
                <Input
                  type="select"
                  name="diaDiem"
                  id="diaDiem"
                  value={appointmentData.diaDiem}
                  onChange={handleAddressSelect}
                  required
                >
                  <option value="">Chọn địa điểm</option>
                  {previousAddresses.map(address => (
                    <option key={address.id} value={address.tenDiaChi}>{address.tenDiaChi}</option>
                  ))}
                </Input>
                <Button onClick={toggleModal} className="btn-add-address">Thêm địa chỉ mới</Button>
              </FormGroup>

              <FormGroup>
                <Label style={{fontSize:18}} for="ghiChu">Ghi chú</Label>
                <Input
                  type="textarea"
                  name="ghiChu"
                  id="ghiChu"
                  value={appointmentData.ghiChu}
                  onChange={(e) => setAppointmentData({ ...appointmentData, ghiChu: e.target.value })}
                />
              </FormGroup>

              <Button type="submit" color="primary">Đặt lịch hẹn & Thanh toán</Button>
            </Form>
          </div>
          <div className="reviews-section">
            <h5>Đánh giá của khách hàng</h5>
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <img
                style={{width:50,height:80}}
                  src={`http://localhost:5199${review.avatar}`}
alt={review.tenKhachHang}
                  className="review-avatar"
                />
                <div className="review-content">
                  <div className="review-header">
                    <span className="review-name">{review.tenKhachHang}</span>
                  </div>
                  <span className="review-stars">{renderStars(review.soSaoDanhGia)}</span>
                  <div>
                  <img
                                  style={{width:50,height:50}}

                    src={`http://localhost:5199${review.hinhAnh}`}
                    alt="Review"
                    className="review-image"
                  />
                  </div>
              
                  <p className="review-text">{review.noiDungDanhGia}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Thêm Địa Chỉ Mới</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="province">Thành phố</Label>
              <Input
                type="select"
                name="province"
                id="province"
                onChange={handleProvinceChange}
                required
              >
                <option value="">Chọn thành phố</option>
                {provinces.map(province => (
                  <option key={province.Id} value={province.Id}>{province.Name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="district">Quận/Huyện</Label>
              <Input
                type="select"
                name="district"
                id="district"
                onChange={handleDistrictChange}
                required
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map(district => (
                  <option key={district.Id} value={district.Id}>{district.Name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="ward">Phường/Xã</Label>
              <Input
                type="select"
                name="ward"
                id="ward"
                onChange={handleWardChange}
                required
                
              >
                <option value="">Chọn phường/xã</option>
                {wards.map(ward => (
                  <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="specificAddress">Địa chỉ cụ thể</Label>
              <Input
                type="text"
                name="specificAddress"
                id="specificAddress"
                value={newAddress.specificAddress}
onChange={handleNewAddressChange}
                required
              />
            </FormGroup>
            {/* <FormGroup>
              <Label for="previousAddresses">Địa chỉ đã đăng ký trước đó</Label>
              <div className="previous-addresses-list">
                {previousAddresses.map(address => (
                  <div key={address.id} onClick={() => handleAddressSelect(address.tenDiaChi)}>
                    {address.tenDiaChi}
                  </div>
                ))}
              </div>
            </FormGroup> */}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={saveNewAddress}>Lưu Địa Chỉ</Button>{' '}
          {/* <Button color="secondary" onClick={toggleModal}>Hủy</Button> */}
        </ModalFooter>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Datlich;
