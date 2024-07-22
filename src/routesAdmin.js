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
import Dashboard from "views/ViewAdmin/Dashboard.js";
import Notifications from "views/ViewAdmin/Notifications.js";
import Icons from "views/ViewAdmin/Icons.js";
import Typography from "views/ViewAdmin/Typography.js";
import TableList from "views/ViewAdmin/Tables.js";
import Maps from "views/ViewAdmin/Map.js";
import UserPage from "views/ViewAdmin/User.js";                                        
import UpgradeToPro from "views/ViewAdmin/Upgrade.js";
import Danhmucloai from "views/ViewAdmin/Danhmucloai/Danhmucloai.js";
import Khachhang from "views/ViewAdmin/Khachhang/Khachhang.js";
import Thuoc from "views/ViewAdmin/Thuoc/Thuoc.js";
import Thietbiyte from "views/ViewAdmin/Thietbiyte/Thietbiyte.js";
import Bacsi from "views/ViewAdmin/Bacsi/Bacsi.js";
import Dichvu from "views/ViewAdmin/Dichvu/Dichvu.js";
import Nhapthuoc from "views/ViewAdmin/Nhapthuoc/Nhapthuoc.js";
import Nhapthietbi from "views/ViewAdmin/Nhapthietbi/Nhapthietbi.js";
import Lichhen from "views/ViewAdmin/Lichhen/Lichhen.js";
import Thongke from "views/ViewAdmin/Thongke/Thongke.js";
import Nhanvien from "views/ViewAdmin/Nhanvien/Nhanvien.js";

// import Test from "views/ViewAdmin/Test/Test.js";

var routes = [
  {
    path: "/dashboard",
    name: "Trang Chủ",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin1",
  },

  {
    path: "/danhmucloai",
    name: "Danh Mục Loại",
    icon: "nc-icon nc-diamond",
    component: <Danhmucloai />,
    layout: "/admin1",
  },
  {
    path: "/nhapthuoc",
    name: "Nhapthuoc",
    icon: "nc-icon nc-app",
    component: <Nhapthuoc />,
    layout: "/admin1",
  },
  {
    path: "/thuoc",
    name: "Thuoc",
    icon: "nc-icon nc-app",
    component: <Thuoc />,
    layout: "/admin1",
  },

  {
    path: "/nhapthietbi",
    name: "Nhapthietbi",
    icon: "nc-icon nc-atom",
    component: <Nhapthietbi />,
    layout: "/admin1",
  },
  {
    path: "/thietbiyte",
    name: "Thietbiyte",
    icon: "nc-icon nc-atom",
    component: <Thietbiyte />,
    layout: "/admin1",
  },
 
  {
    path: "/dichvu",
    name: "Dichvu",
    icon: "nc-icon nc-tap-01",
    component: <Dichvu />,
    layout: "/admin1",
  },

  {
    path: "/bacsi",
    name: "Bacsi",
    icon: "nc-icon nc-user-run",
    component: <Bacsi />,
    layout: "/admin1",
  },
  {
    path: "/thongke",
    name: "Thống Kê",
    icon: "nc-icon nc-bell-55",
    component: <Thongke />,
    layout: "/admin1",
  },
  {
    path: "/khachhang",
    name: "Khachhang",
    icon: "nc-icon nc-satisfied",
    component: <Khachhang />,
    layout: "/admin1",
  },
  {
    path: "/nhanvien",
    name: "Nhân Viên",
    icon: "nc-icon nc-satisfied",
    component: <Nhanvien/>,
    layout: "/admin1",
  },
  {
    path: "/lichhen",
    name: "Lịch Hẹn",
    icon: "nc-icon nc-pin-3",
    component: <Lichhen />,
    layout: "/admin1",
  },
  {
    path: "/user-page",
    name: "Trang Cá Nhân",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/admin1",
  },
 
];
export default routes;
