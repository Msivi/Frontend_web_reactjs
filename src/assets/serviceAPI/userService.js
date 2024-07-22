import axios from "./axios";





//Đổi Mật Khẩu
const changePassword = (currentPassword,newPassword,confirmNewPassword) => {
  return axios.post("/api/Authentication/change-password",{currentPassword,newPassword,confirmNewPassword});
}

//Đăng Nhập
const loginAPI = (email,password) => {
  return axios.post("/api/Authentication/login", {email,password});
}

//Đăng Ký
const registerKhachHang = (tenKhachHang,email,matKhau,sdt,cmnd,ngaySinh,gioiTinh) => {
  return axios.post("/api/Authentication/create-khach-hang",{tenKhachHang,email,matKhau,sdt,cmnd,ngaySinh,gioiTinh});
}



//Thông tin khách hàng Admin
const getTTKhachHangAdmin = () => {
  return axios.get("/api/KhachHang/get-all-khach-hang");
}

//Thiet Bi Y TE
const getThietBiYTe = () => {
  return axios.get("/api/ThietBiYTe/get-all-thiet-bi-y-te");
}



//Thuoc
const getThuoc = () => {
  return axios.get("/api/Thuoc/get-all-thuoc");
}

//THEMTHIETBI
const THEMTHIETBI = (tenThietBi,donGia,maLoaiThietBi,ngaySanXuat,ngayHetHan,nhaSanXuat,moTa) => {
  return axios.post("/api/ThietBiYTe/create-thiet-bi-y-te",{tenThietBi,donGia,maLoaiThietBi,ngaySanXuat,ngayHetHan,nhaSanXuat,moTa});
}

//NHAP THIET BI Y TE
const NHAPTHIETBIYTE = (ngayTao,maNhaCungCap) => {
  return axios.post("/api/NhapThietBiYTe/create-nhap-thiet-bi-y-te",{ngayTao,maNhaCungCap});
}

//NHAP THIET BI Y TE
const CTNHAPTHIETBIYTE = (maThietBiYTe,maNhapThietBiYTe,soLuong,ngayTao) => {
  return axios.post("/api/CTNhapThietBiYTe/create-ct-nhap-thiet-bi-y-te",{maThietBiYTe,maNhapThietBiYTe,soLuong,ngayTao});
}


//NHÀ CUNG CẤP 
const getnhaCungCap = () => {
  return axios.get("/api/NhaCungCap/get-all-nha-cung-cap");
}


//GETALL NHAP THUOC

const getllAllNhapThuoc = () => {
  return axios.get("/api/NhapThuoc/get-all-nhap-thuoc");

}

