import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardImg, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from "reactstrap";
import bannerThuoc from "assets/img/yte1.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import "./MuaThuocTB.css";
import { toast, ToastContainer } from "react-toastify";
import TBYT1 from "assets/img/iconTBYT1.png";
import TBYT2 from "assets/img/iconTBYT2.png";
import TBYT3 from "assets/img/iconTBYT3.png";
import TBYT4 from "assets/img/iconTBYT4.png";
import TBYT5 from "assets/img/iconTBYT5.png";
import TBYT6 from "assets/img/iconTBYT6.png";
import TBYT7 from "assets/img/iconTBYT7.png";
import TBYT8 from "assets/img/iconTBYT8.png";
import TBYT9 from "assets/img/iconTBYT9.png";
import TBYT10 from "assets/img/iconTBYT10.png";
import t1 from "assets/img/t1.png";
import t2 from "assets/img/t2.png";
import t3 from "assets/img/t3.png";
import t4 from "assets/img/t4.png";
import t5 from "assets/img/t5.png";
import t6 from "assets/img/t6.png";
import t7 from "assets/img/t7.png";
import t8 from "assets/img/t8.png";
import t9 from "assets/img/t9.png";
import t10 from "assets/img/t10.png";

const LoaiThietBiIcons = {
  "Thiết bị đo huyết áp": TBYT1,
  "Thiết bị đo đường huyết": TBYT2,
  "Thiết bị đo nhiệt độ": TBYT3,
  "Máy tạo oxy": TBYT4,
  "Máy đo nhịp tim": TBYT5,
  "Thiết bị siêu âm": TBYT6,
  "Thiết bị nội soi": TBYT7,
  "Máy ECG (điện tim)": TBYT8,
  "Máy xông khí dung": TBYT9,
  "Thiết bị đo nồng độ oxy trong máu": TBYT10,
};

const LoaiThuocIcons = {
  "Thuốc giảm đau": t1,
  "Thuốc kháng sinh": t2,
  "Thuốc kháng viêm": t3,
  "Thuốc điều trị tiểu đường": t4,
  "Thuốc điều trị cao huyết áp": t5,
  "Thuốc trị bệnh da liễu": t6,
  "Thuốc điều trị mắt": t7,
  "Thuốc bổ sung vitamin": t8,
  "Thuốc an thần": t9,
  "Thuốc chống dị ứng": t10,
};

