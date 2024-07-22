import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import { editThongTinKhachHang, changePassword } from "assets/serviceAPI/userService";
import Modal from 'react-bootstrap/Modal';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function User() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [tenKhachHang, settenKhachHang] = useState("");
  const [email, setemail] = useState("");
  const [matKhau, setmatKhau] = useState("");
  const [sdt, setsdt] = useState("");
  const [cmnd, setcmnd] = useState("");
  const [ten, setTen] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [thongTinKhachHang, setThongTinKhachHang] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [show, setShow] = useState(false);
  const [showMK, setShowMK] = useState(false);
  const [birthDateError, setBirthDateError] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseMK = () => setShowMK(false);
  const handleShowMK = () => setShowMK(true);

  const checkTokenExpiration = (token) => {
    if (!token) return false;
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("data");
      console.log(token);
      if (!token || !checkTokenExpiration(token)) {
        toast.error("Token đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
        localStorage.removeItem("data");
        window.location.reload();
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      const response = await axios.get('http://localhost:5199/api/KhachHang/get-tt-khach-hang', config);

      const data = response.data;
      setThongTinKhachHang(data);
      setAvatar(data.avatar ? `http://localhost:5199${data.avatar}` : null);
      settenKhachHang(data.tenKhachHang);
      setsdt(data.sdt);
      setcmnd(data.cmnd);
      setemail(data.email);
      setmatKhau(data.matKhau);
      setGender(data.gioiTinh);
      setBirthDate(new Date(data.ngaySinh));
      setTen(data.tenKhachHang);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized access. Please login again.");
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateKhachHang = async () => {
    if (birthDateError) {
      toast.error("Ngày sinh không hợp lệ.");
      return;
    }

    try {
      const response = await editThongTinKhachHang(
        tenKhachHang,
        email,
        matKhau,
        sdt,
        cmnd,
        birthDate.toISOString(),
        gender
      );

      if (response.statusCode === 200 ) {
        toast.success("Cập nhật thông tin khách hàng thành công");
        window.location.reload();
      }else{
        toast.error("Có lỗi xảy ra khi cập nhật thông tin khách hàng");
      }
  

      handleClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi yêu cầu đến server");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const response = await changePassword(currentPassword, newPassword, confirmNewPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        toast.success("Mật khẩu đã được thay đổi thành công.");
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      toast.error("Mật khẩu không đúng vui lòng nhập lại");
    }
  };

  const handleUpdateAvatar = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatar(newAvatarUrl); // Hiển thị ảnh lên giao diện tạm thời

      const formData = new FormData();
      formData.append("avatarFile", file); // Thêm trường "avatarFile" vào FormData

      try {
        const response = await axios.post("http://localhost:5199/api/KhachHang/UploadAvatar", formData);

        if (response.status === 200) {
          toast.success("Cập nhật ảnh đại diện thành công");
          fetchData(); // Lấy lại dữ liệu người dùng sau khi upload thành công
        } else {
          toast.error("Có lỗi xảy ra khi cập nhật ảnh đại diện");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi gửi yêu cầu đến server");
      }
    };
    fileInput.click();
  };

  const validateBirthDate = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      setBirthDateError("Ngày sinh không được lớn hơn ngày hiện tại.");
    } else {
      setBirthDateError("");
    }
  };

  const token = localStorage.getItem("data");
  let unique_name = "";

  if (token) {
    const decodedToken = jwtDecode(token);
    unique_name = decodedToken.unique_name;
  }

  return (
    <>
      {/* CHỈNH SỬA THÔNG TIN CÁ NHÂN  */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh Sửa Thông Tin Cá Nhân</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Tên khách hàng</label>
              <input type="text" value={tenKhachHang} onChange={(e) => settenKhachHang(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" value={email} onChange={(e) => setemail(e.target.value)} className="form-control" disabled />
            </div>
            {/* <div className="form-group">
              <label>Password</label>
              <input type="text" value={matKhau} onChange={(e) => setmatKhau(e.target.value)} className="form-control" disabled />
            </div> */}
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="text" value={sdt} onChange={(e) => setsdt(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>CMND</label>
              <input type="text" value={cmnd} onChange={(e) => setcmnd(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <div>
                <label>
                  <input type="radio" value="Nam" checked={gender === "Nam"} onChange={(e) => setGender(e.target.value)} />
                  Nam
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input type="radio" value="Nữ" checked={gender === "Nữ"} onChange={(e) => setGender(e.target.value)} />
                  Nữ
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Ngày sinh</label>
              <DatePicker
                selected={birthDate}
                onChange={(date) => {
                  setBirthDate(date);
                  validateBirthDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
              {birthDateError && <div style={{ color: 'red', marginTop: '10px' }}>{birthDateError}</div>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleUpdateKhachHang}>
            Xác Nhận
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ĐỔI MẬT KHẨU  */}
      <Modal show={showMK} onHide={handleCloseMK}>
        <Modal.Header closeButton>
          <Modal.Title>Đổi Mật Khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Mật Khẩu Hiện Tại</label>
              <div className="password-wrapper" style={{ position: 'relative' }}>
                <input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-control" />
                <FontAwesomeIcon
                  icon={showCurrentPassword ? faEyeSlash : faEye}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Mật Khẩu Mới</label>
              <div className="password-wrapper" style={{ position: 'relative' }}>
                <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" />
                <FontAwesomeIcon
                  icon={showNewPassword ? faEyeSlash : faEye}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Xác Nhận Mật Khẩu Mới</label>
              <div className="password-wrapper" style={{ position: 'relative' }}>
                <input type={showConfirmNewPassword ? 'text' : 'password'} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="form-control" />
                <FontAwesomeIcon
                  icon={showConfirmNewPassword ? faEyeSlash : faEye}
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleCloseMK}>
            Đóng
          </Button> */}
          <Button variant="primary" onClick={handleChangePassword}>
            Thay Đổi Mật Khẩu
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="content">
        <div className="row">
          <div className="col-md-4">
            <div className="card card-user">
              <div className="image">
                <img alt="..." src={require("assets/img/damir-bosnjak.jpg")} />
              </div>
              <div className="card-body">
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={avatar || require("assets/img/mike.jpg")}
                    />
                  </a>
                  <h5 className="title">{ten}</h5>
                  <Button onClick={handleUpdateAvatar} color="primary" className="btn-round btn-icon">
                    <i className="fas fa-camera"></i>
                  </Button>
                </div>
              </div>
              <div className="card-footer"></div>
            </div>
            <div className="card"></div>
          </div>
          <div className="col-md-8">
            <div className="card card-user">
              <div className="card-header">
                <h5 className="card-title" style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>Chỉnh Sửa Thông Tin Cá Nhân</h5>
              </div>
              <div className="card-body">
                {thongTinKhachHang ? (
                  <form>
                    <div className="form-group">
                      <label>Tên khách hàng</label>
                      <input type="text" value={thongTinKhachHang.tenKhachHang} disabled className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="text" value={thongTinKhachHang.email} disabled className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại</label>
                      <input type="text" value={thongTinKhachHang.sdt} disabled className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>CMND</label>
                      <input type="text" value={thongTinKhachHang.cmnd} disabled className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Giới tính</label>
                      <div>
                        <label>
                          <input type="radio" value="Nam" checked={thongTinKhachHang.gioiTinh === "Nam"} disabled />
                          Nam
                        </label>
                        <label style={{ marginLeft: "10px" }}>
                          <input type="radio" value="Nữ" checked={thongTinKhachHang.gioiTinh === "Nữ"} disabled />
                          Nữ
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Ngày sinh</label>
                      <input type="text" value={new Date(thongTinKhachHang.ngaySinh).toLocaleDateString()} disabled className="form-control" />
                    </div>
                    <Button style={{ textAlign: 'center', fontWeight: 'bold' }} variant="primary" onClick={handleShow}>
                      Chỉnh Sửa Thông Tin
                    </Button>
                    <Button style={{ textAlign: 'center', fontWeight: 'bold' }} variant="primary" onClick={handleShowMK}>
                      Đổi Mật Khẩu
                    </Button>
                  </form>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;
