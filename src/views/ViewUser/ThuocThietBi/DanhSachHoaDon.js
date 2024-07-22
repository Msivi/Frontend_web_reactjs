import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardTitle, Row, Col, Modal, ModalHeader, ModalBody, Spinner } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DanhSachHoaDon.css';

const BASE_URL = 'http://localhost:5199';

const DanhSachHoaDon = () => {
  const [orders, setOrders] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addressName, setAddressName] = useState('');
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchOrders(currentUserId);
    }
  }, [currentUserId]);

  const getCurrentUserId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/KhachHang/get-tt-khach-hang`);
      const maKhachHang = response.data.maKhachHang;
      setCurrentUserId(maKhachHang);
    } catch (error) {
      console.error('Failed to fetch current user ID:', error);
    }
  };

  const fetchOrders = async (maKhachHang) => {
    try {
      const ordersResponse = await axios.get(`${BASE_URL}/api/HoaDon/get-all-hoa-don`);
      const filteredOrders = ordersResponse.data
        .filter(order => order.maKhachHang === maKhachHang && order.trangThai === 'True')
        .sort((a, b) => new Date(b.ngayMua) - new Date(a.ngayMua));

      const ordersWithProductImage = await Promise.all(filteredOrders.map(async (order) => {
        const productsResponse = await axios.get(`${BASE_URL}/api/HoaDon/get-all-sp-by-ma-hd?maHD=${order.id}`);
        const firstProduct = productsResponse.data[0];
        if (firstProduct) {
          order.firstProductImage = `${BASE_URL}${firstProduct.hinhAnh}`;
        }
        return order;
      }));

      setOrders(ordersWithProductImage);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/HoaDon/get-all-sp-by-ma-hd?maHD=${orderId}`);
      const items = response.data;

      setOrderDetails(items);

      const total = items.reduce((sum, item) => sum + item.thanhTien, 0);
      setTotalPrice(total);

      const invoiceResponse = await axios.get(`${BASE_URL}/api/HoaDon/get-hoa-don-by-id?maHoaDon=${orderId}`);
      if (invoiceResponse.status === 200 && invoiceResponse.data.diaChi) {
        const invoiceDetails = invoiceResponse.data;
        setNote(invoiceDetails.ghiChu);
        const addressResponse = await axios.get(`${BASE_URL}/api/DiaChi/get-dia-chi-by-id?id=${invoiceDetails.diaChi}`);
        if (addressResponse.status === 200) {
          setAddressName(addressResponse.data.tenDiaChi);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderDetails([]);
    setTotalPrice(0);
    setAddressName('');
    setNote('');
  };

  return (
    <div className="container mt-5">
      <h2>Danh Sách Hóa Đơn Đã Thanh Toán</h2>
      <Row>
        {orders.map(order => (
          <Col md="12" key={order.id} className="mb-4">
            <Card className="order-card" onClick={() => handleOrderClick(order)}>
              <Row className="align-items-center">
                {order.firstProductImage && (
                  <Col md="2">
                    <img src={order.firstProductImage} alt="First product" className="product-image"/>
                  </Col>
                )}
                <Col md="10">
                  <CardBody>
                    <CardTitle>Mã hóa đơn: {order.id}</CardTitle>
                    <p>Tổng tiền: {order.tongTien.toLocaleString('vi-VN')} đ</p>
                    <p>Ngày mua: {new Date(order.ngayMua).toLocaleString('vi-VN')}</p>
                  </CardBody>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedOrder && (
        <Modal isOpen={!!selectedOrder} toggle={closeModal} size="">
          <ModalHeader toggle={closeModal}>Chi Tiết Hóa Đơn {selectedOrder.id}</ModalHeader>
          <ModalBody>
            {loading ? (
              <div className="loading-container">
                <Spinner />
                <p>Loading...</p>
              </div>
            ) : (
              <div>
                <Row>
                  {orderDetails.map(item => (
                    <Col md="12" key={item.maSanPham} className="mb-4">
                      <Card className="item-card1">
                        <Row className="align-items-center">
                          {item.hinhAnh && (
                            <Col md="4">
                              <img src={`${BASE_URL}${item.hinhAnh}`} alt={item.tenSanPham} className="item-image1"/>
                            </Col>
                          )}
                          <Col md="8">
                            <CardBody>
                              <CardTitle style={{fontSize:20}}>{item.tenSanPham}</CardTitle>
                              <p>Đơn giá: {item.donGia.toLocaleString('vi-VN')} đ</p>
                              <p>Số lượng: {item.soLuong}</p>
                              <p>Thành tiền: {item.thanhTien.toLocaleString('vi-VN')} đ</p>
                            </CardBody>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <div className="footer1">
                  <p style={{fontSize:20}}>Mã hóa đơn: {selectedOrder.id}</p>
                  <p style={{fontSize:20}}>Địa chỉ giao: {addressName}</p>
                  {note && <p style={{fontSize:20}}>Ghi chú: {note}</p>}
                  <p style={{fontSize:20}} className="total-price1">Tổng tiền: {totalPrice.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>
            )}
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};

export default DanhSachHoaDon;
