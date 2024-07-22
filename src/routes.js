/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/ViewUser/Dashboard.js";
import UserPage from "views/ViewUser/User.js";        
import Dichvu from "views/ViewUser/Dichvu/Dichvu.js";                                
import Chuyenkhoa from "views/ViewUser/Chuyenkhoa/Chuyenkhoa.js";       
import Datlich from "views/ViewUser/Datlich/Datlich.js";
import Lichhen from "views/ViewUser/Lichhen/Lichhen.js";
import Ketquadichvu from "views/ViewUser/Ketquadichvu/Ketquadichvu.js";
import Kiemtrathanhtoan from "views/ViewUser/Kiemtrathanhtoan/Kiemtrathanhtoan.js";
import Thanhtoanthanhcong from "views/ViewUser/Kiemtrathanhtoan/Thanhtoanthanhcong.js";
import Loaithietbi from "views/ViewUser/ThuocThietBi/Loaithietbi.js";
import LoaiThuoc from "views/ViewUser/ThuocThietBi/LoaiThuoc.js";
import MuaThuocThietBi from "views/ViewUser/ThuocThietBi/MuaThuocTB.js";
import DanhSachThuoc from "views/ViewUser/ThuocThietBi/DanhSachThuoc.js";
import DanhSachThietBi from "views/ViewUser/ThuocThietBi/DanhSachThietBi.js";
import GioHang from "views/ViewUser/ThuocThietBi/GioHang.js";

import DanhSachHoaDon from "views/ViewUser/ThuocThietBi/DanhSachHoaDon.js";
import ThanhToanTTBThatBai from "views/ViewUser/ThuocThietBi/ThanhToanTTBThatBai.js";
import ThanhToanTTBThanhCong from "views/ViewUser/ThuocThietBi/ThanhToanTTBThanhCong.js";

import TimKiem from "views/ViewUser/Timkiem/Timkiem.js";
var routes = [
  {
    path: "/dashboard",
    name: "Trang Chủ",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/khachhang",
  },

  {
    path: "/lichhen",
    name: "Lịch Hẹn",
    icon: "nc-icon nc-ambulance",
    component: <Lichhen />,
    layout: "/khachhang",
  },
  {
    path: "/ketquadichvu",
    name: "Kết Quả Dịch Vụ",
    icon: "nc-icon nc-atom",
    component: <Ketquadichvu />,
    layout: "/khachhang",
  },
  {
    name: "Test 1",
    path: "/dichvu/:loaiDichVuId",
    component: <Dichvu />,
    layout: "/khachhang",
  },
  {
    name: "Test 2",
    path: "/chuyenkhoa/:chuyenKhoaId",
    component: <Chuyenkhoa />,
    layout: "/khachhang",
  },
  {
    name: "Test 3",
    path: "/datlich/:serviceId",
    component: <Datlich />,
    layout: "/khachhang",
  },
  {
    name: "Test 6",
    path: "/loaithietbi/:idLoaiThietBi",
    component: <Loaithietbi />,
    layout: "/khachhang",
  },
  {
    name: "Test 6",
    path: "/loaithuoc/:idLoaiThuoc",
    component: <LoaiThuoc />,
    layout: "/khachhang",
  },
  {
    name: "Test 4",
    path: "/kiemtrathanhtoan",
    component: <Kiemtrathanhtoan />,
    layout: "/khachhang",
  },
  {
    name: "Test 5",
    path: "/thanhtoanthanhcong",
    component: <Thanhtoanthanhcong />,
    layout: "/khachhang",
  },
  {
    icon: "nc-icon nc-badge",
    name: "Mua thuốc & thiết bị",
    path: "/muathuocthietbi",
    component: <MuaThuocThietBi />,
    layout: "/khachhang",
  },
  {
    name: "DSThuoc",
    path: "/danhsachthuoc",
    component: <DanhSachThuoc />,
    layout: "/khachhang",
  },
  {
    name: "Danh sách thiết bị y tế",
    path: "/danhsachthietbiyte",
    component: <DanhSachThietBi />,
    layout: "/khachhang",
  },
  {
    name: "GioHang",
    path: "/giohang",
    component: <GioHang />,
    layout: "/khachhang",
  },

  {
    icon: "nc-icon  nc-bank",
    name: "Hóa đơn mua",
    path: "/danh-sach-hoa-don",
    component: <DanhSachHoaDon />,
    layout: "/khachhang",
  },
  {
    name: "Kết quả thanh toán",
    path: "/thanh-toan-thanh-cong",
    component: <ThanhToanTTBThanhCong />,
    layout: "/khachhang",
  },
  {
    name: "Kết quả thanh toán",
    path: "/thanh-toan-that-bai",
    component: <ThanhToanTTBThatBai />,
    layout: "/khachhang",
  },
  {
    path: "/user-page",
    name: "Trang Cá Nhân",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/khachhang",
  },
  {
    name: "Tìm kiếm",
    path: "/search",
    component: <TimKiem />,
    layout: "/khachhang",
  },
];
export default routes;