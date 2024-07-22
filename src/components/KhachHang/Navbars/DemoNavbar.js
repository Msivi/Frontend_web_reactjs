import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
} from "reactstrap";
import {jwtDecode} from 'jwt-decode'; // Fix import
import { logoutAPI } from "assets/serviceAPI/userService";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import routes from "routes.js";

function Header(props) {
  const navigate = useNavigate();
  const location1 = useLocation();
  const token = localStorage.getItem("data");
  let unique_name = "unique_name";

  if (token) {
    const decodedToken = jwtDecode(token);
    unique_name = decodedToken.unique_name;
  }
  
  const handleLogout = async () => {
    try {
      localStorage.removeItem("data");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("unique_name");
      navigate("/public/login", { replace: true });
      window.location.reload();
      toast.success("Đăng Xuất Thành Công");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      toast.error("Đăng xuất không thành công");
    }
  };
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const location = useLocation();
  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };
  
  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const getBrand = () => {
    let brandName = "Trang khách hàng";
    routes.forEach((prop) => {
      if (location.pathname.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
    });
    return brandName;
  };
  
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };
  
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  };
  
  React.useEffect(() => {
    window.addEventListener("resize", updateColor.bind(this));
  });
  
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);

  const handleSearchClick = () => {
    navigate('/khachhang/search'); // Thay thế '/search' bằng đường dẫn tới trang tìm kiếm của bạn
  };

  return (
    <Navbar
      color={
location.pathname.indexOf("full-screen-maps") !== -1 ? "dark" : color
      }
      expand="lg"
      className={
        location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand onClick={(e) => e.preventDefault()}>{getBrand()}</NavbarBrand>
        </div>
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <form>
            <InputGroup style={{cursor:"pointer"}} className="no-border" onClick={handleSearchClick}>
              <Input style={{cursor:"pointer"}} placeholder="Search..." />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <i className="nc-icon nc-zoom-split" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </form>
          <Nav navbar>
            {routes.map((prop, key) => {
              // Điều kiện để ẩn các mục không cần thiết
              if (prop.name !== "Test 1" && prop.name !== "Test 2" && prop.name !== "Test 3" && prop.name !== "Test 4" && prop.name !== "Test 5" && 
                prop.name !== "Test 6"&& prop.name !== "DSThuoc"&& prop.name !== "GioHang"&& prop.name !== "Kết quả thanh toán"&& prop.name !== "Danh sách thiết bị y tế" ) {
                return (
                  <NavItem key={key}>
                    <NavLink to={prop.layout + prop.path} className="nav-link">
                      <i className={prop.icon} />
                      <p>{prop.name}</p>
                    </NavLink>
                  </NavItem>
                );
              }
              return null; // Trả về null để không render các mục không cần thiết
            })}
            <Dropdown nav isOpen={dropdownOpen} toggle={dropdownToggle}>
              <DropdownToggle caret nav>
                <i className="nc-icon nc-settings-gear-65" />
                <p>
                  <span className="d-lg-none d-md-block">Some Actions</span>
                </p>
              </DropdownToggle>
              <DropdownMenu right>
<DropdownItem tag="a" onClick={handleLogout}>Đăng Xuất</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;