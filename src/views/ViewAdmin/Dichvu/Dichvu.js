import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { Form, Row, Col, Button, Card, Table } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import './dichvu.css';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faAdd, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Dichvu() {
    const [tenDichVu, setTenDichVu] = useState('');
    const [moTa, setMoTa] = useState('');
    const [gia, setGia] = useState('');
    const [maLoaiDichVu, setMaLoaiDichVu] = useState('');
    const [maChuyenKhoa, setMaChuyenKhoa] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loaiDichVu, setLoaiDichVu] = useState([]);
    const [chuyenKhoa, setChuyenKhoa] = useState([]);
    const [dichVuList, setDichVuList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLoaiDichVu, setFilterLoaiDichVu] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 5;

    const [showUpdateDV, setShowUpdateDV] = useState(false);
    const handleCloseUpdateDVc = () => setShowUpdateDV(false);

    const [edittenDichVu, setedittenDichVu] = useState("");
    const [editId, seteditId] = useState("");
    const [editmoTa, seteditmoTa] = useState("");
    const [editgia, seteditgia] = useState("");
    const [editmaLoaiDichVu, seteditmaLoaiDichVu] = useState("");
    const [editmaChuyenKhoa, seteditmaChuyenKhoa] = useState("");
    const [editImageUrl, seteditImageUrl] = useState("");
    const [editImageFile, seteditImageFile] = useState(null);

    const handleShowUpdateThuoc = (id) => {
        setShowUpdateDV(true);
        axios.get(`http://localhost:5199/api/DichVu/get-dich-vu-by-id?id=${id}`)
          .then((result) => {
            setedittenDichVu(result.data.tenDichVu);
            seteditmoTa(result.data.moTa);
            seteditgia(result.data.gia);
            seteditmaLoaiDichVu(result.data.maLoaiDichVu);
            seteditmaChuyenKhoa(result.data.maChuyenKhoa);
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

      const handleUpdate = async () => {
        const url = `http://localhost:5199/api/DichVu/update-dich-vu?id=${editId}`;
        const formData = new FormData();
        formData.append('id', editId);
        formData.append('tenDichVu', edittenDichVu);
        formData.append('moTa', editmoTa);
        formData.append('gia', editgia);
        formData.append('maLoaiDichVu', editmaLoaiDichVu);
        formData.append('maChuyenKhoa', editmaChuyenKhoa);
     
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

    useEffect(() => {
        // Fetch Loai Dich Vu
        axios.get('http://localhost:5199/api/LoaiDichVu/get-all-loai-dich-vu')
            .then(response => {
                setLoaiDichVu(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the loai dich vu!", error);
            });

        // Fetch Chuyen Khoa
        axios.get('http://localhost:5199/api/ChuyenKhoa/get-all-chuyen-khoa')
            .then(response => {
                setChuyenKhoa(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the chuyen khoa!", error);
            });

        // Fetch all Dich Vu
        fetchAllDichVu();
    }, []);

    const fetchAllDichVu = () => {
        axios.get('http://localhost:5199/api/DichVu/get-all-dich-vu')
            .then(response => {
                const dichVuList = response.data;
                const updatedDichVuList = dichVuList.map(dichVu => ({
                    ...dichVu,
                    tenLoai: '',
                    tenChuyenKhoa: ''
                }));

                // Fetch additional details for each service
                Promise.all(updatedDichVuList.map(dichVu => fetchAdditionalInfo(dichVu)))
                    .then(updatedList => {
                        setDichVuList(updatedList);
                    });
            })
            .catch(error => {
                console.error("There was an error fetching the dich vu list!", error);
            });
    };

    const fetchAdditionalInfo = async (dichVu) => {
        try {
            const loaiDichVuResponse = await axios.get(`http://localhost:5199/api/LoaiDichVu/get-loai-dich-vu-by-id?id=${dichVu.maLoaiDichVu}`);
            const chuyenKhoaResponse = await axios.get(`http://localhost:5199/api/ChuyenKhoa/get-chuyen-khoa-by-id?id=${dichVu.maChuyenKhoa}`);

            return {
                ...dichVu,
                tenLoai: loaiDichVuResponse.data.tenLoai,
                tenChuyenKhoa: chuyenKhoaResponse.data.tenChuyenKhoa
            };
        } catch (error) {
            console.error("There was an error fetching additional info!", error);
            return dichVu;
        }
    };

    const handleDeleteDichVu = async (id) => {
        if (window.confirm("Bạn Có Chắc Muốn Xóa Không?")) {
            axios.delete(`http://localhost:5199/api/DichVu/delete-dich-vu/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success("Success");
                        fetchAllDichVu(); // Refresh the list after deleting
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('tenDichVu', tenDichVu);
        formData.append('moTa', moTa);
        formData.append('gia', gia);
        formData.append('maLoaiDichVu', maLoaiDichVu);
        formData.append('maChuyenKhoa', maChuyenKhoa);
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }

        axios.post('http://localhost:5199/api/DichVu/create-dich-vu', formData)
            .then(response => {
                toast.success('Dịch vụ đã được tạo thành công!');
                window.location.reload();
                fetchAllDichVu(); // Refresh the list after adding a new service
            })
            .catch(error => {
                toast.error('Đã xảy ra lỗi khi tạo dịch vụ!');
                console.error("There was an error creating the service!", error);
            });
    };

    const filteredDichVuList = dichVuList.filter(dichVu => {
        return (
            (!filterLoaiDichVu || dichVu.tenLoai.includes(filterLoaiDichVu)) &&
            (!searchQuery || dichVu.tenDichVu.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    const totalPages = Math.ceil(filteredDichVuList.length / servicesPerPage);

    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredDichVuList.slice(indexOfFirstService, indexOfLastService);

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
        <>
            <Card className="form-container mt-5">
                <Card.Header className="bg-primary text-white">
                    <h3>Tạo Dịch Vụ</h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit} className="mt-3">
                        <Form.Group as={Row} className="mb-3" controlId="tenDichVu">
                            <Form.Label column sm={3}>Tên Dịch Vụ *</Form.Label>
                            <Col sm={9}>
                                <Form.Control type="text" value={tenDichVu} onChange={(e) => setTenDichVu(e.target.value)} required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="moTa">
                            <Form.Label column sm={3}>Mô Tả *</Form.Label>
                            <Col sm={9}>
                                <Form.Control type="text" value={moTa} onChange={(e) => setMoTa(e.target.value)} required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="gia">
                            <Form.Label column sm={3}>Giá *</Form.Label>
                            <Col sm={9}>
                                <Form.Control type="number" value={gia} onChange={(e) => setGia(e.target.value)} required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="maLoaiDichVu">
                            <Form.Label column sm={3}>Loại Dịch Vụ *</Form.Label>
                            <Col sm={9}>
                                <Form.Control as="select" value={maLoaiDichVu} onChange={(e) => setMaLoaiDichVu(e.target.value)} required>
                                    <option value="">Chọn loại dịch vụ</option>
                                    {loaiDichVu.map(loai => (
                                        <option key={loai.id} value={loai.id}>{loai.tenLoai}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="maChuyenKhoa">
                            <Form.Label column sm={3}>Chuyên Khoa *</Form.Label>
                            <Col sm={9}>
                                <Form.Control as="select" value={maChuyenKhoa} onChange={(e) => setMaChuyenKhoa(e.target.value)} required>
                                    <option value="">Chọn chuyên khoa</option>
                                    {chuyenKhoa.map(khoa => (
                                        <option key={khoa.id} value={khoa.id}>{khoa.tenChuyenKhoa}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="imageFile">
                            <Form.Label column sm={3}>Hình Ảnh</Form.Label>
                            <Col sm={9}>
                                <Form.Control type="file" onChange={(e) => setImageFile(e.target.files[0])} />
                            </Col>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit">Tạo Dịch Vụ</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <div className="table-container mt-5">
                <h2>Danh Sách Dịch Vụ</h2>
                <Form.Group as={Row} className="mb-3" controlId="formSearch">
                    <Col sm="6">
                        <Form.Control 
                            type="text" 
                            placeholder="Tìm kiếm theo tên" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Col>
                    <Col sm="4">
                        <Form.Control 
                            as="select" 
                            value={filterLoaiDichVu}
                            onChange={(e) => setFilterLoaiDichVu(e.target.value)}
                        >
                            <option value="">Lọc theo loại dịch vụ</option>
                            {loaiDichVu.map(loai => (
                                <option key={loai.id} value={loai.tenLoai}>{loai.tenLoai}</option>
                            ))}
                        </Form.Control>
                    </Col>
                    <Col sm="2">
                        <Button style={{marginTop:-1}} variant="secondary" onClick={() => {setSearchQuery(''); setFilterLoaiDichVu('');}}>Load</Button>
                    </Col>
                </Form.Group>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên Dịch Vụ</th>
                            <th>Mô Tả</th>
                            <th>Giá</th>
                            <th>Loại Dịch Vụ</th>
                            <th>Chuyên Khoa</th>
                            <th>Hình Ảnh</th>
                            <th>Chỉnh Sửa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentServices.map((dichVu, index) => (
                            <tr key={dichVu.id}>
                                <td>{index + 1 + (currentPage - 1) * servicesPerPage}</td>
                                <td>{dichVu.tenDichVu}</td>
                                <td>{dichVu.moTa}</td>
                                <td>{dichVu.gia}</td>
                                <td>{dichVu.tenLoai}</td>
                                <td>{dichVu.tenChuyenKhoa}</td>
                                <td>{dichVu.hinhAnh ? <img src={`http://localhost:5199${dichVu.hinhAnh}`} alt={dichVu.tenDichVu} style={{width: '100px'}} /> : ''}</td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        style={{ cursor: 'pointer', color:'blue' }}
                                        onClick={() => handleDeleteDichVu(dichVu.id)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                                        onClick={() => handleShowUpdateThuoc(dichVu.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="pagination">
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
                </div>
            </div>

            <Modal show={showUpdateDV} onHide={handleCloseUpdateDVc}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh Dịch Vụ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>Tên Dịch Vụ</label>
                            <input type="text" value={edittenDichVu} onChange={(e) => setedittenDichVu(e.target.value)} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Mô Tả</label>
                            <input type="text" value={editmoTa} onChange={(e) => seteditmoTa(e.target.value)} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Đơn Giá</label>
                            <input type="text" value={editgia} onChange={(e) => seteditgia(e.target.value)} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Dịch Vụ</label>
                            <select value={editmaLoaiDichVu} onChange={(e) => seteditmaLoaiDichVu(e.target.value)} className="form-control">
                                <option value="">Chọn Loại Dịch Vụ</option>
                                {loaiDichVu.map((lt) => (
                                    <option key={lt.id} value={lt.id}>
                                        {lt.tenLoai}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Chuyên Khoa</label>
                            <select value={editmaChuyenKhoa} onChange={(e) => seteditmaChuyenKhoa(e.target.value)} className="form-control">
                                <option value="">Chọn Loại Chuyên Khoa</option>
                                {chuyenKhoa.map((lt) => (
                                    <option key={lt.id} value={lt.id}>
                                        {lt.tenChuyenKhoa}
                                    </option>
                                ))}
                            </select>
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
         
                    <Button variant="primary" onClick={handleUpdate}>
                        Xác Nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Dichvu;
