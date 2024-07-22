import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import { Table, Form, Row, Col, Container, Card, InputGroup, FormControl, Modal } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Nhapthuoc.css';
import styled from 'styled-components';

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

function Nhapthuoc() {
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [nhapThuocData, setNhapThuocData] = useState([]);
  const [ctNhapThuocData, setCtNhapThuocData] = useState([]);
  const [thuocData, setThuocData] = useState([]);

  const [loaiThuocs, setLoaiThuocs] = useState([]);
  const [nhaCungCaps, setNhaCungCaps] = useState([]);
  const [formData, setFormData] = useState({
    tenThuoc: '',
    donViTinh: '',
    nhaSanXuat: '',
    maLoaiThuoc: '',
    thanhPhan: '',
    moTa: '',
    imageFile: null,
    maNhaCungCap: '',
    chiTietNhapThuoc: [{
      ngaySanXuat: '',
      ngayHetHan: '',
      soLuong: 0,
      nhaCungCap: '',
      donGiaBan: 0,
      maThuoc: '',
      donGiaNhap: 0
    }]
  });

  const [errors, setErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchNhapThuoc();
    fetchCtNhapThuoc();
    fetchThuoc();
  }, []);

  useEffect(() => {
    fetchSuppliers();
    fetchMedicines();
    axios.get('http://localhost:5199/api/LoaiThuoc/get-all-loai-thuoc')
      .then(response => setLoaiThuocs(response.data))
      .catch(error => console.error('Error fetching loai thuocs:', error));

    axios.get('http://localhost:5199/api/NhaCungCap/get-all-nha-cung-cap')
      .then(response => setNhaCungCaps(response.data))
      .catch(error => console.error('Error fetching nha cung caps:', error));

    axios.get('http://localhost:5199/api/Thuoc/get-all-thuoc')
      .then(response => setMedicines(response.data))
      .catch(error => console.error('Error fetching thuocs:', error));
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

  const fetchMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/Thuoc/get-all-thuoc');
      setMedicines(response.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách thuốc!");
      console.error(error);
    }
  };

  const handleCreateNhapThuoc = async () => {
    try {
      if (!selectedSupplier) {
        toast.error("Vui lòng chọn nhà cung cấp!");
        return;
      }

      if (selectedMedicines.length === 0) {
        toast.error("Vui lòng chọn ít nhất một thuốc để nhập!");
        return;
      }

      for (const medicine of selectedMedicines) {
        if (!medicine.ngaySanXuat || !medicine.ngayHetHan || !medicine.soLuong || !medicine.donGiaNhap || !medicine.maThuoc) {
          toast.error("Vui lòng nhập đầy đủ thông tin thuốc!");
          return;
        }

        if (medicine.soLuong <= 0 || medicine.donGiaNhap <= 0 || medicine.donGiaBan <= 0) {
          toast.error("Số lượng, đơn giá nhập và đơn giá bán phải lớn hơn 0!");
          return;
        }

        if (new Date(medicine.ngayHetHan) <= new Date(medicine.ngaySanXuat)) {
          toast.error("Ngày hết hạn phải lớn hơn ngày sản xuất!");
          return;
        }
      }

      const requestData = {
        maNhaCungCap: selectedSupplier,
        chiTietNhapThuoc: selectedMedicines.map(medicine => ({
          ngaySanXuat: medicine.ngaySanXuat,
          ngayHetHan: medicine.ngayHetHan,
          soLuong: medicine.soLuong,
          nhaCungCap: "", // Trường này có thể để trống
          donGiaBan: medicine.donGiaBan,
          maThuoc: medicine.maThuoc,
          donGiaNhap: medicine.donGiaNhap,
        }))
      };

      await axios.post('http://localhost:5199/api/CTNhapThuoc/add-ct-nhap-thuoc-asyns', requestData);
      
      toast.success("Thuốc nhập thành công!");
      window.location.reload();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi nhập thuốc!");
      console.error('Error:', error);
    }
  };

  const handleMedicineChange = (medicine) => {
    const exists = selectedMedicines.find(med => med.maThuoc === medicine.id);
    if (!exists) {
      setSelectedMedicines([
        ...selectedMedicines,
        { maThuoc: medicine.id, soLuong: '', donGiaNhap: '', ngaySanXuat: "", ngayHetHan: "", donGiaBan: '' }
      ]);
      setTotalPrice(totalPrice + medicine.giaNhap);
      setSearchTerm("");
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedMedicines = [...selectedMedicines];
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
      const oldQuantity = updatedMedicines[index].soLuong;
      updatedMedicines[index].soLuong = quantity;
      setSelectedMedicines(updatedMedicines);
      setTotalPrice(totalPrice + (quantity - oldQuantity) * updatedMedicines[index].donGiaNhap);
    }
  };

  const handlePriceChange = (index, price, type) => {
    const updatedMedicines = [...selectedMedicines];
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
      const oldPrice = updatedMedicines[index][type];
      updatedMedicines[index][type] = price;
      setSelectedMedicines(updatedMedicines);
      setTotalPrice(totalPrice + (price - oldPrice) * updatedMedicines[index].soLuong);
    }
  };

  const handleDeleteMedicine = (index) => {
    const updatedMedicines = [...selectedMedicines];
    const removedMedicine = updatedMedicines.splice(index, 1)[0];
    setSelectedMedicines(updatedMedicines);
    setTotalPrice(totalPrice - removedMedicine.soLuong * removedMedicine.donGiaNhap);
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
    const updatedChiTiet = [...formData.chiTietNhapThuoc];
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
      chiTietNhapThuoc: updatedChiTiet
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      imageFile: e.target.files[0]
    });
  };

  const handleAddChiTiet = () => {
    setFormData({
      ...formData,
      chiTietNhapThuoc: [
        ...formData.chiTietNhapThuoc,
        {
          ngaySanXuat: '',
          ngayHetHan: '',
          soLuong: 0,
          nhaCungCap: '',
          donGiaBan: 0,
          maThuoc: '',
          donGiaNhap: 0
        }
      ]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo thuốc
    const data = new FormData();
    for (const key in formData) {
      if (key === 'imageFile') {
        data.append(key, formData[key]);
      } else if (key !== 'chiTietNhapThuoc') { // Bỏ qua chiTietNhapThuoc khi tạo thuốc
        data.append(key, formData[key]);
      }
    }

    try {
      const thuocResponse = await axios.post('http://localhost:5199/api/Thuoc/create-thuoc', data);
      const newThuocId = thuocResponse.data.data;
      console.log('ID thuốc mới:', newThuocId);
      toast.success('Thuốc đã được tạo thành công!');

      // Tạo chi tiết phiếu nhập thuốc
      const chiTietData = formData.chiTietNhapThuoc.map(chiTiet => ({
        ...chiTiet,
        maThuoc: newThuocId
      }));
      console.log('Dữ liệu chi tiết gửi đi:', chiTietData);

      await axios.post('http://localhost:5199/api/CTNhapThuoc/add-ct-nhap-thuoc-asyns', {
        maNhaCungCap: parseInt(formData.maNhaCungCap),
        chiTietNhapThuoc: chiTietData
      });
      toast.success('Chi tiết phiếu nhập thuốc đã được tạo thành công!');
      setShowModal(false); // Close the modal after successful submission
    } catch (error) {
      toast.error('Lỗi khi tạo thuốc hoặc chi tiết phiếu nhập: ' + error.message);
    }
  };

  const fetchNhapThuoc = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/NhapThuoc/get-all-nhap-thuoc');
      setNhapThuocData(response.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách nhập thuốc!");
      console.error(error);
    }
  };

  const fetchCtNhapThuoc = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/CTNhapThuoc/get-all-ct-nhap-thuoc');
      setCtNhapThuocData(response.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách chi tiết nhập thuốc!");
      console.error(error);
    }
  };

  const fetchThuoc = async () => {
    try {
      const response = await axios.get('http://localhost:5199/api/Thuoc/get-all-thuoc');
      setThuocData(response.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy danh sách thuốc!");
      console.error(error);
    }
  };

  const combineData = () => {
    const combined = [];

    ctNhapThuocData.forEach(ct => {
      const nhapThuoc = nhapThuocData.find(nt => nt.id === ct.maNhapThuoc);
      const thuoc = thuocData.find(t => t.id === ct.maThuoc);
      if (nhapThuoc && thuoc) {
        combined.push({
          ngayTao: nhapThuoc.ngayTao,
          tenThuoc: thuoc.tenThuoc,
          soLuong: ct.soLuong,
          maLoThuoc: ct.maLoThuoc,
          donGiaNhap: ct.donGiaNhap
        });
      }
    });

    return combined;
  };

  const combinedData = combineData().sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));
  const formattedCombinedData = combinedData.map(item => ({
      ...item,
      ngayTao: new Date(item.ngayTao).toLocaleDateString('vi-VN')
  }));

  const paginatedData = formattedCombinedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(formattedCombinedData.length / itemsPerPage);

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

  return (
    <Container style={{marginTop:100}} fluid>
      <Card className="mt-5 mx-5 card-custom">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h3>Nhập Thuốc</h3>
          <FontAwesomeIcon icon={faPlus} style={{ cursor: 'pointer', color: 'white' }} onClick={() => setShowModal(true)} />
        </Card.Header>
        <Card.Body>
          <Form className="mt-3">
            <Form.Group as={Row} className="mb-3" controlId="medicine">
              <Form.Label >Tìm Thuốc</Form.Label>
             
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder="Nhập tên thuốc"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                {searchTerm && (
                  <div className="search-results">
                    {medicines.filter(med => med.tenThuoc.toLowerCase().startsWith(searchTerm.toLowerCase())).map((medicine) => (
                      <div key={medicine.id} className="search-item" onClick={() => handleMedicineChange(medicine)}>
                        <input type="checkbox" checked readOnly /> {medicine.tenThuoc} ({medicine.id})
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

            {selectedMedicines.length > 0 && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Tên Thuốc</th>
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
                  {selectedMedicines.map((medicine, index) => {
                    const medicineDetails = medicines.find(med => med.id === medicine.maThuoc);
                    return (
                      <tr key={medicine.maThuoc}>
                        <td>{medicineDetails ? `${medicineDetails.tenThuoc} (${medicineDetails.id})` : 'Unknown'}</td>
                        <td>
                          <Form.Control
                            type="number"
                            value={medicine.soLuong}
                            isInvalid={!!errors[`quantity-${index}`]}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors[`quantity-${index}`]}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={medicine.donGiaNhap}
                            isInvalid={!!errors[`donGiaNhap-${index}`]}
                            onChange={(e) => handlePriceChange(index, parseInt(e.target.value), 'donGiaNhap')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors[`donGiaNhap-${index}`]}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <Form.Control
                            type="date"
                            value={medicine.ngaySanXuat}
                            onChange={(e) => {
                              const updatedMedicines = [...selectedMedicines];
                              updatedMedicines[index].ngaySanXuat = e.target.value;
                              setSelectedMedicines(updatedMedicines);
                            }}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="date"
                            value={medicine.ngayHetHan}
                            isInvalid={!!errors[`ngayHetHan-${index}`]}
                            onChange={(e) => {
                              const updatedMedicines = [...selectedMedicines];
                              updatedMedicines[index].ngayHetHan = e.target.value;
                              if (new Date(e.target.value) <= new Date(updatedMedicines[index].ngaySanXuat)) {
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
                              setSelectedMedicines(updatedMedicines);
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors[`ngayHetHan-${index}`]}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={medicine.donGiaBan}
                            isInvalid={!!errors[`donGiaBan-${index}`]}
                            onChange={(e) => handlePriceChange(index, parseInt(e.target.value), 'donGiaBan')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors[`donGiaBan-${index}`]}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={() => handleDeleteMedicine(index)}
                          />
                        </td>
                        <td>{formatCurrency(medicine.soLuong * medicine.donGiaNhap)}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="7">Tổng Tiền</td>
                    <td>{formatCurrency(selectedMedicines.reduce((sum, medicine) => sum + medicine.soLuong * medicine.donGiaNhap, 0))}</td>
                  </tr>
                </tbody>
              </Table>
            )}

            <Row>
              <Col>
                <Button variant="primary" className="me-2" onClick={handleCreateNhapThuoc}>Nhập Thuốc</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title> Nhập Thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="tenThuoc">
                  <Form.Label>Tên Thuốc</Form.Label>
                  <Form.Control
                    type="text"
                    name="tenThuoc"
                    value={formData.tenThuoc}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="donViTinh">
                  <Form.Label>Đơn Vị Tính</Form.Label>
                  <Form.Control
                    type="text"
                    name="donViTinh"
                    value={formData.donViTinh}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
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
              <Col>
                <Form.Group controlId="maLoaiThuoc">
                  <Form.Label>Loại Thuốc</Form.Label>
                  <Form.Control
                    as="select"
                    name="maLoaiThuoc"
                    value={formData.maLoaiThuoc}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn loại thuốc</option>
                    {loaiThuocs.map(loai => (
                      <option key={loai.id} value={loai.id}>{loai.tenLoaiThuoc}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="thanhPhan">
                  <Form.Label>Thành Phần</Form.Label>
                  <Form.Control
                    type="text"
                    name="thanhPhan"
                    value={formData.thanhPhan}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
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
                    {nhaCungCaps.map(ncc => (
                      <option key={ncc.id} value={ncc.id}>{ncc.tenNhaCungCap}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>

          {formData.chiTietNhapThuoc.map((chiTiet, index) => (
            <Card key={index} className="mb-3">
          
                <Row>
                  <Col>
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
                  <Col>
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
                <Row>
                  <Col>
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
                  <Col>
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
                <Row>
                  <Col>
                    <Form.Group controlId={`maThuoc-${index}`}>
                      <Form.Label>Thuốc</Form.Label>
                      <Form.Control
                        type="text"
                        name="maThuoc"
                        value={chiTiet.maThuoc}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col>
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

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={handleSubmit}>Nhập Thuốc</Button>
        </Modal.Footer>
      </Modal>
      <Card className="mt-5 mx-5 card-custom">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h3>Danh Sách Nhập Thuốc</h3>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ngày Tạo</th>
                <th>Tên Thuốc</th>
                <th>Số Lượng</th>
                <th>Mã Lô Thuốc</th>
                <th>Đơn Giá Nhập</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.ngayTao}</td>
                  <td>{item.tenThuoc}</td>
                  <td>{item.soLuong}</td>
                  <td>{item.maLoThuoc}</td>
                  <td>{item.donGiaNhap}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Button variant="secondary" onClick={handlePreviousPage} disabled={currentPage === 1}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            {getPaginationGroup().map((item, index) => (
              <Button
                key={index}
                className={`btn ${currentPage === item ? 'active' : ''}`}
                onClick={() => setCurrentPage(item)}
              >
                {item}
              </Button>
            ))}
            <Button variant="secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </Pagination>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Nhapthuoc;
