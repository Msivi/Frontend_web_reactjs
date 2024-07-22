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
import { faTrashAlt, faEdit ,faAdd } from '@fortawesome/free-solid-svg-icons';

function User() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [thongTinNhanVien, setthongTinNhanVien] = useState([]);
  const [tenNhanVien, settenNhanVien] = useState("");
  const [matKhau, setmatKhau] = useState("");
  const [email, setemail] = useState("");
  const [sdt, setsdt] = useState("");
  const [ten, setTen] = useState("");
  const [cmnd, setcmnd] = useState("");

  const [show, setShow] = useState(false);
  const [showMK, setShowMK] = useState(false);
  const [avatar, setAvatar] = useState(null);



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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    try {
      const response = await changePassword(currentPassword, newPassword, confirmNewPassword);
  
      if (response && response.data && response.data.success) {
        toast.success("Mật khẩu đã được thay đổi thành công.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        window.location.reload();
      } else {
        toast.error("Không thành công khi thay đổi mật khẩu.");
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      toast.error("Lỗi khi thay đổi mật khẩu.");
    }
  };
  const handleUpdateKhachHang = async () => { 
    
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
        const response = await axios.post("http://localhost:5199/api/NhanVien/UploadAvatar", formData);
  
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
  
      const response = await axios.get('http://localhost:5199/api/NhanVien/get-tt-nhan-vien', config);
  
      const data = response.data;
      setthongTinNhanVien(data);
      setAvatar(data.avatar ? `http://localhost:5199${data.avatar}` : null);
      settenNhanVien(data.tenNhanVien);
      setsdt(data.sdt);
      setcmnd(data.cmnd);
      setemail(data.email);
      setmatKhau(data.matKhau);
      // setGender(data.gioiTinh);
      // setBirthDate(new Date(data.ngaySinh));
        setTen(data.tenNhanVien);
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

return (
  <>
   {/* CHỈNH SỬA THÔNG TIN CÁ NHÂN  */}
   <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title> Thông Tin Cá Nhân</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label>Tên Nhân Viên</label>
            <input type="text" value={tenNhanVien} onChange={(e) => settenNhanVien(e.target.value)} className="form-control" />
          </div>
          <div className="form-group">
          <label>Email</label>
              <input type="text" value={email} onChange={(e) => setemail(e.target.value)} className="form-control" disabled />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="text" value={matKhau} onChange={(e) => setmatKhau(e.target.value)} className="form-control" disabled />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="text" value={sdt} onChange={(e) => setsdt(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>CMND</label>
              <input type="text" value={cmnd} onChange={(e) => setcmnd(e.target.value)} className="form-control" />
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
          <Modal.Title>Chỉnh Sửa Thông Tin Cá Nhân</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Mật Khẩu Hiện Tại</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Mật Khẩu Mới</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Xác Nhận Mật Khẩu Mới</label>
              <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="form-control" />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMK}>
            Đóng
          </Button>
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
                <h5 className="card-title" style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}> Thông Tin Cá Nhân</h5>
              </div>
              <div className="card-body">
                {thongTinNhanVien ? (
                  <form>
                    <div className="form-group">
                      <label>Tên Nhân Viên</label>
                      <input type="text" value={thongTinNhanVien.tenNhanVien} disabled className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="text" value={thongTinNhanVien.email} disabled className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại</label>
                      <input type="text" value={thongTinNhanVien.sdt} disabled className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>CMND</label>
                      <input type="text" value={thongTinNhanVien.cmnd} disabled className="form-control" />
                    </div>
                    
                  
                    {/* <Button style={{ textAlign: 'center', fontWeight: 'bold' }} variant="primary" onClick={handleShow}>
                      Chỉnh Sửa Thông Tin
                    </Button> */}
                    
                    <Button style={{ textAlign: 'center', fontWeight: 'bold'}} variant="primary" onClick={handleShowMK}>
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