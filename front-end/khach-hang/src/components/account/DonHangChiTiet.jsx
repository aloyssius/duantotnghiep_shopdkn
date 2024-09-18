// react
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// third-party
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import theme from '../../data/theme';
import { formatCurrencyVnd } from '../../utils/formatNumber';
import PageHeader from '../shared/PageHeader';
import useLoading from '../../hooks/useLoading';

export default function DonHangChiTiet() {

  const { ma } = useParams();

  const { onOpenLoading, onCloseLoading } = useLoading();

  const [data, setData] = useState([]);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu
    const layDuLieuTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get(`http://127.0.0.1:8000/api/chi-tiet-don-hang/${ma}`);
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

  const breadcrumb = [
    { title: 'Trang chủ', url: '/' },
    { title: 'Thông tin đơn hàng', url: '' },
  ];

  const tienShip = data?.tienShip || 0;
  const tongTienHang = data?.tongTien || 0;
  const tongCong = parseInt(tongTienHang) + parseInt(tienShip);

  const listDonHangChiTiet = data?.listDonHangChiTiet?.map((item) => {
    return (
      <>
        <tr key={item?.id} className="cart-table__row">
          <td className="cart-table__column cart-table__column--image">
            <Link to={`/san-pham/${item?.ma}`}><img src={item?.hinh_anh} alt="" /></Link>
          </td>
          <td className="cart-table__column cart-table__column--product" >
            <Link to={`/product-detail/${item?.ma}`} className="cart-table__product-name">
              <span className='' style={{ fontWeight: '500' }}>
                {item?.ten}
              </span>
            </Link>
          </td>
          <td className="cart-table__column cart-table__column--price text-center" data-title="Kích cỡ" >
            {item?.ten_kich_co}
          </td>
          <td className="cart-table__column cart-table__column--price text-center" data-title="Số lượng">
            {item?.so_luong}
          </td>
          <td className="cart-table__column cart-table__column--price" data-title="Đơn giá" style={{ fontWeight: '500' }}>
            {formatCurrencyVnd(String(item?.don_gia))}
          </td>
          <td className="cart-table__column cart-table__column--total product__price" data-title="Thành tiền">
            {formatCurrencyVnd(String(item?.don_gia * item?.so_luong))}
          </td>
        </tr>
      </>
    )
  })

  return (
    <>
      <PageHeader breadcrumb={breadcrumb} />
      <div className="container">
        <React.Fragment>
          <Helmet>
            <title>{`Theo dõi đơn hàng — ${theme.name}`}</title>
          </Helmet>

          <div className="text-center">
            <h1>THÔNG TIN ĐƠN HÀNG</h1>
          </div>
          <div className='d-flex justify-content-between flex-column flex-md-row mt-3 mt-lg-4'>
            <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>TRẠNG THÁI ĐƠN HÀNG: <span className='text-main text-uppercase'>
              {convertOrderStatus(data?.trangThai)}
            </span>
            </span>
          </div>
          <div className='mt-2' style={{ border: "1px solid #333333" }}></div>

          <div className='mt-4 pt-3'>
            <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>DANH SÁCH SẢN PHẨM</span>
          </div>
          <div className='mt-2' style={{ border: "1px solid #333333" }}></div>

          <table className="cart__table cart-table mt-3" style={{ fontSize: 15 }}>
            <thead className="cart-table__head">
              <tr className="cart-table__row">
                <th className="cart-table__column cart-table__column--image">Hình ảnh</th>
                <th className="cart-table__column cart-table__column--product">Tên sản phẩm</th>
                <th className="cart-table__column cart-table__column--price text-center">Kích cỡ</th>
                <th className="cart-table__column cart-table__column--price text-center">Số lượng</th>
                <th className="cart-table__column cart-table__column--price">Đơn giá</th>
                <th className="cart-table__column cart-table__column--total">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="cart-table__body">
              {listDonHangChiTiet}
            </tbody>
          </table>

          <div className='row mb-4'>
            <div className='col-md-6 col-12'>
              <div className='mt-5'>
                <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>THÔNG TIN GIAO HÀNG</span>
              </div>
              <div className='mt-2' style={{ border: "1px solid #333333" }}></div>
              <div className='mt-3'>
                <span className='d-block' style={{ fontSize: 16 }}> <span>Họ tên: {data?.hoVaTen}</span></span>
                <span className='d-block mt-1' style={{ fontSize: 16 }}>Số điện thoại: {data?.soDienThoai}</span>
                <span className='d-block mt-1' style={{ fontSize: 16 }}>Email: {data?.email}</span>
                <span className='d-block mt-1' style={{ fontSize: 16 }}>Địa chỉ: {data?.diaChi}</span>
              </div>
            </div>
            <div className='col-md-6 col-12'>
              <div className='mt-5'>
                <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>THÔNG TIN THANH TOÁN</span>
              </div>
              <div className='mt-2' style={{ border: "1px solid #333333" }}></div>
              <div className='mt-3'>
                <div>
                  <span style={{ fontSize: 16 }}>
                    Hình thức thanh toán: {" "}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                    Thanh toán khi nhận hàng (COD)</span>
                </div>

                <div className='mt-1' >
                  <span style={{ fontSize: 16 }}>
                    Tổng tiền hàng: {" "}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {formatCurrencyVnd(String(tongTienHang))}</span>
                </div>

                <div className='mt-1' >
                  <span style={{ fontSize: 16 }}>
                    Phí vận chuyển: {" "}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {formatCurrencyVnd(String(tienShip))}</span>
                </div>

                <div className='mt-4' style={{ border: "1px dashed #dcdccd" }}></div>

                <div className='mt-4' >
                  <span style={{ fontSize: 16, fontWeight: '500' }}>
                    Cần thanh toán: {" "}
                  </span>
                  <span className='text-main' style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {formatCurrencyVnd(String(tongCong))}</span>
                </div>

              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    </>
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
