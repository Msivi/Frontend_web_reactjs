import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardImg, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from "react-toastify";
import "./DanhSachThuoc.css";
import bannerThuoc from "assets/img/yte1.jpg";
import { useNavigate } from "react-router-dom";

function MedicineList() {
  const [thuoc, setThuoc] = useState([]);
  const [filteredThuoc, setFilteredThuoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5199/api/Thuoc/get-all-thuoc")
      .then(response => {
        setThuoc(response.data);
        setFilteredThuoc(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });

      const fetchCustomerId = async () => {
        const response = await axios.get("http://localhost:5199/api/KhachHang/get-tt-khach-hang");
        const maKhachHang = response.data.maKhachHang;
        setCustomerId(maKhachHang);
      };
  
      fetchCustomerId();
    }, []);
  
    useEffect(() => {
      const savedCartItems = localStorage.getItem(customerId ? `cart-${customerId}` : 'cartItems');
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
  
      const handleStorageChange = () => {
        const savedCartItems = localStorage.getItem(customerId ? `cart-${customerId}` : 'cartItems');
        if (savedCartItems) {
          setCartItems(JSON.parse(savedCartItems));
        }
      };
  
      window.addEventListener('storage', handleStorageChange);
     
    }, [customerId]);

  const handleSearch = (event) => {
    const key = event.target.value.toLowerCase();
    setSearchKey(key);
    const filtered = thuoc.filter(item =>
      item.tenThuoc.toLowerCase().includes(key) ||
      item.donViTinh.toLowerCase().includes(key) ||
      (item.moTa && item.moTa.toLowerCase().includes(key))
    );
    setFilteredThuoc(filtered);
  };

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

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, Math.min(selectedItem.soLuong, e.target.value)));
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
      <Input 
        type="text" 
        placeholder="Search..." 
        value={searchKey} 
        onChange={handleSearch} 
        className="input-search1"
      />
      <div className="row-equal-height4">
        {filteredThuoc.map(item => (
          <div className="col-equal-height4" key={item.id}>
            <Card className="card4">
              <CardImg
                top
                className="card-img-top4"
                style={{ height: 150 }}
                src={
                  item.hinhAnh.startsWith("/")
                    ? `http://localhost:5199${item.hinhAnh}`
                    : item.hinhAnh
                }
                alt={item.tenThuoc}
                onClick={() => handleItemDetail(item)}
              />
              <CardBody className="card-body4" onClick={() => handleItemDetail(item)}>
                <CardTitle className="card-title4">{item.tenThuoc}</CardTitle>
                <p><strong>{item.donGia.toLocaleString()}₫ / {item.donViTinh}</strong></p>
                {item.soLuong > 0 ? (
                  <Button style={{ color: "white", fontSize: 12, backgroundColor: "#8889FF" }} color="primary" onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}>Thêm vào giỏ hàng</Button>
                ) : (
                  <Button style={{ color: "white", fontSize: 12, backgroundColor: "#8889FF" }} color="secondary" disabled>Hết hàng</Button>
                )}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
      <div className="cart-icon1" onClick={() => navigate('/khachhang/giohang')}>
        <FontAwesomeIcon icon={faShoppingCart} size="2x" />
        {cartItems.length > 0 && (
          <span className="cart-count1">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
        )}
      </div>

      {selectedItem && (
  <Modal isOpen={!!selectedItem} toggle={() => setSelectedItem(null)}>
    <ModalHeader toggle={() => setSelectedItem(null)}>Chi Tiết Sản Phẩm</ModalHeader>
    <ModalBody>
      <img src={`${selectedItem.hinhAnh.startsWith("/") ? `http://localhost:5199${selectedItem.hinhAnh}` : selectedItem.hinhAnh}`} alt={selectedItem.tenThuoc} style={{ width: '100%' }} />
      <h5>{selectedItem.tenThuoc}</h5>
      <p>Giá: {selectedItem.donGia.toLocaleString('vi-VN')} ₫</p>
      <p>Mô tả: {selectedItem.moTa}</p>
      <p>Đơn vị tính: {selectedItem.donViTinh}</p>
      <p>Số lượng tồn kho: {selectedItem.soLuong}</p>
      <FormGroup>
        <Label for="quantity">Số lượng:</Label>
        <Input type="number" id="quantity" value={quantity} onChange={handleQuantityChange} min="1" max={selectedItem.soLuong} />
      </FormGroup>
    </ModalBody> {/* Thêm thẻ đóng ModalBody */}
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

      <ToastContainer />
    </div>
  );
}

export default MedicineList;
