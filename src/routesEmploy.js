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
import Dashboard from "views/ViewEmploy/Dashboard.js";
import UserPage from "views/ViewEmploy/User.js";                                        
import Lichhen from "views/ViewEmploy/Lichhen/Lichhen.js";                                        
import Danhgia from "views/ViewEmploy/Danhgia/Danhgia.js";                                        

var routes = [
  {
    path: "/dashboard",
    name: "Trang Chủ",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/employ",
  },
  {
    path: "/Lịch Hẹn",
    name: "Lịch Hẹn",
    icon: "nc-icon nc-badge",
    component: <Lichhen />,
    layout: "/employ",
  },
  {
    path: "/Đánh giá",
    name: "Đánh giá",
    icon: "nc-icon nc-bold",
    component: <Danhgia />,
    layout: "/employ",
  },
   
  {
    path: "/user-page",
    name: "Trang Cá Nhân",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/employ",
  },
  
];
export default routes;