function MainPage() {
  const [thuoc, setThuoc] = useState([]);
  const [thietBi, setThietBi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [medicineTypes, setMedicineTypes] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await axios.get("http://localhost:5199/api/KhachHang/get-tt-khach-hang");
        const customerId = customerResponse.data.maKhachHang;
        setCustomerId(customerId);

        const thuocResponse = await axios.get("http://localhost:5199/api/Thuoc/get-all-thuoc");
        setThuoc(thuocResponse.data.slice(0, 4));

        const thietBiResponse = await axios.get("http://localhost:5199/api/ThietBiYTe/get-all-thiet-bi-y-te");
        setThietBi(thietBiResponse.data.slice(0, 4));

        const deviceTypesResponse = await axios.get("http://localhost:5199/api/LoaiThietBi/get-all-loai-thiet-bi");
        setDeviceTypes(deviceTypesResponse.data);

        const medicineTypesResponse = await axios.get("http://localhost:5199/api/LoaiThuoc/get-all-loai-thuoc");
        setMedicineTypes(medicineTypesResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (customerId) {
      const savedCartItems = localStorage.getItem(`cart-${customerId}`);
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
    } else {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
    }
  }, [customerId]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (customerId) {
        const savedCartItems = localStorage.getItem(`cart-${customerId}`);
        if (savedCartItems) {
          setCartItems(JSON.parse(savedCartItems));
        }
      } else {
        const savedCartItems = localStorage.getItem('cartItems');
        if (savedCartItems) {
          setCartItems(JSON.parse(savedCartItems));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [customerId]);

  const handleAddToCart = (item, qty = 1) => {
    setCartItems(prevItems => {
      const itemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      let updatedItems;

      if (itemIndex > -1) {
        const existingItem = prevItems[itemIndex];
        if (existingItem.quantity + qty > item.soLuong) {
          toast.error("Số lượng trong giỏ hàng vượt quá số lượng tồn kho");
          return prevItems;
        } else {
          updatedItems = prevItems.map(cartItem =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + qty } : cartItem
          );
        }
      } else {
        if (qty > item.soLuong) {
          toast.error("Số lượng trong giỏ hàng vượt quá số lượng tồn kho");
          return prevItems;
        } else {
          updatedItems = [...prevItems, { ...item, quantity: qty }];
        }
      }

      const storedCart = customerId ? `cart-${customerId}` : 'cartItems';
      localStorage.setItem(storedCart, JSON.stringify(updatedItems));
      toast.success("Thêm vào giỏ hàng thành công");
      return updatedItems;
    });
  };

  const handleItemDetail = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };
  const handleMedicineTypeClick = (id) => {
    navigate(`/Khachhang/loaithuoc/${id}`);
  };
  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, Math.min(selectedItem.soLuong, e.target.value)));
  };
  const handleDeviceTypeClick = (id) => {
    navigate(`/Khachhang/loaithietbi/${id}`);
  };
  const handleBuyNow = () => {
    handleAddToCart(selectedItem, quantity);
    navigate('/khachhang/giohang');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="banner">
        <img src={bannerThuoc} alt="Banner" />
        <h2>Nền tảng y tế - Sức khoẻ Toàn diện</h2>
      </div>

      <h3 style={{ textAlign: "left", marginTop: "20px" }}>Thuốc</h3>
      <div className="row-equal-height">
        {thuoc.map(item => (
          <div className="col-equal-height1" key={item.id}>
            <Card className="card1">
              <CardImg
                top
                className="card-img-top1"
                style={{ height: 150 }}
                src={
                  item.hinhAnh.startsWith("/")
                    ? `http://localhost:5199${item.hinhAnh}`
                    : item.hinhAnh
                }
                alt={item.tenThuoc}
                onClick={() => handleItemDetail(item)}
              />
              <CardBody className="card-body1" onClick={() => handleItemDetail(item)}>
                <CardTitle className="card-title1">{item.tenThuoc}</CardTitle>
                <p><strong style={{ marginLeft: -23 }}>{item.donGia.toLocaleString()}₫ / {item.donViTinh}</strong></p>
                {item.soLuong > 0 ? (
                  <Button style={{color:"white", fontSize:12, backgroundColor:"#8889FF"}} color="primary" onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}>Thêm vào giỏ hàng</Button>
                ) : (
                  <Button style={{color:"white", fontSize:12, backgroundColor:"#8889FF"}} color="secondary" disabled>Hết hàng</Button>
                )}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button style={{ backgroundColor: "cadetblue", color: "#fff" }} className="button-primary2" onClick={() => navigate('/khachhang/danhsachthuoc')}>Xem thêm</Button>
      </div>

      <h3 style={{ textAlign: "left", marginTop: "40px" }}>Thiết bị y tế</h3>
      <div className="row-equal-height">
        {thietBi.map(item => (
          <div className="col-equal-height" key={item.id}>
            <Card className="card1">
              <CardImg
                top
                className="card-img-top1"
                style={{ height: 150 }}
                src={
                  item.hinhAnh.startsWith("/")
                    ? `http://localhost:5199${item.hinhAnh}`
                    : item.hinhAnh
                }
                alt={item.tenThietBiYTe}
                onClick={() => handleItemDetail(item)}
              />
              <CardBody className="card-body1" onClick={() => handleItemDetail(item)}>
                <CardTitle className="card-title1">{item.tenThietBiYTe}</CardTitle>
                <p><strong style={{ marginLeft: -23 }}>{item.donGia.toLocaleString()}₫</strong></p>
                {item.soLuong > 0 ? (
                  <Button style={{color:"white", fontSize:12, backgroundColor:"#8889FF"}} color="primary" onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}>Thêm vào giỏ hàng</Button>
                ) : (
                  <Button style={{color:"white", fontSize:12, backgroundColor:"#8889FF"}} color="secondary" disabled>Hết hàng</Button>
                )}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button style={{ backgroundColor: "cadetblue", color: "#fff" }} className="button-primary2" onClick={() => navigate('/khachhang/danhsachthietbiyte')}>Xem thêm</Button>
      </div>

      <h3 style={{ margin: "20px 0" }}>Loại Thiết Bị</h3>
      <Row>
        {deviceTypes.map(deviceType => (
          <Col lg="3" md="6" sm="6" key={deviceType.id}>
            <Card className="device-type-card" onClick={() => handleDeviceTypeClick(deviceType.id)}>
              <CardBody className="d-flex align-items-center">
                <div className="device-icon">
                  <img style={{ width: 50 }} src={LoaiThietBiIcons[deviceType.tenLoaiThietBi]} alt="icon" />
                </div>
                <div className="device-type-name">
                  {deviceType.tenLoaiThietBi}
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 style={{ margin: "20px 0" }}>Loại Thuốc</h3>
      <Row>
        {medicineTypes.map(medicineType => (
          <Col lg="3" md="6" sm="6" key={medicineType.id}>
            <Card className="medicine-type-card" onClick={() => handleMedicineTypeClick(medicineType.id)}>
              <CardBody className="d-flex align-items-center">
                <div className="medicine-icon">
                  <img style={{ width: 50 }} src={LoaiThuocIcons[medicineType.tenLoaiThuoc]} alt="icon" />
                </div>
                <div className="medicine-type-name">
                  {medicineType.tenLoaiThuoc}
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="cart-icon" onClick={() => navigate('/khachhang/giohang')}>
        <FontAwesomeIcon icon={faShoppingCart} size="2x" />
        {cartItems.length > 0 && (
          <span className="cart-count">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
        )}
      </div>

      {selectedItem && (
        <Modal isOpen={!!selectedItem} toggle={() => setSelectedItem(null)}>
          <ModalHeader toggle={() => setSelectedItem(null)}>Chi Tiết Sản Phẩm</ModalHeader>
          <ModalBody>
            <img src={`${selectedItem.hinhAnh.startsWith("/") ? `http://localhost:5199${selectedItem.hinhAnh}` : selectedItem.hinhAnh}`} alt={selectedItem.tenThuoc || selectedItem.tenThietBiYTe} style={{ width: '100%' }} />
            <h5>{selectedItem.tenThuoc || selectedItem.tenThietBiYTe}</h5>
            <p>Giá: {selectedItem.donGia.toLocaleString('vi-VN')} ₫</p>
            <p>Mô tả: {selectedItem.moTa}</p>
            <p>Đơn vị tính: {selectedItem.donViTinh}</p>
            <p>Số lượng tồn kho: {selectedItem.soLuong}</p>
            <FormGroup>
              <Label for="quantity">Số lượng:</Label>
              <Input type="number" id="quantity" value={quantity} onChange={handleQuantityChange} min="1" max={selectedItem.soLuong} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {selectedItem.soLuong > 0 ? (
              <>
                <Button color="primary" onClick={() => handleAddToCart(selectedItem, quantity)}>Thêm vào giỏ hàng</Button>
                <Button color="success" onClick={handleBuyNow}>Mua ngay</Button>
              </>
            ) : (
              <Button color="secondary" disabled>Hết hàng</Button>
            )}
            <Button color="secondary" onClick={() => setSelectedItem(null)}>Đóng</Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

export default MainPage;
