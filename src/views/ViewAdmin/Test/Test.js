import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table } from "react-bootstrap";

function Test() {
    const [devices, setDevices] = useState([]);
    const [deviceEntries, setDeviceEntries] = useState([]);
    const [deviceDetails, setDeviceDetails] = useState([]);

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
    });

    return (
        <div>
            <h2>Danh sách thiết bị y tế nhập vào</h2>
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
                    {combinedData.map((item, index) => (
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
        </div>
    );
}

export default Test;
