import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { Card, Table, Form, Button } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import Rating from 'react-rating-stars-component';
import './ketquadichvu.css'; // Import custom CSS file for additional styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrinStars, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
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

function Ketquadichvu() {
    const [results, setResults] = useState([]);
    const [reviewContent, setReviewContent] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [selectedResult, setSelectedResult] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const devicesPerPage = 5;

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const resultResponse = await axios.get('http://localhost:5199/api/KetQuaDichVu/get-all-ket-qua-dich-vu-khach-hang');
            const approvedReviewResponse = await axios.get('http://localhost:5199/api/DanhGia/get-all-danh-gia-da-duyet');
            const pendingReviewResponse = await axios.get('http://localhost:5199/api/DanhGia/get-all-danh-gia-chua-duyet');

            const approvedReviews = approvedReviewResponse.data.map(review => review.maKetQuaDichVu.toString());
            const pendingReviews = pendingReviewResponse.data.map(review => review.maKetQuaDichVu.toString());

            const updatedResults = resultResponse.data.map(result => {
                const isReviewed = approvedReviews.includes(result.maKetQua.toString()) || pendingReviews.includes(result.maKetQua.toString());
                return {
                    ...result,
                    isReviewed,
                };
            }).sort((a, b) => b.maKetQua - a.maKetQua); // Sắp xếp từ mới nhất đến cũ nhất

            console.log("Approved reviews: ", approvedReviews);
            console.log("Pending reviews: ", pendingReviews);
            console.log("Updated results: ", updatedResults);

            setResults(updatedResults);
        } catch (error) {
            toast.error("Failed to fetch service results");
            console.error("There was an error fetching the service results!", error);
        }
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!selectedResult) {
            toast.error("Please select a result to review");
            return;
        }

        const formData = new FormData();
        formData.append("noiDungDanhGia", reviewContent);
        formData.append("soSaoDanhGia", reviewRating);
        formData.append("MaKetQuaDichVu", selectedResult.maKetQua);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        axios.post('http://localhost:5199/api/DanhGia/create-danh-gia', formData)
            .then(response => {
                toast.success("Cám Ơn Bạn Đã Sử Dụng Dịch Vụ Của Chúng Tôi");
                window.location.reload();
                setReviewContent("");
                setReviewRating(0);
                setImageFile(null);
                setSelectedResult(null);
            })
            .catch(error => {
                toast.error("Bạn Đã Đánh Giá Rồi Không Được Phép Đánh Gía Nữa");
                console.error("There was an error submitting the review!", error);
            });
    };

    const totalPages = Math.ceil(results.length / devicesPerPage);
    const indexOfLastDevice = currentPage * devicesPerPage;
    const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
    const currentDevices = results.slice(indexOfFirstDevice, indexOfLastDevice);

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
            <Card style={{marginTop:80}} className="custom-card">
                <Card.Header className="custom-card-header">Kết Quả Dịch Vụ</Card.Header>
                <Card.Body className="custom-card-body">
                <h1 style={{fontWeight:'bold',color:'red',fontFamily:'arial',textAlign:'center'}}> Kết Quả Dịch Vụ</h1>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mô Tả</th>
                                <th>Địa Điểm</th>
                                <th>Tên Bác Sĩ</th>
                                <th>Tên Dịch Vụ</th>
                                <th>Đánh Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDevices.map((result, index) => (
                                <tr key={index}>
                                    <td>{result.maKetQua}</td>
                                    <td>{result.moTa}</td>
                                    <td>{result.diaDiem}</td>
                                    <td>{result.tenBacSi}</td>
                                    <td>{result.tenDichVu}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faGrinStars}
                                            style={{ cursor: result.isReviewed ? 'default' : 'pointer', color: result.isReviewed ? 'green' : 'red' }}
                                            onClick={() => !result.isReviewed && setSelectedResult(result)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
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
                </Card.Body>
            </Card>

            {selectedResult && (
                <Card className="custom-card">
                    <Card.Header className="custom-card-header">Submit Review for {selectedResult.tenDichVu}</Card.Header>
                    <Card.Body className="custom-card-body">
                        <Form onSubmit={handleReviewSubmit}>
                            <Form.Group controlId="reviewContent">
                                <Form.Label>Nội Dung Đánh Giá</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={reviewContent}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="reviewRating">
                                <Form.Label>Rating</Form.Label>
                                <Rating
                                    count={5}
                                    size={24}
                                    value={reviewRating}
                                    onChange={newRating => setReviewRating(newRating)}
                                    activeColor="#ffd700"
                                />
                            </Form.Group>
                            <Form.Group controlId="imageFile">
                                <Form.Label>File Ảnh</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Đánh Giá
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </>
    );
}

export default Ketquadichvu;
