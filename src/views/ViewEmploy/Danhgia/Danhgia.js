import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardImg, CardFooter, Row, Col, Container, Button, Label, Input } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faStarHalfAlt as fasStarHalf } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import './danhgia.css'; // Import custom CSS file
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

function Danhgia() {
  const [danhGiaChuaDuyet, setDanhGiaChuaDuyet] = useState([]);
  const [danhGiaDaDuyet, setDanhGiaDaDuyet] = useState([]);
  const [dichVu, setDichVu] = useState([]);
  const [loaiDichVu, setLoaiDichVu] = useState([]);
  const [ketQuaDichVu, setKetQuaDichVu] = useState([]);
  const [lichHen, setLichHen] = useState([]);
  const [khachHangs, setKhachHangs] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dichVuData, loaiDichVuData, danhGiaChuaDuyetData, danhGiaDaDuyetData, khachHangData, ketQuaDichVuData, lichHenData] = await Promise.all([
          axios.get("http://localhost:5199/api/DichVu/get-all-dich-vu"),
          axios.get("http://localhost:5199/api/LoaiDichVu/get-all-loai-dich-vu"),
          axios.get("http://localhost:5199/api/DanhGia/get-all-danh-gia-chua-duyet"),
          axios.get("http://localhost:5199/api/DanhGia/get-all-danh-gia-da-duyet"),
          axios.get("http://localhost:5199/api/KhachHang/get-all-khach-hang"),
          axios.get("http://localhost:5199/api/KetQuaDichVu/get-all-ket-qua-dich-vu"),
          axios.get("http://localhost:5199/api/LichHen/get-all-lich-hen")
        ]);

        console.log("DichVuData:", dichVuData.data);
        console.log("LoaiDichVuData:", loaiDichVuData.data);
        console.log("DanhGiaChuaDuyetData:", danhGiaChuaDuyetData.data);
        console.log("DanhGiaDaDuyetData:", danhGiaDaDuyetData.data);
        console.log("KhachHangData:", khachHangData.data);
        console.log("KetQuaDichVuData:", ketQuaDichVuData.data);
        console.log("LichHenData:", lichHenData.data);

        setDichVu(dichVuData.data);
        setLoaiDichVu(loaiDichVuData.data);
        setDanhGiaChuaDuyet(danhGiaChuaDuyetData.data);
        setDanhGiaDaDuyet(danhGiaDaDuyetData.data);
        setKhachHangs(khachHangData.data);
        setKetQuaDichVu(ketQuaDichVuData.data);
        setLichHen(lichHenData.data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const renderStars = (soSao) => {
    const fullStars = Math.floor(soSao);
    const halfStars = soSao % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    return (
      <>
        {Array(fullStars).fill().map((_, i) => <FontAwesomeIcon key={i} icon={fasStar} style={{ color: '#ffd700' }} />)}
        {halfStars === 1 && <FontAwesomeIcon icon={fasStarHalf} style={{ color: '#ffd700' }} />}
        {Array(emptyStars).fill().map((_, i) => <FontAwesomeIcon key={i} icon={farStar} style={{ color: '#d3d3d3' }} />)}
      </>
    );
  };

  const getTenKhachHang = (createBy) => {
    const khachHang = khachHangs.find(kh => kh.maKhachHang === createBy);
    return khachHang ? khachHang.tenKhachHang : "Không rõ";
  };

  const getHinhAnhKhachHang = (createBy) => {
    const khachHang = khachHangs.find(kh => kh.maKhachHang === createBy);
    return khachHang ? `http://localhost:5199${khachHang.avatar}` : "http://localhost:5199/default-avatar.png";
  };

  const getTenDichVu = (maKetQuaDichVu) => {
    if (!ketQuaDichVu.length || !lichHen.length || !dichVu.length) return "Đang tải...";
    const kq = ketQuaDichVu.find(kq => kq.id === maKetQuaDichVu);
    if (kq) {
      const lh = lichHen.find(lh => lh.id === kq.maLichHen);
      if (lh) {
        const dv = dichVu.find(dv => dv.id === lh.maDichVu);
        return dv ? dv.tenDichVu : "Dịch vụ không xác định";
      }
    }
    return "Dịch vụ không xác định";
  };

  const getTenLoaiDichVu = (maKetQuaDichVu) => {
    if (!ketQuaDichVu.length || !lichHen.length || !dichVu.length || !loaiDichVu.length) return "Đang tải...";
    const kq = ketQuaDichVu.find(kq => kq.id === maKetQuaDichVu);
    if (kq) {
      const lh = lichHen.find(lh => lh.id === kq.maLichHen);
      if (lh) {
        const dv = dichVu.find(dv => dv.id === lh.maDichVu);
        if (dv && dv.maLoaiDichVu) {
          const ldv = loaiDichVu.find(ldv => ldv.id === dv.maLoaiDichVu);
          return ldv ? ldv.tenLoai : "Loại dịch vụ không xác định";
        }
      }
    }
    return "Loại dịch vụ không xác định";
  };


  const getTenDichVuu = (maDichVu) => {
    if (!dichVu.length) return "Đang tải...";
    const dv = dichVu.find(dv => dv.id === maDichVu);
    return dv ? dv.tenDichVu : "Dịch vụ không xác định";
  };

  const getTenLoaiDichVuu = (maDichVu) => {
    if (!loaiDichVu.length || !dichVu.length) return "Đang tải...";
    const dv = dichVu.find(dv => dv.id === maDichVu);
    if (dv && dv.maLoaiDichVu) {
      const ldv = loaiDichVu.find(ldv => ldv.id === dv.maLoaiDichVu);
      return ldv ? ldv.tenLoai : "Loại dịch vụ không xác định";
    }
    return "Loại dịch vụ không xác định";
  };


  const handleCheckboxChange = (event, reviewId) => {
    if (event.target.checked) {
      setSelectedReviews([...selectedReviews, reviewId]);
    } else {
      setSelectedReviews(selectedReviews.filter(id => id !== reviewId));
    }
  };

  const handleApproveReviews = () => {
    axios.put('http://localhost:5199/api/DanhGia/update-duyet-danh-gia', selectedReviews)
      .then(response => {
        toast.success('Đánh giá đã được duyệt thành công');
        window.location.reload(); // Optionally remove this if you prefer not to reload the page
        setSelectedReviews([]);
      })
      .catch(error => {
        console.error("Có lỗi xảy ra khi duyệt đánh giá:", error);
        toast.error("Có lỗi xảy ra khi duyệt đánh giá");
      });
  };

  return (
    <Container>
      <Card style={{ width: 1000 ,marginTop:100 }} className="container-card">
        <h2 style={{ color: 'red' }} className="my-4">Đánh Giá Chưa Duyệt</h2>
        <Row>
          {danhGiaChuaDuyet.map(danhGia => (
            <Col md="4" key={danhGia.id} className="mb-4">
              <Card className="shadow-sm" style={{ borderRadius: "10px", overflow: "hidden", height: 550, width: 300 }}>
                <CardImg top src={`http://localhost:5199${danhGia.hinhAnh}`} alt="Hình ảnh đánh giá" style={{ height: '200px', objectFit: 'cover' }} />
                <CardBody>
                  <CardTitle tag="h5" className="mb-3 custom-card-title">{danhGia.noiDungDanhGia}</CardTitle>
                  <div className="stars-container">{renderStars(danhGia.soSaoDanhGia)}</div>
                  <div className="service-info">
                    <strong>Dịch vụ:</strong> {getTenDichVu(danhGia.maKetQuaDichVu)}
                    <br />
                    <strong>Loại dịch vụ:</strong> {getTenLoaiDichVu(danhGia.maKetQuaDichVu)}
                  </div>
                </CardBody>
                <CardFooter style={{marginTop:150}} className="d-flex flex-column align-items-center">
                  <img
                    src={getHinhAnhKhachHang(danhGia.createBy)}
                    alt="Hình ảnh khách hàng"
                    style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div className="custom-customer-name">
                    <div className="font-weight-bold">{getTenKhachHang(danhGia.createBy)}</div>
                  </div>
                  <Label className="mt-2" check>
                    <Input type="checkbox" onChange={(e) => handleCheckboxChange(e, danhGia.id)} />{' '}
                    Chọn
                  </Label>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
        <Button color="primary" onClick={handleApproveReviews}>Duyệt Đánh Giá</Button>
      </Card>

      <Card style={{ width: 1000 }} className="container-card">
        <h2 style={{ color: 'red' }} className="my-4">Đánh Giá Đã Duyệt</h2>
        <Row>
          {danhGiaDaDuyet.map(danhGia => (
            <Col md="4" key={danhGia.id} className="mb-4">
              <Card className="shadow-sm" style={{ borderRadius: "10px", overflow: "hidden", height: 500, width: 300 }}>
                <CardImg top src={`http://localhost:5199${danhGia.hinhAnh}`} alt="Hình ảnh đánh giá" style={{ height: '200px', objectFit: 'cover' }} />
                <CardBody>
                  <CardTitle tag="h5" className="mb-3 custom-card-title">{danhGia.noiDungDanhGia}</CardTitle>
                  <div className="stars-container">{renderStars(danhGia.soSaoDanhGia)}</div>
                  <div className="service-info">
                    <strong>Dịch vụ:</strong> {getTenDichVuu(danhGia.maKetQuaDichVu)}
                    <br />
                    <strong>Loại dịch vụ:</strong> {getTenLoaiDichVuu(danhGia.maKetQuaDichVu)}
                  </div>
                </CardBody>
                <CardFooter style={{marginTop:150}}  className="d-flex flex-column align-items-center">
                  <img
                    src={getHinhAnhKhachHang(danhGia.createBy)}
                    alt="Hình ảnh khách hàng"
                    style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div  className="custom-customer-name">
                    <div className="font-weight-bold">{getTenKhachHang(danhGia.createBy)}</div>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

    </Container>
  );
}

export default Danhgia;
