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
import Dashboard from "views/ViewBacsi/Dashboard.js";
import UserPage from "views/ViewBacsi/User.js";                                        
import Lichhen from "views/ViewBacsi/Lichhen/Lichhen.js";                                        

var routes = [
  {
    path: "/dashboard",
    name: "Trang Chủ",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/bacsi",
  },
  {
    path: "/Lịch Hẹn",
    name: "Lịch Hẹn",
    icon: "nc-icon nc-app",
    component: <Lichhen />,
    layout: "/bacsi",
  },
   
  {
    path: "/user-page",
    name: "Trang Cá Nhân",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/bacsi",
  },
  
];
export default routes;
