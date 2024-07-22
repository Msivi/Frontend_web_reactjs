import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import { getLoaiDichVu, getLoaiThuoc, getLoaiThietBi, themloaithietbi, themThuoc } from "assets/serviceAPI/userService";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { Table, InputGroup, FormControl } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.min.css';
import "./danhmucloai.css";
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faAdd } from '@fortawesome/free-solid-svg-icons';

function Danhmucloai() {
  const [listLoaiDV, setlistLoaiDV] = useState([]);
  const [listLoaiThuoc, setlistLoaiThuoc] = useState([]);
  const [listLoaiThietBi, setlistLoaiThietBi] = useState([]);
  const [filteredLoaiThuoc, setFilteredLoaiThuoc] = useState([]);
  const [filteredLoaiThietBi, setFilteredLoaiThietBi] = useState([]);
  const [searchTermThuoc, setSearchTermThuoc] = useState("");
  const [searchTermThietBi, setSearchTermThietBi] = useState("");
  const [show, setShow] = useState(false);
  const [tenLoaiThietBi, settenLoaiThietBi] = useState("");
  const [tenLoaiThuoc, settenLoaiThuoc] = useState("");

  const [editTenLoaiThuoc, seteditTenLoaiThuoc] = useState("");
  const [editId, seteditId] = useState("");

  const [showAddThuoc, setShowAddThuoc] = useState(false);
  const [showUpdateThuoc, setShowUpdateThuoc] = useState(false);
  const [showUpdateThietBi, setShowUpdateThietBi] = useState(false);
  const [editTenLoaiThietBi, seteditTenLoaiThietBi] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseAddThuoc = () => setShowAddThuoc(false);
  const handleShowAddThuoc = () => setShowAddThuoc(true);

  const handleCloseUpdateThuoc = () => setShowUpdateThuoc(false);

  const handleShowUpdateThuoc = (serviceId) => {
    setShowUpdateThuoc(true);
    axios.get(`http://localhost:5199/api/LoaiThuoc/get-loai-thuoc-by-id?id=${serviceId}`)
      .then((result) => {
        seteditTenLoaiThuoc(result.data.tenLoaiThuoc);
        seteditId(serviceId); // Ensure editId is set
      })
      .catch((error) => {
        console.log(error);
        toast.error('Không tìm thấy thông tin thuốc!');
      });
  };

  const handleCloseUpdateThietBi = () => setShowUpdateThietBi(false);
  const handleShowUpdateThietBi = (serviceId) => {
    setShowUpdateThietBi(true);
    axios.get(`http://localhost:5199/api/LoaiThietBi/get-loai-thiet-bi-by-id?id=${serviceId}`)
      .then((result) => {
        seteditTenLoaiThietBi(result.data.tenLoaiThietBi);
        seteditId(serviceId); // Ensure editId is set
      })
      .catch((error) => {
        console.log(error);
        toast.error('Không tìm thấy thông tin thiết bị!');
      });
  };

  const handleDeleteThuoc = async (keyId) => {
    if (window.confirm("Bạn Có Chắc Muốn Xóa Không?")) {
      axios.delete(`http://localhost:5199/api/LoaiThuoc/delete-loai-thuoc?keyId=${keyId}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Success");
            window.location.reload();
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const handleDeleteThietBi = async (keyId) => {
    if (window.confirm("Bạn Có Chắc Muốn Xóa Không?")) {
      axios.delete(`http://localhost:5199/api/LoaiThietBi/delete-loai-thiet-bi?keyId=${keyId}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Xóa Thành Công");
            window.location.reload();
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const handleAddThietBi = async () => {
    try {
      const res = await themloaithietbi(tenLoaiThietBi);
      if (res) {
        settenLoaiThietBi(tenLoaiThietBi);
        toast.success("Thêm Thành Công");
        window.location.reload();
      } else {
        toast.error('Lỗi');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddThuoc = async () => {
    try {
      const res = await themThuoc(tenLoaiThuoc);
      if (res) {
        settenLoaiThuoc(tenLoaiThuoc);
        toast.success("Thêm Thành Công");
        window.location.reload();
      } else {
        toast.error('Lỗi');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateThuoc = async () => {
    if (!editId || !editTenLoaiThuoc) {
      toast.error('ID và Tên Loại Thuốc không được để trống');
      return;
    }

    const url = `http://localhost:5199/api/LoaiThuoc/update-loai-thuoc?id=${editId}`;
    const data = {
      tenLoaiThuoc: editTenLoaiThuoc,
    };

    try {
      const result = await axios.put(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (result.status === 200) {
        toast.success("Cập Nhật Thành Công");
        window.location.reload();
      } else {
        toast.error('Lỗi');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi cập nhật thuốc');
    }
  };

  const handleUpdateThietBi = async () => {
    if (!editId || !editTenLoaiThietBi) {
      toast.error('ID và Tên Loại Thiết Bị không được để trống');
      return;
    }

    const url = `http://localhost:5199/api/LoaiThietBi/update-loai-thiet-bi?id=${editId}`;
    const data = {
      tenLoaiThietBi: editTenLoaiThietBi,
    };

    try {
      const result = await axios.put(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (result.status === 200) {
        toast.success("Ghi Nhận Thành Công");
        window.location.reload();
      } else {
        toast.error('Lỗi');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi cập nhật thiết bị');
    }
  };

  const GETLOAITHUOC = async () => {
    let res = await getLoaiThuoc();
    if (res) {
      setlistLoaiThuoc(res);
      setFilteredLoaiThuoc(res);
      settenLoaiThuoc(res.tenLoaiThuoc);
    }
  };

  const GETLOAITHIETBI = async () => {
    let res = await getLoaiThietBi();
    if (res) {
      setlistLoaiThietBi(res);
      setFilteredLoaiThietBi(res);
    }
  };

  const GETLOAIDV = async () => {
    let res = await getLoaiDichVu();
    if (res) {
      setlistLoaiDV(res);
    }
  };

  useEffect(() => {
    GETLOAITHUOC();
    GETLOAIDV();
    GETLOAITHIETBI();
  }, []);

  useEffect(() => {
    const filteredThuoc = listLoaiThuoc.filter(item =>
      item.tenLoaiThuoc.toLowerCase().includes(searchTermThuoc.toLowerCase())
    );
    setFilteredLoaiThuoc(filteredThuoc);
  }, [searchTermThuoc, listLoaiThuoc]);

  useEffect(() => {
    const filteredThietBi = listLoaiThietBi.filter(item =>
      item.tenLoaiThietBi.toLowerCase().includes(searchTermThietBi.toLowerCase())
    );
    setFilteredLoaiThietBi(filteredThietBi);
  }, [searchTermThietBi, listLoaiThietBi]);

  return (
    <>
      <div style={{ marginTop: '-50px' }} className="container">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-user">
                <h1 className="h11" >Loại Dịch Vụ</h1>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Id</th>
                      <th style={{ width: '80%' }}>Tên Loại Dịch Vụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listLoaiDV.map((list, index) => (
                      <tr key={index}>
                        <td>{list.id}</td>
                        <td>{list.tenLoai}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <div style={{marginTop:-140}}  className="content mt-5">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-user">
                <h1 className="h11"> Loại Thuốc</h1>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Tìm kiếm loại thuốc"
                    value={searchTermThuoc}
                    onChange={(e) => setSearchTermThuoc(e.target.value)}
                  />
                </InputGroup>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Id</th>
                      <th style={{ width: '50%' }}>Tên Loại Thuốc</th>
                      <th>Chỉnh Sửa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLoaiThuoc.map((list, index) => (
                      <tr key={index}>
                        <td>{list.id}</td>
                        <td>{list.tenLoaiThuoc}</td>
                        <td>
                          <div className="action-buttons-loaithuoc">
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              style={{ cursor: 'pointer', marginLeft: '10px', color: 'blue' }}
                              onClick={() => handleDeleteThuoc(list.id)}
                            />
                            <FontAwesomeIcon
                              icon={faEdit}
                              style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                              onClick={() => handleShowUpdateThuoc(list.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <FontAwesomeIcon
                  icon={faAdd}
                  style={{ cursor: 'pointer', marginLeft: '10px', color: 'black' }}
                  onClick={handleShowAddThuoc}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="content mt-5">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-user">
                <h1  className="h11">Loại Thiết Bị</h1>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Tìm kiếm loại thiết bị"
                    value={searchTermThietBi}
                    onChange={(e) => setSearchTermThietBi(e.target.value)}
                  />
                </InputGroup>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Id</th>
                      <th style={{ width: '50%' }}>Tên Loại Thiết Bị</th>
                      <th>Chỉnh Sửa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLoaiThietBi.map((list, index) => (
                      <tr key={index}>
                        <td>{list.id}</td>
                        <td>{list.tenLoaiThietBi}</td>
                        <td>
                          <div className="action-buttons-thietbi">
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              style={{ cursor: 'pointer', marginLeft: '10px', color: 'blue' }}
                              onClick={() => handleDeleteThietBi(list.id)}
                            />
                            <FontAwesomeIcon
                              icon={faEdit}
                              style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                              onClick={() => handleShowUpdateThietBi(list.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <FontAwesomeIcon
                  icon={faAdd}
                  style={{ cursor: 'pointer', marginLeft: '10px', color: 'black' }}
                  onClick={handleShow}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showUpdateThuoc} onHide={handleCloseUpdateThuoc}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh Sửa Thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Tên Loại Thuốc</label>
              <input type="text" value={editTenLoaiThuoc} onChange={(e) => seteditTenLoaiThuoc(e.target.value)} className="form-control" />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateThuoc}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleUpdateThuoc}>
            Xác Nhận
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddThuoc} onHide={handleCloseAddThuoc}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Tên Loại Thuốc</label>
              <input
                type="text"
                className="form-control"
                value={tenLoaiThuoc}
                onChange={(event) => settenLoaiThuoc(event.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddThuoc}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddThuoc}>
            Xác Nhận
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Thiết Bị</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Tên Thiết Bị</label>
              <input
                type="text"
                className="form-control"
                value={tenLoaiThietBi}
                onChange={(event) => settenLoaiThietBi(event.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddThietBi}>
            Xác Nhận
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateThietBi} onHide={handleCloseUpdateThietBi}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh Sửa Thiết Bị</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Tên Thiết Bị</label>
              <input type="text" value={editTenLoaiThietBi} onChange={(e) => seteditTenLoaiThietBi(e.target.value)} className="form-control" />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateThietBi}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleUpdateThietBi}>
            Xác Nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Danhmucloai;
