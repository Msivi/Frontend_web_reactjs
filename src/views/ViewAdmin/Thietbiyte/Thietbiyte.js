import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Table, Form, Row, Col, InputGroup } from "react-bootstrap";
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';

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

function ThietBiYTe() {
  const [listThietBi, setListThietBi] = useState([]);
  const [listLoaiThietBi, setListLoaiThietBi] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [filterLoaiThietBi, setFilterLoaiThietBi] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 5;

  const [showUpdateThietBi, setShowUpdateThietBi] = useState(false);
  const handleCloseUpdateThietBi = () => setShowUpdateThietBi(false);

  const [editTenThietBi, setEditTenThietBi] = useState("");
  const [editDonGia, setEditDonGia] = useState("");
  const [editId, setEditId] = useState("");

  const [editNhaSanXuat, setEditNhaSanXuat] = useState("");
  const [editMoTa, setEditMoTa] = useState("");
  const [editMaLoaiThietBi, setEditMaLoaiThietBi] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);

  const [showLothietbiModal, setShowLothietbiModal] = useState(false);
  const [loThietBi, setLoThietBi] = useState([]);

  const handleCloseLothietbiModal = () => setShowLothietbiModal(false);
  const handleShowLothietbiModal = async (maThietBi) => {
    setShowLothietbiModal(true);
    let res = await axios.get(`http://localhost:5199/api/LoThietBiYTe/get-lo-thiet-bi-y-te-by-ma-thiet-bi?maThietBi=${maThietBi}`);
    if (res) {
      setLoThietBi(res.data);
    }
  };

  useEffect(() => {
    GETThietBi();
    GETLoaiThietBi();
  }, []);

  const GETThietBi = async () => {
    let res = await axios.get('http://localhost:5199/api/ThietBiYTe/get-all-thiet-bi-y-te');
    if (res) {
      setListThietBi(res.data);
    }
  };

  const GETLoaiThietBi = async () => {
    let res = await axios.get('http://localhost:5199/api/LoaiThietBi/get-all-loai-thiet-bi');
    if (res) {
      setListLoaiThietBi(res.data);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchKey(value);

    if (value.trim() === "") {
      GETThietBi();
    }
  };

  const handleDeleteThietBi = async (keyId) => {
    if (window.confirm("Bạn Có Chắc Muốn Xóa Không?")) {
      axios.delete(`http://localhost:5199/api/ThietBiYTe/delete-thiet-bi-y-te?keyId=${keyId}`)
      .then((result) => {
        if (result.status === 200) {
          toast.success("Xóa thiết bị thành công");
          GETThietBi();
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
    }
  };

  const handleShowUpdateThietBi = (id) => {
    setShowUpdateThietBi(true);
    axios.get(`http://localhost:5199/api/ThietBiYTe/get-thiet-bi-y-te-by-id?id=${id}`)
      .then((result) => {
        setEditTenThietBi(result.data.tenThietBiYTe);
        setEditDonGia(result.data.donGia);
        setEditNhaSanXuat(result.data.nhaSanXuat);
        setEditMoTa(result.data.moTa);
        setEditMaLoaiThietBi(result.data.maLoaiThietBi);
        setEditId(id);
      })
      .catch((error) => {
        console.log(error);
        toast.error('Không tìm thấy thông tin thiết bị!');
      });
  };

  const handleUpdate = async () => {
    const url = `http://localhost:5199/api/ThietBiYTe/update-thiet-bi-y-te?id=${editId}`;
    const formData = new FormData();
    formData.append('id', editId);
    formData.append('tenThietBi', editTenThietBi);
    formData.append('donGia', editDonGia);
    formData.append('nhaSanXuat', editNhaSanXuat);
    formData.append('moTa', editMoTa);
    if (editMaLoaiThietBi) {
      formData.append('maLoaiThietBi', editMaLoaiThietBi);
    }
    if (editImageFile) {
      formData.append('imageFile', editImageFile);
    }

    try {
      const result = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (result.status === 200) {
        toast.success("Cập nhật thiết bị thành công");
        GETThietBi();
        handleCloseUpdateThietBi();
        window.location.reload();
      } else {
        toast.error('Lỗi cập nhật thiết bị');
      }
    } catch (error) {
      console.error("Error Response:", error.response);
      toast.error(error.response?.data?.message || 'Lỗi cập nhật thiết bị');
    }
  };

  const handleImageChange = (e) => {
    setEditImageFile(e.target.files[0]);
  }

  const handleRowClick = (name) => {
    setSearchKey(name);
  };

  const handleReload = () => {
    setSearchKey("");
    setFilterLoaiThietBi("");
    GETThietBi();
  };

  const filteredDevices = listThietBi.filter(device => {
    return (
      (!filterLoaiThietBi || device.tenDanhMuc.includes(filterLoaiThietBi)) &&
      (!searchKey || device.tenThietBiYTe.toLowerCase().includes(searchKey.toLowerCase()))
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
        <h1 style={{ fontWeight: 'bold', color: 'red', marginLeft: 400 }}>Thiết bị y tế</h1>

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
                value={filterLoaiThietBi}
                onChange={(e) => setFilterLoaiThietBi(e.target.value)}
              >
                <option value="">Lọc theo loại thiết bị</option>
                {listLoaiThietBi.map(loai => (
                  <option key={loai.id} value={loai.tenLoaiThietBi}>{loai.tenLoaiThietBi}</option>
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
              <th>Tên Thiết Bị</th>
              <th>Đơn Giá</th>
              <th>Số Lượng</th>
              <th>Hình Ảnh</th>
              <th>Danh Mục</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {currentDevices.map((list, index) => (
              <tr key={index} onClick={() => handleRowClick(list.tenThietBiYTe)}>
                <td>{list.id}</td>
                <td>{list.tenThietBiYTe}</td>
                <td>{list.donGia}</td>
                <td>{list.soLuong}</td>
                <td>
                  <img style={{ width: "50px" }} src={list.hinhAnh && list.hinhAnh.startsWith("/") ? `http://localhost:5199${list.hinhAnh}` : list.hinhAnh} alt={list.tenThietBiYTe} />
                </td>
                <td>{list.tenDanhMuc}</td>
                <td>
                  <IconContainer>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      style={{ cursor: 'pointer', color: 'blue' }}
                      onClick={() => handleDeleteThietBi(list.id)}
                    />
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() => handleShowUpdateThietBi(list.id)}
                    />
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      style={{ cursor: 'pointer', color: 'green' }}
                      onClick={() => handleShowLothietbiModal(list.id)}
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

      <Modal show={showUpdateThietBi} onHide={handleCloseUpdateThietBi}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh Sửa Thiết Bị</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Tên Thiết Bị</label>
              <input type="text" value={editTenThietBi} onChange={(e) => setEditTenThietBi(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Đơn Giá</label>
              <input type="number" value={editDonGia} onChange={(e) => setEditDonGia(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Nhà Sản Xuất</label>
              <input type="text" value={editNhaSanXuat} onChange={(e) => setEditNhaSanXuat(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Mô Tả</label>
              <input type="text" value={editMoTa} onChange={(e) => setEditMoTa(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Mã Loại Thiết Bị</label>
              <select value={editMaLoaiThietBi} onChange={(e) => setEditMaLoaiThietBi(e.target.value)} className="form-control">
                <option value="">Chọn Loại Thiết Bị</option>
                {listLoaiThietBi.map((lt) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.tenLoaiThietBi}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Hình Ảnh Mới</label>
              <input type="file" onChange={handleImageChange} className="form-control" />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdate}>
            Xác Nhận
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLothietbiModal} onHide={handleCloseLothietbiModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thông Tin Lô Thiết Bị</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
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
              {loThietBi.map((lo, index) => (
                <tr key={index}>
                  <td>{lo.ngaySanXuat}</td>
                  <td>{lo.ngayHetHan}</td>
                  <td>{lo.soLuong}</td>
                  <td>{lo.nhaCungCap}</td>
                  <td>{lo.donGiaBan}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLothietbiModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ThietBiYTe;
