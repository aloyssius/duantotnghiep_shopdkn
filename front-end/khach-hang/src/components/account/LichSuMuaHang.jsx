// react
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// third-party
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// data stubs
import theme from '../../data/theme';
import { formatCurrencyVnd } from '../../utils/formatNumber';
import useLoading from '../../hooks/useLoading';

export default function LichSuMuaHang() {

  const { onOpenLoading, onCloseLoading } = useLoading();

  const [data, setData] = useState([]);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu
    const layDuLieuTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const taiKhoan = JSON.parse(localStorage.getItem('tai-khoan'));
        const response = await axios.get(`http://127.0.0.1:8000/api/danh-sach-don-hang-cua-tai-khoan/${taiKhoan?.id}`);
        // nếu gọi api thành công sẽ set dữ liệu
        setData(response.data.data); // set dữ liệu được trả về từ backend
        console.log(response.data.data)
      } catch (error) {
        console.error(error);
        // console ra lỗi
      } finally {
        onCloseLoading();
        // tắt loading
      }
    }

    // gọi hàm vừa khai báo
    layDuLieuTuBackEnd();
  }, []) // hàm được gọi lần đầu tiên và sẽ gọi lại khi id thương hiệu thay đổi

  const ordersList = data?.map((donHang) => (
    <tr key={donHang.id}>
      <td><Link className="text-decoration" style={{ fontWeight: '500' }} to={`/thong-tin-don-hang/${donHang?.ma}`}>{`#${donHang?.ma}`}</Link></td>
      <td>{donHang.ngayTao}</td>
      <td>{convertOrderStatus(donHang.trangThai)}</td>
      <td>{formatCurrencyVnd(String(donHang.tongTien))}</td>
    </tr>
  ));

  return (
    <div className="card container mt-4">
      <Helmet>
        <title>{`Lịch sử mua hàng — ${theme.name}`}</title>
      </Helmet>

      <div className="card-header">
        <h5>Lịch sử mua hàng</h5>
      </div>
      <div className="card-divider" />
      <div className="card-table">
        <div className="table-responsive-sm">
          <table >
            <thead>
              <tr>
                <th className='text-dark'>Mã đơn hàng</th>
                <th className='text-dark'>Ngày tạo</th>
                <th className='text-dark'>Trạng thái</th>
                <th className='text-dark'>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {ordersList}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
const convertOrderStatus = (status) => {
  let statusConverted = "";
  switch (status) {
    case "cho_xac_nhan":
      statusConverted = "Chờ xác nhận";
      break;
    case "cho_giao_hang":
      statusConverted = "Chờ giao hàng";
      break;
    case "dang_giao_hang":
      statusConverted = "Đang giao hàng";
      break;
    case "hoan_thanh":
      statusConverted = "Đã giao";
      break;
    default:
      statusConverted = "Đã hủy";
      break;
  }

  return statusConverted;
}
