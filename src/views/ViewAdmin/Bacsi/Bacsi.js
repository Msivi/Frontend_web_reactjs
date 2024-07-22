import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { Form, Row, Col, Button, Card, Table, Container } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import './bacsi.css'; // Import custom CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faAdd } from '@fortawesome/free-solid-svg-icons';

function Bacsi() {
    const [tenBacSi, setTenBacSi] = useState('');
    const [bangCap, setBangCap] = useState('');
    const [email, setEmail] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [chuyenKhoa, setChuyenKhoa] = useState([]);
    const [selectedBacSi, setSelectedBacSi] = useState('');
    const [selectedChuyenKhoa, setSelectedChuyenKhoa] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const doctorsPerPage = 5;

    useEffect(() => {
        fetchAllDoctors();
        fetchAllChuyenKhoa();
    }, []);

    const fetchAllDoctors = () => {
        axios.get('http://localhost:5199/api/BacSi/get-all-bac-si')
            .then(response => {
                setDoctors(response.data);
            })
            .catch(error => {
                toast.error("Failed to fetch doctors");
            });
    };

    const fetchAllChuyenKhoa = () => {
        axios.get('http://localhost:5199/api/ChuyenKhoa/get-all-chuyen-khoa')
            .then(response => {
                setChuyenKhoa(response.data);
            })
            .catch(error => {
                toast.error("Failed to fetch specialties");
            });
    };

    const handleDeleteBacSi = async (keyId) => {
        if (window.confirm("Bạn Có Chắc Muốn Xóa Không?")) {
            axios.delete(`http://localhost:5199/api/BacSi/delete-bac-si?keyId=${keyId}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success("Success");
                        window.location.reload();
                        fetchAllDoctors(); // Refresh the list after deleting a doctor
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            tenBacSi: tenBacSi,
            bangCap: bangCap,
            email: email,
            matKhau: matKhau
        };

        axios.post('http://localhost:5199/api/Authentication/create-bac-si', data)
            .then(response => {
                toast.success("Tạo Bác Sĩ Thành Công");
                window.location.reload();
                fetchAllDoctors(); // Refresh the list after adding a new doctor
            })
            .catch(error => {
                toast.error("Lỗi");
            });
    };

    const handleSubmitCTBacSi = (event) => {
        event.preventDefault();

        const data = {
            maBacSi: parseInt(selectedBacSi),
            maChuyenKhoa: parseInt(selectedChuyenKhoa)
        };

        axios.post('http://localhost:5199/api/CTBacSi/create-ct-bac-si', data)
            .then(response => {
                window.location.reload();
                toast.success("Tạo Thành Công");
            })
            .catch(error => {
                toast.error("Lỗi Vui lòng chọn chuyên khoa khác");
            });
    };

    const filteredDoctors = doctors.filter(doctor => {
        return (
            (!filterSpecialty || doctor.chuyenKhoa.includes(filterSpecialty)) &&
            (!searchQuery || doctor.tenBacSi.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    // Calculate the number of pages
    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

    // Get the doctors for the current page
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    return (
   
        <Container >
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <h4 style={{fontWeight:'bold',fontSize:40}} className="mb-4">Tạo Bác Sĩ</h4>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formTenBacSi">
                                    <Form.Label>Tên Bác Sĩ</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={tenBacSi}
                                        onChange={(e) => setTenBacSi(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formBangCap">
                                    <Form.Label>Bằng Cấp</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={bangCap}
                                        onChange={(e) => setBangCap(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formMatKhau">
                                    <Form.Label>Mật Khẩu</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        value={matKhau}
                                        onChange={(e) => setMatKhau(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button style={{fontSize:10}} variant="primary" type="submit" className="mt-3">Tạo Bác Sĩ</Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <h4 style={{fontWeight:'bold',fontSize:40}} className="mb-4">Tạo Chuyên Khoa cho Bác Sĩ</h4>
                    <Form onSubmit={handleSubmitCTBacSi}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formChonBacSi">
                                    <Form.Label>Chọn Bác Sĩ</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        value={selectedBacSi}
                                        onChange={(e) => setSelectedBacSi(e.target.value)}
                                        required
                                    >
                                        <option value="">Chọn Bác Sĩ</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>{doctor.tenBacSi}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formChonChuyenKhoa">
                                    <Form.Label>Chọn Chuyên Khoa</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        value={selectedChuyenKhoa}
                                        onChange={(e) => setSelectedChuyenKhoa(e.target.value)}
                                        required
                                    >
                                        <option value="">Chọn Chuyên Khoa</option>
                                        {chuyenKhoa.map(chuyen => (
                                            <option key={chuyen.id} value={chuyen.id}>{chuyen.tenChuyenKhoa}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button style={{fontSize:10}} variant="primary" type="submit" className="mt-3">Tạo Chuyên Khoa cho Bác Sĩ</Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Body>
                    <h4 className="mb-4">Danh Sách Bác Sĩ</h4>
                    <Form.Group as={Row} controlId="formSearch">
                        <Col sm="5">
                            <Form.Control 
                                type="text" 
                                placeholder="Tìm kiếm theo tên" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Col>
                        <Col sm="5">
                            <Form.Control 
                                as="select" 
                                value={filterSpecialty}
                                onChange={(e) => setFilterSpecialty(e.target.value)}
                            >
                                <option value="">Lọc theo chuyên khoa</option>
                                {chuyenKhoa.map(chuyen => (
                                    <option key={chuyen.id} value={chuyen.tenChuyenKhoa}>{chuyen.tenChuyenKhoa}</option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col sm="2">
                            <Button style={{marginTop:-2}} variant="secondary" onClick={() => {setSearchQuery(''); setFilterSpecialty('');}}>Load</Button>
                        </Col>
                    </Form.Group>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên Bác Sĩ</th>
                                <th>Bằng Cấp</th>
                                <th>Chuyên Khoa</th>
                                <th>Hình Ảnh</th>
                                <th>Chỉnh Sửa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDoctors.map(doctor => (
                                <tr key={doctor.id}>
                                    <td>{doctor.id}</td>
                                    <td>{doctor.tenBacSi}</td>
                                    <td>{doctor.bangCap}</td>
                                    <td className="specialty-cell">{doctor.chuyenKhoa}</td>
                                    <td>{doctor.hinhAnh ? <img src={`http://localhost:5199${doctor.hinhAnh}`} alt={doctor.tenBacSi} style={{width: '100px'}} /> : ''}</td>
                                    <td><Button variant="danger" onClick={() => handleDeleteBacSi(doctor.id)}>Xóa</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div  className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                variant={index + 1 === currentPage ? 'primary' : 'secondary'}
                                className="m-1"
                            >
                                {index + 1}
                            </Button>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Bacsi;
