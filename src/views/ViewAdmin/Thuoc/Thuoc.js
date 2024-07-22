import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import axios from 'axios'; 
import { Table, Form, Row, Col, InputGroup } from "react-bootstrap";
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  margin-top: 100px;
  .content {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;
const SearchButton = styled(Button)`
  width: 100%;
`;
const StyledTable = styled(Table)`
  margin-top: 20px;
  th {
    background-color: #007bff;
    color: white;
    text-align: center;
  }
  td {
    text-align: center;
  }
  tbody tr:hover {
    background-color: #f1f1f1;
  }
`;
const StyledContainer = styled(Container)`
  margin-top: 50px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled(Form)`
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  .form-outline {
    margin-bottom: 20px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px; /* Adjust the gap between icons as needed */
`;

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

function Thuoc() {
  const [listThuoc, setlistThuoc] = useState([]);
  const [listLoaiThuoc, setListLoaiThuoc] = useState([]);
  const [showUpdateThuoc, setShowUpdateThuoc] = useState(false);
  const [showLoThuoc, setShowLoThuoc] = useState(false); // State để điều khiển modal lô thuốc
  const [loThuocData, setLoThuocData] = useState([]); // State để lưu thông tin lô thuốc
  const [editId, seteditId] = useState("");
  const [editTenThuoc, seteditTenThuoc] = useState("");
  const [editdonViTinh, seteditdonViTinh] = useState("");
  const [editnhaSanXuat, seteditnhaSanXuat] = useState("");
  const [editmaLoaiThuoc, seteditMaLoaiThuoc] = useState("");
  const [editthanhPhan, seteditthanhPhan] = useState("");
  const [editmoTa, seteditmoTa] = useState("");
  const [editImageUrl, seteditImageUrl] = useState("");
  const [editImageFile, seteditImageFile] = useState(null);
  const [editTenDanhMuc, seteditTenDanhMuc] = useState("");
  const [editdonGia, seteditDonGia] = useState(""); // Thêm state cho donGia
  const [searchKey, setSearchKey] = useState("");
  const [filterLoaiThuoc, setFilterLoaiThuoc] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 5;

  const handleCloseUpdateThuoc = () => setShowUpdateThuoc(false);
  const handleCloseLoThuoc = () => setShowLoThuoc(false); // Đóng modal lô thuốc

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchKey(value);
  };

  const handleSearch = async () => {
    try {
      let response = await axios.get(`http://localhost:5199/api/Thuoc/search-thuoc?searchKey=${searchKey}`);
      if (response.data) {
        setlistThuoc(response.data);
      } else {
        toast.error("No results found");
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  const handleShowUpdateThuoc = (id) => {
    setShowUpdateThuoc(true);
    axios.get(`http://localhost:5199/api/Thuoc/get-thuoc-by-id?id=${id}`)
      .then((result) => {
        seteditTenThuoc(result.data.tenThuoc);
        seteditdonViTinh(result.data.donViTinh);
        seteditnhaSanXuat(result.data.nhaSanXuat);
        seteditMaLoaiThuoc(result.data.maLoaiThuoc);
        seteditthanhPhan(result.data.thanhPhan);
        seteditmoTa(result.data.moTa);
        seteditDonGia(result.data.donGia); // Gán giá trị donGia vào state
        seteditTenDanhMuc(result.data.tenDanhMuc);

        const imagePath = result.data.hinhAnh;
        if (imagePath) {
          if (imagePath.startsWith('/')) {
            seteditImageUrl(`http://localhost:5199${imagePath}`);
          } else {
            seteditImageUrl(imagePath);
          }
        } else {
          seteditImageUrl('');
        }

        seteditId(id);
      })
      .catch((error) => {
        console.log(error);
        toast.error('Không tìm thấy thông tin thuốc!');
      });
  };

  const handleShowLoThuoc = async (maThuoc) => {
    try {
      const response = await axios.get(`http://localhost:5199/api/LoThuoc/get-lo-thuoc-by-ma-thuoc?maThuoc=${maThuoc}`);
      if (response.data) {
        setLoThuocData(response.data);
        setShowLoThuoc(true);
      } else {
        toast.error("Không tìm thấy thông tin lô thuốc");
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin lô thuốc");
    }
  };

  const handleReload = () => {
    setSearchKey("");
    setFilterLoaiThuoc("");
    GETTThuoc();
  };

  const handleUpdate = async () => {
    const url = `http://localhost:5199/api/Thuoc/update-thuoc?id=${editId}`;
    const formData = new FormData();
    formData.append('id', editId);
    formData.append('tenThuoc', editTenThuoc);
    formData.append('donViTinh', editdonViTinh);
    formData.append('nhaSanXuat', editnhaSanXuat);
    formData.append('thanhPhan', editthanhPhan);
    formData.append('moTa', editmoTa);
    formData.append('donGia', editdonGia); // Thêm donGia vào form data
    
    if (!editmaLoaiThuoc) {
      const selectedLoaiThuoc = listLoaiThuoc.find(lt => lt.tenLoaiThuoc === editTenDanhMuc);
      if (selectedLoaiThuoc) {
        formData.append('maLoaiThuoc', selectedLoaiThuoc.id);
      }
    } else {
      formData.append('maLoaiThuoc', editmaLoaiThuoc);
    }

    if (editImageFile) {
      formData.append('imageFile', editImageFile);
    } else if (editImageUrl) {
      formData.append('hinhAnh', editImageUrl);
    }
  
    try {
      const result = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (result.status === 200) {
        toast.success("Cập nhật thuốc thành công");
        window.location.reload();
      } else {
        toast.error('Lỗi cập nhật thuốc');
      }
    } catch (error) {
      console.error("Error Response:", error.response);
      toast.error(error.response?.data?.message || 'Lỗi cập nhật thuốc');
    }
  };

  const handleImageChange = (e) => {
    seteditImageFile(e.target.files[0]);
  }
 
  const handleDeleteThuoc = async (keyId) => {
    if (window.confirm("Bạn Có Chắc Muốn Xóa Không?")) {
      axios.delete(`http://localhost:5199/api/Thuoc/delete-thuoc?keyId=${keyId}`)
      .then((result) => {
        if (result.status === 200) {
          toast.success("Xóa thuốc thành công");
          window.location.reload();
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
    }
  };

  const GETTThuoc = async () => {
    let res = await axios.get('http://localhost:5199/api/Thuoc/get-all-thuoc');
    if (res.data) {
        setlistThuoc(res.data);
    }
  };

  const GETLoaiThuoc = async () => {
    let res = await axios.get('http://localhost:5199/api/LoaiThuoc/get-all-loai-thuoc');
    if (res.data) {
      setListLoaiThuoc(res.data);
    }
  };

  useEffect(() => {
    GETTThuoc();
    GETLoaiThuoc();
  }, []);

  const filteredDevices = listThuoc.filter(device => {
    return (
      (!filterLoaiThuoc || device.tenDanhMuc.includes(filterLoaiThuoc)) &&
      (!searchKey || device.tenThuoc.toLowerCase().includes(searchKey.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);
  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);

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
    let start = Math.floor((currentPage - 1) / 3) * 3;
    return new Array(Math.min(3, totalPages - start)).fill().map((_, idx) => start + idx + 1);
  };

  return (
    <Container className="container">
      <div style={{ width: 1200, marginTop: -50 , marginLeft:-40 }} className="content">
        <h1 style={{ fontWeight: 'bold', color: 'red', marginLeft: 400 }}>Thuốc</h1>

        <Form className="mb-3">
          <Row>
            <Col md={4}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Tìm Kiếm"
                  value={searchKey}
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Control
                as="select"
                value={filterLoaiThuoc}
                onChange={(e) => setFilterLoaiThuoc(e.target.value)}
              >
                <option value="">Lọc theo loại thuốc</option>
                {listLoaiThuoc.map(loai => (
                  <option key={loai.id} value={loai.tenLoaiThuoc}>{loai.tenLoaiThuoc}</option>
                ))}
              </Form.Control>
            </Col>
            <Col md={2}>
              <Button style={{marginTop:-1,height:45}} variant="primary" onClick={handleReload}>Load</Button>
            </Col>
          </Row>
        
        </Form>

        <StyledTable striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Tên Thuốc</th>
              <th>Đơn Vị Tính</th>
              <th>Đơn Giá</th>
              <th>Số Lượng</th>
              <th>Thành Phần</th>
              <th>Mô Tả</th>
              <th>Tên Danh Mục</th>
              <th>Hình Ảnh</th>
              <th>Chỉnh Sửa</th>
            </tr>
          </thead>
          <tbody>
            {currentDevices.map((list, index) => (
              <tr key={index}>
                <td>{list.id}</td>
                <td>{list.tenThuoc}</td>
                <td>{list.donViTinh}</td>
                <td>{list.donGia}</td>
                <td>{list.soLuong}</td>
                <td>{list.thanhPhan}</td>
                <td>{list.moTa}</td>
                <td>{list.tenDanhMuc}</td>
                <td>
                  <img style={{ width: "50px" }} src={list.hinhAnh && list.hinhAnh.startsWith("/") ? `http://localhost:5199${list.hinhAnh}` : list.hinhAnh} alt={list.tenThuoc} />
                </td>
                <td>
                  <IconContainer>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      style={{ cursor: 'pointer', color: 'blue' }}
                      onClick={() => handleDeleteThuoc(list.id)}
                    />
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() => handleShowUpdateThuoc(list.id)}
                    />
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() => handleShowLoThuoc(list.id)}
                    />
                  </IconContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
        <Pagination>
          <button className="icon-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
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
          <button className="icon-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </Pagination>
      </div>

      <Modal show={showUpdateThuoc} onHide={handleCloseUpdateThuoc}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh Sửa Thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Tên Thuốc</label>
              <input type="text" value={editTenThuoc} onChange={(e) => seteditTenThuoc(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Đơn Vị Tính</label>
              <input type="text" value={editdonViTinh} onChange={(e) => seteditdonViTinh(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Đơn Giá</label>
              <input type="number" value={editdonGia} onChange={(e) => seteditDonGia(e.target.value)} className="form-control" /> {/* Thêm input cho donGia */}
            </div>
            <div className="form-group">
              <label>Nhà Sản Xuất</label>
              <input type="text" value={editnhaSanXuat} onChange={(e) => seteditnhaSanXuat(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Tên Danh Mục</label>
              <select value={editmaLoaiThuoc} onChange={(e) => seteditMaLoaiThuoc(e.target.value)} className="form-control">
                <option value="">{editTenDanhMuc}</option>
                {listLoaiThuoc.map((lt) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.tenLoaiThuoc}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Thành Phần</label>
              <input type="text" value={editthanhPhan} onChange={(e) => seteditthanhPhan(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Mô Tả</label>
              <input type="text" value={editmoTa} onChange={(e) => seteditmoTa(e.target.value)} className="form-control" />
            </div>
          
            <div className="form-group">
              <label>Hình Ảnh Hiện Tại</label>
              {editImageUrl && <img src={editImageUrl} alt="Current Image" style={{ width: '100px' }} />}
            </div>
            <div className="form-group">
              <label>Hình Ảnh Mới</label>
              <input type="file" onChange={handleImageChange} className="form-control" />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
 
          <Button variant="primary" onClick={handleUpdate} >
            Xác Nhận
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLoThuoc} onHide={handleCloseLoThuoc}>
        <Modal.Header closeButton>
          <Modal.Title>Thông Tin Lô Thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StyledTable striped bordered hover>
            <thead>
              <tr>
                <th>Ngày Sản Xuất</th>
                <th>Ngày Hết Hạn</th>
                <th>Số Lượng</th>
                <th>Nhà Cung Cấp</th>
                <th>Đơn Giá Bán</th>
              </tr>
            </thead>
            <tbody>
              {loThuocData.map((lo, index) => (
                <tr key={index}>
                  <td>{lo.ngaySanXuat}</td>
                  <td>{lo.ngayHetHan}</td>
                  <td>{lo.soLuong}</td>
                  <td>{lo.nhaCungCap}</td>
                  <td>{lo.donGiaBan}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Thuoc;
