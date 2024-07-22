import React from "react";

import PerfectScrollbar from "perfect-scrollbar";
import { Route, Routes, useLocation } from "react-router-dom";
import DemoNavbar from "components/KhachHang/Navbars/DemoNavbar.js";
import Footer from "components/KhachHang/Footer/Footer.js";
import Sidebar from "components/KhachHang/Sidebar/Sidebar.js";
import routes from "routes.js";

var ps;

function Dashboard(props) {
  const [backgroundColor, setBackgroundColor] = React.useState("black");
  const [activeColor, setActiveColor] = React.useState("info");
  const mainPanel = React.useRef();
  const location = useLocation();
  
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on-khachhang");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on-khachhang");
      }
    };
  });

  React.useEffect(() => {
    mainPanel.current.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);

  const handleActiveClick = (color) => {
    setActiveColor(color);
  };
  
  const handleBgClick = (color) => {
    setBackgroundColor(color);
  };

  return (
    <div  className="wrapper">
      <div className="main-panel-khachhang" ref={mainPanel}>
        <DemoNavbar {...props} />
        <Routes>
          {routes.map((prop, key) => {
            return (
              <Route path={prop.path} element={prop.component} key={key} exact />
            );
          })}
        </Routes>
        <Footer fluid />
      </div>
    </div>
  );
}

export default Dashboard;
