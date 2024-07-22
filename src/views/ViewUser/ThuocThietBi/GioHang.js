import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardImg, CardTitle, Input, Row, Col, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Form } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./GioHang.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = 'http://localhost:5199';

const CartPage = ({ updateCart }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [customerId, setCustomerId] = useState(null);
    const navigate = useNavigate();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [previousAddresses, setPreviousAddresses] = useState([]);

    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [note, setNote] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
      province: '',
      district: '',
      ward: '',
      specificAddress: ''
    });

    useEffect(() => {
        const initializeCart = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/api/KhachHang/get-tt-khach-hang`);
            const maKhachHang = response.data.maKhachHang;
            setCustomerId(maKhachHang);
            const storedCart = localStorage.getItem(`cart-${maKhachHang}`);

            const addressesResponse = await axios.get(`${BASE_URL}/api/DiaChi/get-all-dia-chi`);
            setPreviousAddresses(addressesResponse.data);

            if (addressesResponse.data.length > 0) {
              setSelectedAddressId(addressesResponse.data[0].id);
            }

            if (storedCart) {
              setCartItems(JSON.parse(storedCart));
            }
          } catch (error) {
            console.error('Error fetching customer data:', error);
          }
        };

        initializeCart();
    }, []);

    useEffect(() => {
        axios.get('https://api.npoint.io/ac646cb54b295b9555be')
          .then(response => {
            const hcmCity = response.data.filter(province => province.Name === "TP HCM");
            setProvinces(hcmCity);
          })
          .catch(error => {
            console.error("Error fetching provinces:", error);
          });
    }, []);

    useEffect(() => {
        const calculateTotal = () => {
          const totalAmount = cartItems.reduce((acc, item) => acc + item.donGia * item.quantity, 0);
          setTotal(totalAmount);
        };

        if (customerId) {
          localStorage.setItem(`cart-${customerId}`, JSON.stringify(cartItems));
        }
        calculateTotal();
    }, [cartItems, customerId]);

    const handleQuantityChange = (id, delta) => {
        const updatedCart = cartItems.map(item =>
          item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.soLuong, item.quantity + delta)) } : item
        );
        setCartItems(updatedCart);
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        const selectedProvinceName = e.target.options[e.target.selectedIndex].text;
        setSelectedProvince(selectedProvinceName);
        setNewAddress(prev => ({ ...prev, province: selectedProvinceName }));

        axios.get('https://api.npoint.io/34608ea16bebc5cffd42')
          .then(response => {
            const filteredDistricts = response.data.filter(district => district.ProvinceId === parseInt(provinceCode));
            setDistricts(filteredDistricts);
            setWards([]);
            setSelectedDistrict('');
            setSelectedWard('');
            updateDiaDiem(selectedProvinceName, '', '');
          })
          .catch(error => {
            console.error("Error fetching districts:", error);
          });
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        const selectedDistrictName = e.target.options[e.target.selectedIndex].text;
        setSelectedDistrict(selectedDistrictName);
        setNewAddress(prev => ({ ...prev, district: selectedDistrictName }));

        axios.get('https://api.npoint.io/dd278dc276e65c68cdf5')
          .then(response => {
            const filteredWards = response.data.filter(ward => ward.DistrictId === parseInt(districtCode));
            setWards(filteredWards);
            setSelectedWard('');
            updateDiaDiem(selectedProvince, selectedDistrictName, '');
          })
          .catch(error => {
            console.error("Error fetching wards:", error);
          });
    };

    const handleWardChange = (e) => {
        const wardName = e.target.value;
        setSelectedWard(wardName);
        setNewAddress(prev => ({ ...prev, ward: wardName }));
        updateDiaDiem(selectedProvince, selectedDistrict, wardName);
    };

    const updateDiaDiem = (province, district, ward) => {
        const diaDiem = `${province} ${district} ${ward}`.trim();
    };

    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    const saveNewAddress = async () => {
        const fullAddress = `${newAddress.province} ${newAddress.district} ${newAddress.ward} ${newAddress.specificAddress}`.trim();
        try {
          await axios.post(`${BASE_URL}/api/DiaChi/create-dia-chi`, {
            tenDiaChi: fullAddress
          });

          const addressesResponse = await axios.get(`${BASE_URL}/api/DiaChi/get-all-dia-chi`);
          setPreviousAddresses(addressesResponse.data);
          if (addressesResponse.data.length > 0) {
            setSelectedAddressId(addressesResponse.data[0].id);
          }
          toggleModal();
        } catch (error) {
          console.error("Error saving new address:", error);
        }
    };

    const handleAddressChange = (e) => {
        setSelectedAddressId(e.target.value);
    };

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    const handlePayment = async (maHoaDon) => {
        try {
            let url = `${BASE_URL}/api/ThanhToanThuocThietBi/thanh-toan-by-id-hoa-don`;

            const params = new URLSearchParams();
            if (selectedAddressId) {
                params.append('maDiaChi', selectedAddressId);
            }
            if (note && note.trim() !== '') {
                params.append('ghiChu', note);
            }

            const paymentResponse = await axios.post(url + (params.toString() ? `?${params.toString()}` : ''), [maHoaDon], {
                headers: {
                  'Content-Type': 'application/json'
                }
            });
            const paymentUrl = paymentResponse.data.url.result;
            if (paymentUrl) {
                window.location.href = paymentUrl;
            }
        } catch (error) {
            console.error('Checkout error:', error.response || error);
            alert('An error occurred during the payment process. Please try again.');
        }
    };

    const createChiTietMua = async (maHoaDon) => {
        try {
            for (const item of cartItems) {
                const data = {
                    maHoaDon,
                    soLuong: item.quantity
                };
                console.log(data);
                console.log(item.id);
                if (item.tenThuoc) {
                    data.maThuoc = item.id;
                    await axios.post(`${BASE_URL}/api/CTMuaThuoc/create-ct-mua-thuoc`, data);
                } else if (item.tenThietBiYTe) {
                    data.maThietBiYTe = item.id;
                    await axios.post(`${BASE_URL}/api/CTMuaThietBiYTe/create-ct-mua-thiet-bi-y-te`, data);
                }
            }
        } catch (error) {
            console.error('Failed to create purchase details:', error);
            alert('Failed to add items to the invoice.');
        }
    };

    const handleCheckout = async () => {
        try {
            const createHoaDonResponse = await axios.post(`${BASE_URL}/api/HoaDon/create-hoa-don`, {
                diaChi: selectedAddressId,
                ghiChu: note,
                tongTien: total
            });
            const maHoaDon = parseInt(createHoaDonResponse.data.data, 10);

            await createChiTietMua(maHoaDon);

            await handlePayment(maHoaDon);
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during the checkout process. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
          <h2>Giỏ hàng của bạn</h2>
          {cartItems.length === 0 ? (
            <div>
              <p>Giỏ hàng trống</p>
              <Button color="primary" onClick={() => navigate('/khachhang/muathuocthietbi')}>Mua sắm ngay</Button>
            </div>
          ) : (
            <>
              <Row>
                {cartItems.map(item => (
                  <Col md="12" key={item.id} className="cart-item">
                    <Card className="cart-card">
                      <Row className="align-items-center">
                        <Col md="2">
                          <CardImg
                            top
                            src={item.hinhAnh.startsWith("/")
                              ? `http://localhost:5199${item.hinhAnh}`
                              : item.hinhAnh}
                            alt={item.tenThuoc || item.tenThietBiYTe}
                          />
                        </Col>
                        <Col md="4">
                          <CardBody>
                            <CardTitle className="cart-title">{item.tenThuoc || item.tenThietBiYTe}</CardTitle>
                            <p>{formatCurrency(item.donGia)} / {item.donViTinh || 'sp'}</p>
                          </CardBody>
                        </Col>
                        <Col md="3" className="text-center">
                          <Button onClick={() => handleQuantityChange(item.id, -1)}>-</Button>
                          <Input type="text" value={item.quantity} readOnly className="cart-quantity" />
                          <Button onClick={() => handleQuantityChange(item.id, 1)}>+</Button>
                        </Col>
                        <Col md="2" className="text-right">
                          <p>{formatCurrency(item.donGia * item.quantity)}</p>
                        </Col>
                        <Col md="1" className="text-right">
                          <Button color="danger" onClick={() => handleRemoveItem(item.id)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
              <h3 className="text-right mt-4">Tổng: {formatCurrency(total)}</h3>
              <FormGroup>
                <Label style={{fontSize: 18}} for="addressSelect">Địa chỉ giao hàng</Label>
                <Input type="select" name="addressSelect" id="addressSelect" value={selectedAddressId} onChange={handleAddressChange}>
                  {previousAddresses.map(address => (
                    <option key={address.id} value={address.id}>{address.tenDiaChi}</option>
                  ))}
                </Input>
                <Button onClick={toggleModal} className="btn-add-address">Thêm địa chỉ mới</Button>
              </FormGroup>
              <FormGroup>
                <Label style={{fontSize: 18}} for="note">Ghi chú</Label>
                <Input type="textarea" name="note" id="note" value={note} onChange={handleNoteChange} />
              </FormGroup>
              <Button type="button" color="primary" onClick={handleCheckout}>Thanh toán</Button>
              <Modal isOpen={modalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Thêm Địa Chỉ Mới</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="province">Thành phố</Label>
                      <Input
                        type="select"
                        name="province"
                        id="province"
                        onChange={handleProvinceChange}
                        required
                      >
                        <option value="">Chọn thành phố</option>
                        {provinces.map(province => (
                          <option key={province.Id} value={province.Id}>{province.Name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="district">Quận/Huyện</Label>
                      <Input
                        type="select"
                        name="district"
                        id="district"
                        onChange={handleDistrictChange}
                        required
                      >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map(district => (
                          <option key={district.Id} value={district.Id}>{district.Name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="ward">Phường/Xã</Label>
                      <Input
                        type="select"
                        name="ward"
                        id="ward"
                        onChange={handleWardChange}
                        required
                      >
                        <option value="">Chọn phường/xã</option>
                        {wards.map(ward => (
                          <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="specificAddress">Địa chỉ cụ thể</Label>
                      <Input
                        type="text"
                        name="specificAddress"
                        id="specificAddress"
                        value={newAddress.specificAddress}
                        onChange={handleNewAddressChange}
                        required
                      />
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={saveNewAddress}>Lưu Địa Chỉ</Button>
                </ModalFooter>
              </Modal>
            </>
          )}
        </div>
      );
};

export default CartPage;

const formatCurrency = (num) => {
    return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
