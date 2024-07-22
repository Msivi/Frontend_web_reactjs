import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Table, Form, Row, Col, Container, Card, InputGroup, FormControl, Modal } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { faTrashAlt, faEdit, faPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Nhapthietbi.css';

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  .btn, .icon-btn {
    padding: 5px 10px;
    margin: 0 2px;
    font-size: 12px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon-btn {
    width: 30px;
  }

  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    color: white;
  }

  .btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
    color: white;
  }

  .btn.active {
    background-color: #28a745;
    border-color: #28a745;
    color: white;
  }
`;

function Nhapthietbi() {
  const [suppliers, setSuppliers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [nhapThietBiData, setNhapThietBiData] = useState([]);
  const [ctNhapThietBiData, setCtNhapThietBiData] = useState([]);
  const [thietBiData, setThietBiData] = useState([]);

  const [loaiThietBis, setLoaiThietBis] = useState([]);
  const [nhaCungCaps, setNhaCungCaps] = useState([]);
  const [formData, setFormData] = useState({
    tenThietBi: '',
    nhaSanXuat: '',
    moTa: '',
    maLoaiThietBi: '',
    imageFile: null,
    maNhaCungCap: '',
    chiTietNhapThietBi: [{
      ngaySanXuat: '',
      ngayHetHan: '',
      soLuong: '',
      nhaCungCap: '',
      donGiaBan: '',
      maThietBi: '',
      donGiaNhap: ''
    }]
  });
  const [deviceEntries, setDeviceEntries] = useState([]);
  const [deviceDetails, setDeviceDetails] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 5;

  useEffect(() => {
      // Gọi các API để lấy dữ liệu
      const fetchDevices = async () => {
          try {
              const devicesRes = await axios.get('http://localhost:5199/api/ThietBiYTe/get-all-thiet-bi-y-te');
              setDevices(devicesRes.data);

              const entriesRes = await axios.get('http://localhost:5199/api/NhapThietBiYTe/get-all-nhap-thiet-bi-y-te');
              setDeviceEntries(entriesRes.data);

              const detailsRes = await axios.get('http://localhost:5199/api/CTNhapThietBiYTe/get-all-ct-nhap-thiet-bi-y-te');
              setDeviceDetails(detailsRes.data);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchDevices();
  }, []);

  const combinedData = deviceDetails.map(detail => {
      const device = devices.find(d => d.id === detail.maThietBiYTe);
      const entry = deviceEntries.find(e => e.id === detail.maNhapThietBiYTe);

      return {
          ngayTao: entry?.ngayTao || '',
          tenThietBiYTe: device?.tenThietBiYTe || '',
          soLuong: detail.soLuong,
          maLoThietBi: detail.maLoThietBi,
          donGiaNhap: detail.donGiaNhap
      };
  }).sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao)); // Sắp xếp theo ngày tạo giảm dần

  const formattedCombinedData = combinedData.map(item => ({
      ...item,
      ngayTao: new Date(item.ngayTao).toLocaleDateString('vi-VN')
  }));

  const paginatedData = formattedCombinedData.slice((currentPage - 1) * devicesPerPage, currentPage * devicesPerPage);
  const totalPages = Math.ceil(formattedCombinedData.length / devicesPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / 5) * 5;
    return new Array(Math.min(5, totalPages - start)).fill().map((_, idx) => start + idx + 1);
  };

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSuppliers();
    fetchDevices();
    fetchNhapThietBi();
    fetchCtNhapThietBi();
    fetchThietBi();
    fetchLoaiThietBi(); // Fetch LoaiThietBi
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/NhaCungCap/get-all-nha-cung-cap');
      setSuppliers(response.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách nhà cung cấp!");
      console.error(error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/ThietBiYTe/get-all-thiet-bi-y-te');
      setDevices(response.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách thiết bị y tế!");
      console.error(error);
    }
  };

  const fetchNhapThietBi = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/NhapThietBiYTe/get-all-nhap-thiet-bi-y-te');
      setNhapThietBiData(response.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách nhập thiết bị!");
      console.error(error);
    }
  };

  const fetchCtNhapThietBi = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/CTNhapThietBiYTe/get-all-ct-nhap-thiet-bi-y-te');
      setCtNhapThietBiData(response.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách chi tiết nhập thiết bị!");
      console.error(error);
    }
  };

  const fetchThietBi = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/ThietBiYTe/get-all-thiet-bi-y-te');
      setThietBiData(response.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách thiết bị!");
      console.error(error);
    }
  };

  const fetchLoaiThietBi = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/LoaiThietBi/get-all-loai-thiet-bi');
      setLoaiThietBis(response.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách loại thiết bị!");
      console.error(error);
    }
  };

  const handleCreateNhapThietBi = async () => {
    try {
      const requestData = {
        maNhaCungCap: selectedSupplier,
        chiTietNhapThietBi: selectedDevices.map(device => ({
          ngaySanXuat: device.ngaySanXuat,
          ngayHetHan: device.ngayHetHan,
          soLuong: device.soLuong,
          nhaCungCap: "", // Trường này có thể để trống
          donGiaBan: device.donGiaBan,
          maThietBi: device.maThietBi,
          donGiaNhap: device.donGiaNhap,
        }))
      };

      // Validate data before sending request
      if (!selectedSupplier) {
        toast.error("Vui lòng chọn nhà cung cấp!");
        return;
      }

      if (selectedDevices.length === 0) {
        toast.error("Vui lòng chọn ít nhất một thiết bị!");
        return;
      }

      for (const device of selectedDevices) {
        if (!device.ngaySanXuat || !device.ngayHetHan || !device.soLuong || !device.donGiaNhap || !device.maThietBi) {
          toast.error("Vui lòng nhập đầy đủ thông tin thiết bị!");
          return;
        }

        if (device.soLuong <= 0 || device.donGiaNhap <= 0 || device.donGiaBan <= 0) {
          toast.error("Số lượng, đơn giá nhập và đơn giá bán phải lớn hơn 0!");
          return;
        }

        if (new Date(device.ngayHetHan) <= new Date(device.ngaySanXuat)) {
          toast.error("Ngày hết hạn phải lớn hơn ngày sản xuất!");
          return;
        }
      }

      await axios.post('http://localhost:5199/api/CTNhapThietBiYTe/create-ct-nhap-thiet-bi-y-te', requestData);

      toast.success("Thiết bị nhập thành công!");
      window.location.reload();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi nhập thiết bị!");
      console.error('Error:', error);
    }
  };

  const handleDeviceChange = (device) => {
    const exists = selectedDevices.find(dev => dev.maThietBi === device.id);
  
    if (!exists) {
      setSelectedDevices([
        ...selectedDevices,
        { maThietBi: device.id, soLuong: '', donGiaNhap: '', ngaySanXuat: "", ngayHetHan: "", donGiaBan: '' },
      ]);
      setSearchTerm("");
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedDevices = [...selectedDevices];
    if (quantity <= 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`quantity-${index}`]: "Số lượng phải lớn hơn 0"
      }));
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`quantity-${index}`]: ""
      }));
      const oldQuantity = updatedDevices[index].soLuong;
      updatedDevices[index].soLuong = quantity;
      setSelectedDevices(updatedDevices);
      setTotalPrice(totalPrice + (quantity - oldQuantity) * updatedDevices[index].donGiaNhap);
    }
  };

  const handlePriceChange = (index, price, type) => {
    const updatedDevices = [...selectedDevices];
    if (price <= 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`${type}-${index}`]: `${type} phải lớn hơn 0`
      }));
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`${type}-${index}`]: ""
      }));
      const oldPrice = updatedDevices[index][type];
      updatedDevices[index][type] = price;
      setSelectedDevices(updatedDevices);
      setTotalPrice(totalPrice + (price - oldPrice) * updatedDevices[index].soLuong);
    }
  };

  const handleDeleteDevice = (index) => {
    const updatedDevices = [...selectedDevices];
    const removedDevice = updatedDevices.splice(index, 1)[0];
    setSelectedDevices(updatedDevices);
    setTotalPrice(totalPrice - removedDevice.soLuong * removedDevice.donGiaNhap);
  };

  const formatCurrency = (value) => {
    return isNaN(value) ? '' : value;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleChiTietChange = (index, e) => {
    const { name, value } = e.target;
    const updatedChiTiet = [...formData.chiTietNhapThietBi];
    if (name === "soLuong" || name === "donGiaBan" || name === "donGiaNhap") {
      if (parseFloat(value) <= 0) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [`${name}-${index}`]: `${name} phải lớn hơn 0`
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          [`${name}-${index}`]: ""
        }));
      }
    }
    if (name === "ngayHetHan" && new Date(value) <= new Date(updatedChiTiet[index].ngaySanXuat)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`ngayHetHan-${index}`]: "Ngày hết hạn phải lớn hơn ngày sản xuất"
      }));
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`ngayHetHan-${index}`]: ""
      }));
    }
    updatedChiTiet[index][name] = value;
    setFormData({
      ...formData,
      chiTietNhapThietBi: updatedChiTiet
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      imageFile: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo thiết bị
    const data = new FormData();
    for (const key in formData) {
      if (key === 'imageFile') {
        data.append(key, formData[key]);
      } else if (key !== 'chiTietNhapThietBi') { // Bỏ qua chiTietNhapThietBi khi tạo thiết bị
        data.append(key, formData[key]);
      }
    }

    try {
      const thietBiResponse = await axios.post('http://localhost:5199/api/ThietBiYTe/create-thiet-bi-y-te', data);
      const newThietBiId = thietBiResponse.data.data;
      toast.success('Thiết bị đã được tạo thành công!');

      // Tạo chi tiết phiếu nhập thiết bị
      const chiTietData = formData.chiTietNhapThietBi.map(chiTiet => ({
        ...chiTiet,
        maThietBi: newThietBiId
      }));

      await axios.post('http://localhost:5199/api/CTNhapThietBiYTe/create-ct-nhap-thiet-bi-y-te', {
        maNhaCungCap: parseInt(formData.maNhaCungCap),
        chiTietNhapThietBi: chiTietData
      });
      toast.success('Chi tiết phiếu nhập thiết bị đã được tạo thành công!');
      setShowModal(false); // Close the modal after successful submission
    } catch (error) {
      toast.error('Lỗi khi tạo thiết bị hoặc chi tiết phiếu nhập: ' + error.message);
    }
  };

  return (
    <Container style={{marginTop:100}} fluid>
      <Card className="mt-5 mx-5 card-custom">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h3>Nhập Thiết Bị</h3>
          <FontAwesomeIcon icon={faPlus} style={{ cursor: 'pointer', color: 'white' }} onClick={() => setShowModal(true)} />
        </Card.Header>
        <Card.Body>
          <Form className="mt-3">
            <Form.Group as={Row} className="mb-3" controlId="device">
              <Form.Label >Tìm Thiết Bị</Form.Label>
             
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder="Nhập tên thiết bị"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                {searchTerm && (
                  <div className="search-results">
                    {devices.filter(dev => dev.tenThietBiYTe.toLowerCase().includes(searchTerm.toLowerCase())).map((device) => (
                      <div key={device.id} className="search-item" onClick={() => handleDeviceChange(device)}>
                        <input type="checkbox" checked readOnly /> {device.tenThietBiYTe} ({device.id})
                      </div>
                    ))}
                  </div>
                )}
        
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="supplier">
              <Form.Label >Nhà Cung Cấp *</Form.Label>
          
                <Form.Control as="select" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)} required>
                  <option value="">Chọn Nhà Cung Cấp</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>{supplier.tenNhaCungCap}</option>
                  ))}
                </Form.Control>
            
            </Form.Group>

            {selectedDevices.length > 0 && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Tên Thiết Bị</th>
                    <th>Số Lượng</th>
                    <th>Đơn Giá Nhập</th>
                    <th>Ngày Sản Xuất</th>
                    <th>Ngày Hết Hạn</th>
                    <th>Đơn Giá Bán</th>
                    <th></th>
                    <th>Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDevices.map((device, index) => {
                    const deviceDetails = devices.find(dev => dev.id === device.maThietBi);
                    return (
                      <tr key={device.maThietBi}>
                        <td>{deviceDetails ? `${deviceDetails.tenThietBiYTe} (${deviceDetails.id})` : 'Unknown'}</td>
                        <td>
                          <Form.Control
                            type="number"
                            value={device.soLuong}
                            isInvalid={!!errors[`quantity-${index}`]}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors[`quantity-${index}`]}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={device.donGiaNhap}
                            isInvalid={!!errors[`donGiaNhap-${index}`]}
                            onChange={(e) => handlePriceChange(index, e.target.value, 'donGiaNhap')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors[`donGiaNhap-${index}`]}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <Form.Control
                            type="date"
                            value={device.ngaySanXuat}
                            onChange={(e) => {
                              const updatedDevices = [...selectedDevices];
                              updatedDevices[index].ngaySanXuat = e.target.value;
                              setSelectedDevices(updatedDevices);
                            }}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="date"
                            value={device.ngayHetHan}
                            isInvalid={!!errors[`ngayHetHan-${index}`]}
                            onChange={(e) => {
                              const updatedDevices = [...selectedDevices];
                              updatedDevices[index].ngayHetHan = e.target.value;
                              if (new Date(e.target.value) <= new Date(updatedDevices[index].ngaySanXuat)) {
                                setErrors(prevErrors => ({
                                  ...prevErrors,
                                  [`ngayHetHan-${index}`]: "Ngày hết hạn phải lớn hơn ngày sản xuất"
                                }));
                              } else {
                                setErrors(prevErrors => ({
                                  ...prevErrors,
                                  [`ngayHetHan-${index}`]: ""
                                }));
                              }
                              setSelectedDevices(updatedDevices);
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors[`ngayHetHan-${index}`]}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={device.donGiaBan}
                            isInvalid={!!errors[`donGiaBan-${index}`]}
                            onChange={(e) => handlePriceChange(index, e.target.value, 'donGiaBan')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors[`donGiaBan-${index}`]}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={() => handleDeleteDevice(index)}
                          />
                        </td>
                        <td>{formatCurrency(device.soLuong * device.donGiaNhap)}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="7">Tổng Tiền</td>
                    <td>{formatCurrency(selectedDevices.reduce((sum, device) => sum + device.soLuong * device.donGiaNhap, 0))}</td>
                  </tr>
                </tbody>
              </Table>
            )}

            <Row>
              <Col>
                <Button variant="primary" className="me-2" onClick={handleCreateNhapThietBi}>Nhập Thiết Bị</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nhập Thiết Bị</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group controlId="tenThietBi">
                  <Form.Label>Tên Thiết Bị</Form.Label>
                  <Form.Control
                    type="text"
                    name="tenThietBi"
                    value={formData.tenThietBi}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="nhaSanXuat">
                  <Form.Label>Nhà Sản Xuất</Form.Label>
                  <Form.Control
                    type="text"
                    name="nhaSanXuat"
                    value={formData.nhaSanXuat}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="maLoaiThietBi">
                  <Form.Label>Loại Thiết Bị</Form.Label>
                  <Form.Control
                    as="select"
                    name="maLoaiThietBi"
                    value={formData.maLoaiThietBi}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn loại thiết bị</option>
                    {loaiThietBis.map(loai => (
                      <option key={loai.id} value={loai.id}>{loai.tenLoaiThietBi}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="moTa">
                  <Form.Label>Mô Tả</Form.Label>
                  <Form.Control
                    type="text"
                    name="moTa"
                    value={formData.moTa}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="imageFile">
                  <Form.Label>Hình Ảnh</Form.Label>
                  <Form.Control
                    type="file"
                    name="imageFile"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="maNhaCungCap">
                  <Form.Label>Nhà Cung Cấp</Form.Label>
                  <Form.Control
                    as="select"
                    name="maNhaCungCap"
                    value={formData.maNhaCungCap}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn nhà cung cấp</option>
                    {suppliers.map(ncc => (
                      <option key={ncc.id} value={ncc.id}>{ncc.tenNhaCungCap}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            {formData.chiTietNhapThietBi.map((chiTiet, index) => (
  <Card key={index} className="">

      <Row className="">
          <Col md={6}>
            <Form.Group controlId={`ngaySanXuat-${index}`}>
              <Form.Label>Ngày Sản Xuất</Form.Label>
              <Form.Control
                type="date"
                name="ngaySanXuat"
                value={chiTiet.ngaySanXuat}
                onChange={e => handleChiTietChange(index, e)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId={`ngayHetHan-${index}`}>
              <Form.Label>Ngày Hết Hạn</Form.Label>
              <Form.Control
                type="date"
                name="ngayHetHan"
                value={chiTiet.ngayHetHan}
                isInvalid={!!errors[`ngayHetHan-${index}`]}
                onChange={e => handleChiTietChange(index, e)}
              />
              <Form.Control.Feedback type="invalid">
                {errors[`ngayHetHan-${index}`]}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId={`soLuong-${index}`}>
            <Form.Label>Số Lượng</Form.Label>
            <Form.Control
              type="number"
              name="soLuong"
              value={chiTiet.soLuong}
              isInvalid={!!errors[`soLuong-${index}`]}
              onChange={e => handleChiTietChange(index, e)}
            />
            <Form.Control.Feedback type="invalid">
              {errors[`soLuong-${index}`]}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId={`donGiaBan-${index}`}>
            <Form.Label>Đơn Giá Bán</Form.Label>
            <Form.Control
              type="number"
              name="donGiaBan"
              value={chiTiet.donGiaBan}
              isInvalid={!!errors[`donGiaBan-${index}`]}
              onChange={e => handleChiTietChange(index, e)}
            />
            <Form.Control.Feedback type="invalid">
              {errors[`donGiaBan-${index}`]}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId={`maThietBi-${index}`}>
            <Form.Label>Thiết Bị</Form.Label>
            <Form.Control
              type="text"
              name="maThietBi"
              value={chiTiet.maThietBi}
              readOnly
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId={`donGiaNhap-${index}`}>
            <Form.Label>Đơn Giá Nhập</Form.Label>
            <Form.Control
              type="number"
              name="donGiaNhap"
              value={chiTiet.donGiaNhap}
              isInvalid={!!errors[`donGiaNhap-${index}`]}
              onChange={e => handleChiTietChange(index, e)}
            />
            <Form.Control.Feedback type="invalid">
              {errors[`donGiaNhap-${index}`]}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
   
  </Card>
))}

            <Button variant="primary" type="submit" className="mt-3">Nhập Thiết Bị</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
         
        </Modal.Footer>
      </Modal>
      <Card className="mt-5 mx-5 card-custom">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h3>Danh Sách Nhập Thiết Bị</h3>
        </Card.Header>
        <Card.Body>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Ngày Tạo</th>
                        <th>Tên Thiết Bị Y Tế</th>
                        <th>Số Lượng</th>
                        <th>Mã Lô Thiết Bị</th>
                        <th>Đơn Giá Nhập</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.ngayTao}</td>
                            <td>{item.tenThietBiYTe}</td>
                            <td>{item.soLuong}</td>
                            <td>{item.maLoThietBi}</td>
                            <td>{item.donGiaNhap}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
              <Button className="icon-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
              {getPaginationGroup().map(item => (
                <Button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  variant={item === currentPage ? 'primary' : 'secondary'}
                  className={item === currentPage ? 'm-1 active' : 'm-1'}
                >
                  {item}
                </Button>
              ))}
              <Button className="icon-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                <FontAwesomeIcon icon={faChevronRight} />
              </Button>
            </Pagination>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Nhapthietbi;