//THEMTHUOC
const THEMTHUOC = (tenThuoc, donViTinh, donGia, ngaySanXuat, ngayHetHan, nhaSanXuat, maLoaiThuoc, thanhPhan, moTa, imageFile) => {
  const formData = new FormData();
  formData.append('tenThuoc', tenThuoc);
  formData.append('donViTinh', donViTinh);
  formData.append('donGia', donGia);
  formData.append('ngaySanXuat', ngaySanXuat);
  formData.append('ngayHetHan', ngayHetHan);
  formData.append('nhaSanXuat', nhaSanXuat);
  formData.append('maLoaiThuoc', maLoaiThuoc);
  formData.append('thanhPhan', thanhPhan);
  formData.append('moTa', moTa);
  if (imageFile) {
    formData.append('imageFile', imageFile);
  }

  return axios.post("/api/Thuoc/create-thuoc", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};


//NHAP THUOC
const NHAPTHUOC = (ngayTao,maNhaCungCap) => {
  return axios.post("/api/NhapThuoc/create-nhap-thuoc",{ngayTao,maNhaCungCap});
}

//CHI TIET NHAP THUOC 

const CTNhapThuoc = (maThuoc,maNhapThuoc,soLuong)=>
  {
    return axios.post("/api/CTNhapThuoc/create-ct-nhap-thuoc",{maThuoc,maNhapThuoc,soLuong});
  }

//Loai Thuoc
const getLoaiThuoc = () => {
  return axios.get("/api/LoaiThuoc/get-all-loai-thuoc");

}


//Thêm Loại ThietBi 
const themloaithietbi = (tenLoaiThietBi) => {
  return axios.post("/api/LoaiThietBi/create-loai-thiet-bi", {tenLoaiThietBi});
}
//Thêm Loại Thuốc 
const themThuoc = (tenLoaiThuoc) => {
  return axios.post("/api/LoaiThuoc/create-loai-thuoc", {tenLoaiThuoc});
}




//Loai Thiet Bi
const getLoaiThietBi = () => {
  return axios.get("/api/LoaiThietBi/get-all-loai-thiet-bi");

}

// Loai DV
const getLoaiDichVu = () => {
  return axios.get("/api/LoaiDichVu/get-all-loai-dich-vu");

}

//chinh sua thong tin 
const editThongTinKhachHang = (tenKhachHang,email,matKhau,sdt,cmnd,ngaySinh,gioiTinh) =>{
  return axios.put("/api/KhachHang/update-khach-hang",{tenKhachHang,email,matKhau,sdt,cmnd,ngaySinh,gioiTinh});
}

  
//Get thông tin cá nhân
const getThongTinKhachHang = () =>{
  return axios.get("/api/KhachHang/get-tt-khach-hang");
}





//Đăng Xuất
const logoutAPI = () => {
    return axios.post("api/Authentication/logout");
  };

//get all khachhang
const getALLKHACHHANG = () => {
  return axios.get("/get-all-khach-hang");
}






//Thêm Vaccine
const themVaccine = (id,tenVaccine,nhaSanXuat,soLuongTon,ngaySX,ngayHetHan,maLoaiVaccine,giaTien) => {
  return axios.post ("/api/Vaccine/create-vaccine", {id,tenVaccine,nhaSanXuat,soLuongTon,ngaySX,ngayHetHan,maLoaiVaccine,giaTien})
}

//Lấy Tất cả Loai Vaccine 
const getALLLoaiVaccine = () => {
  return axios.get("/api/LoaiVaccine/get-all-loai-vaccine");
}

//Xoa Loại Vaccine
const xoaLoaiVaccine = () => {
  return axios.delete("/api/LoaiVaccine/delete-loai-vaccine");
}

//Thêm Loại Vacci 
const themloaivaccine = (id,tenLoai) => {
  return axios.post("/api/LoaiVaccine/create-loai-vaccine", {id,tenLoai});
}

//Lấy Tất cả  Vaccine 

const getAllVaccine = () =>
{
  return axios.get("/api/Vaccine/get-all-vaccine");
}

//Nhà Cung Cấp
const getALLnhaCungCap = () => {
  return axios.get("/api/NhaCungCap/get-all-nha-cung-cap");
}

//Phiếu Xuất
const XUATVaccine = (id,ngayTao) => {
  return axios.post("/api/XuatVaccine/create-xuat-vaccine", {id,ngayTao });
}
const getALLXuatVaccine = () => {
  return axios.get("/api/XuatVaccine/get-all-xuat-vaccine");
}

//Chi Tiết Phiếu Xuất

const CTXuatVaccine = (NgayTao,SoLuong,MaVaccine,MaXuatVaccine) => {
  return axios.post("/api/CTXuatVaccine/create-ct-xuat-vaccine",{NgayTao,SoLuong,MaVaccine,MaXuatVaccine});
}

const getChiTietPhieuXuat = () => {
  return axios.get("/api/CTXuatVaccine/get-all-ct-xuat-vaccine");
}

//THỐNG KÊ THEO PHIẾU NHẬP

const thongkephieunhap = () => {
  return axios.get("/api/CTNhapVaccine/get-ct-nhap-vaccine-report");
}

// Phiếu nhập
const NHAPVaccine = (id,ngayTao,maNhaCungCap) => {
  return axios.post("/api/NhapVaccine/create-nhap-vaccine", {id,ngayTao,maNhaCungCap});
}

const getALLNhapVaccine = () => {
  return axios.get("/api/NhapVaccine/get-all-nhap-vaccine");
}


//Chi tiết phiếu nhập
const getChiTietPhieuNhap = () =>{
  return axios.get("/api/CTNhapVaccine/get-all-ct-nhap-vaccine")
}

  const CTNhapVaccine = (ngayTao,soLuong,maVaccine,maNhapVaccine)=>
  {
    return axios.post("/api/CTNhapVaccine/create-ct-nhap-vaccine",{ngayTao,soLuong,maVaccine,maNhapVaccine});
  }

//Loại tiêm chủng
const getLoaiTCById =(idLoaiTC) =>{
  return axios.get("/api/LoaiTiemChung/get-loai-tiem-chung-by-id",{idLoaiTC});
}

//Gói tiêm theo mã loại
const getALLGoiTiemChungByIdLoaiTC = (maLoaiTiemChung) => {
  return axios.get("/api/GoiTiemChung/get-all-ma-loai-tiem-chung-by-id", {
    params: { id: maLoaiTiemChung }
  });
};

//Lấy list Vaccine theo ID
const getALLVaccineById = (id) => {
  return axios.get("/api/Vaccine/get-vaccine-by-id",{
    params: { id: id }
  });
};

//Gói tiêm chủng
const createGoiTiemChung = (id,moTa,giamGia,maLoaiTiemChung)=>{
  return axios.post("/api/GoiTiemChung/create-goi-tiem-chung",{id,moTa,giamGia,maLoaiTiemChung});
}

//Chi tiết gói tiêm chủng
const createCTGoiTiemChung = (maGoiTiemChung,maVaccine,soLuong) =>{
  return axios.post("/api/CTGoiTiemChung/create-ct-goi-tiem-chung",{maGoiTiemChung,maVaccine,soLuong});
}

//Lấy danh sách chi tiết Goi Tiem Chung theo mã gói tiêm 
const getALLCTGoiTiemChungByMaGoiTiem = (keyId) => {
  return axios.get("/api/CTGoiTiemChung/get-chi-tiet-tiem-chung-by-ma-goi-tiem", {
    params: { keyId: keyId }
  });
};
//Lấy Thông Tin Gói Tiêm Chủng
const getALLGoiTiemChung = () => {
  return axios.get("/api/GoiTiemChung/get-all-goi-tiem-chung");
}
//Tạo thông tin tiêm chủng của khách hàng
const createThongTinTiemChungKhachHang = (ngayDangKy,lanTiem,diaDiemTiem,trangThai,maGoiTiemChung) =>{
  return axios.post("/api/ThongTinTiemChung/create-thong-tin-tiem-chung-khach-hang",{ngayDangKy,lanTiem,diaDiemTiem,trangThai,maGoiTiemChung});
}

const createThongTinTiemChungHoGiaDinh =(ngayDangKy,lanTiem,diaDiemTiem,trangThai,cmnd,tenNguoiDK,maGoiTiemChung,maHoGiaDinh) =>{
  return axios.post("/api/ThongTinTiemChung/create-thong-tin-tiem-chung-gia-dinh",{ngayDangKy,lanTiem,diaDiemTiem,trangThai,cmnd,tenNguoiDK,maGoiTiemChung,maHoGiaDinh});
}

const createHoGiaDinh =(id,tenChuHo) =>{
return axios.post("/api/HoGiaDinh/create-ho-gia-dinh",{id,tenChuHo});
}

//Lay Thong Tin Tiem Chung Khach Hang
const getTTthamKham  = () => {
  return axios.get("/api/ThongTinTiemChung/get-all-thong-tin-tiem-chung");
}

// GET ALL THONG TIN THAM KHAM CUA KHACH HANG
const getTTthamKhamByKhachHang = () => {
  return axios.get(`/api/ThongTinTiemChung/get-all-thong-tin-tiem-chung-khach-hang`);
}
// GET ALL HO GIA DINH
const getTTHoGiaDinh = () => {
  return axios.get(`/api/ThongTinTiemChung/get-all-thong-tin-tiem-chung-gia-dinh`);

}
// GET ALL THONG TIN TIEM CHUNG
const getALLTHONGTINTIEMCHUNG = () => {
  return axios.get(`/api/ThongTinTiemChung/get-all-thong-tin-tiem-chung`);
}

//Lấy thông tin tiêm chủng hộ gia đình
const getThongTinTiemChungGiaDinh = (maHoGiaDinh) =>{
  return axios.get("/api/ThongTinTiemChung/get-all-thong-tin-tiem-chung-gia-dinh",{
    params: { maHoGiaDinh: maHoGiaDinh }
  })
}
export {loginAPI,logoutAPI,changePassword,registerKhachHang,getALLTHONGTINTIEMCHUNG,getLoaiDichVu,getThuoc,CTNhapThuoc,CTNHAPTHIETBIYTE,
  getALLNhapVaccine,CTXuatVaccine,thongkephieunhap,themVaccine,getTTHoGiaDinh,getThongTinTiemChungGiaDinh,getThietBiYTe,NHAPTHIETBIYTE,
  getChiTietPhieuNhap,XUATVaccine,getALLXuatVaccine,getTTthamKhamByKhachHang,getLoaiThuoc,themThuoc,THEMTHUOC,NHAPTHUOC,getllAllNhapThuoc,
  getChiTietPhieuXuat,themloaivaccine, getALLLoaiVaccine,xoaLoaiVaccine,editThongTinKhachHang,getLoaiThietBi,getnhaCungCap,
  getALLVaccineById,getALLnhaCungCap,NHAPVaccine,getAllVaccine,CTNhapVaccine,themloaithietbi,getTTKhachHangAdmin,THEMTHIETBI,
  getLoaiTCById, getALLGoiTiemChungByIdLoaiTC,createGoiTiemChung,createCTGoiTiemChung,getALLKHACHHANG,getThongTinKhachHang,
  getALLCTGoiTiemChungByMaGoiTiem,getALLGoiTiemChung,createThongTinTiemChungKhachHang,createThongTinTiemChungHoGiaDinh,
  createHoGiaDinh,getTTthamKham};