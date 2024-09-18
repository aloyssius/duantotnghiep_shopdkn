// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';
import { Cross12Svg } from '../../svg';

// data stubs
import theme from '../../data/theme';
import { formatCurrencyVnd } from '../../utils/formatNumber';
import axios from 'axios';
import useNotification from '../../hooks/useNotification';
import useLoading from '../../hooks/useLoading';

function GioHang() {

  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();

  const { onOpenLoading, onCloseLoading } = useLoading();
  const history = useHistory();
  const taiKhoan = JSON.parse(localStorage.getItem('tai-khoan'));
  const listGioHangChiTiet = taiKhoan ? JSON.parse(localStorage.getItem('gio-hang-chi-tiet-tai-khoan')) : []; // lấy ra giỏ hàng chi tiết hiện tại trong bộ nhớ trình duyệt

  const tongTienHang = listGioHangChiTiet && listGioHangChiTiet.reduce((total, item) => total + (item?.don_gia * item?.so_luong), 0);

  const deleteGioHangChiTiet = async (id) => {
    // bật loading
    onOpenLoading();
    try {
      // gọi api từ backend
      const response = await axios.delete(`http://127.0.0.1:8000/api/xoa-gio-hang-chi-tiet/${id}`);
      // nếu gọi api thành công sẽ set dữ liệu giỏ hàng của tài khoản vào bộ nhớ trình duyệt
      localStorage.setItem('gio-hang-chi-tiet-tai-khoan', JSON.stringify(response.data.data));
      onOpenSuccessNotify('Xóa thành công');
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.response.data.message);
      // console ra lỗi
    } finally {
      onCloseLoading();
      // tắt loading
    }
  }

  const cart = (
    <div className="cart block">
      <div className="container">
        <table className="cart__table cart-table">
          <thead className="cart-table__head">
            <tr className="cart-table__row">
              <th className="cart-table__column cart-table__column--image">Hình ảnh</th>
              <th className="cart-table__column cart-table__column--product">Tên sản phẩm</th>
              <th className="cart-table__column cart-table__column--quantity">Kích cỡ</th>
              <th className="cart-table__column cart-table__column--quantity">Số lượng</th>
              <th className="cart-table__column cart-table__column--price">Đơn giá</th>
              <th className="cart-table__column cart-table__column--total">Thành tiền</th>
              <th className="cart-table__column cart-table__column--remove" aria-label="Remove" />
            </tr>
          </thead>
          <tbody className="cart-table__body">
            {listGioHangChiTiet?.map((item, index) => {
              return (
                <tr key={index} className="cart-table__row">
                  <td className="cart-table__column cart-table__column--image">
                    <img src={item?.hinh_anh} alt="img" />
                  </td>
                  <td className="cart-table__column cart-table__column--product" >
                    <Link to={`/san-pham/${item?.ma}`} className="cart-table__product-name">
                      <span className='' style={{ fontWeight: '500' }}>
                        {item?.ten}
                      </span>
                    </Link>
                  </td>
                  <td className="cart-table__column cart-table__column--quantity" data-title="Kích cỡ" >
                    <span className='' style={{ fontWeight: '500' }}>
                      {item?.ten_kich_co}
                    </span>
                  </td>
                  <td className="cart-table__column cart-table__column--quantity" data-title="Số lượng">
                    <span className='' style={{ fontWeight: '500' }}>
                      {item?.so_luong}
                    </span>
                  </td>
                  <td className="cart-table__column cart-table__column--price" data-title="Đơn giá" style={{ fontWeight: '500' }}>
                    {formatCurrencyVnd(String(item?.don_gia))}
                  </td>
                  <td className="cart-table__column cart-table__column--total product__price" data-title="Thành tiền">
                    {formatCurrencyVnd(String(item?.don_gia * item.so_luong))}
                  </td>
                  <td className="cart-table__column cart-table__column--remove">
                    <button type="button" onClick={() => deleteGioHangChiTiet(item?.id)} className='btn btn-light btn-sm btn-svg-icon'>
                      <Cross12Svg />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="row justify-content-end pt-md-5 pt-4">
          <div className="col-12 col-md-7 col-lg-6 col-xl-5">
            <div className="card">
              <div className="card-body-cart">
                <h4 className="text-uppercase">Thông tin đơn hàng</h4>
                <div className='border-top-cart-page' />
                <table className="cart__totals">
                  <tfoot className="cart__totals-footer">
                    <tr>
                      <th className='total-cart' style={{ fontWeight: 'bold' }}>Tổng tiền hàng</th>
                      <td className='total-cart' style={{ fontWeight: 'bold' }}>{formatCurrencyVnd(String(tongTienHang))}</td>
                    </tr>
                  </tfoot>
                </table>
                <button onClick={() => history.push('/thanh-toan')} className="btn btn-primary btn-xl btn-block cart__checkout-button">
                  Tiếp tục thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const breadcrumb = [
    { title: 'Trang chủ', url: '/' },
    { title: 'Giỏ hàng', url: '' },
  ];

  let content;

  if (listGioHangChiTiet?.length > 0) {
    content = cart;
  } else {
    content = (
      <div className="block block-empty">
        <div className="container">
          <div className="block-empty__body">
            <div className="block-empty__message">Chưa có sản phẩm trong giỏ hàng!</div>
            <div className="block-empty__actions">
              <Link to={'/'} className="btn btn-primary btn-sm">Tiếp tục mua hàng!</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Giỏ hàng của bạn — ${theme.name}`}</title>
      </Helmet>

      <PageHeader header="Giỏ hàng của bạn" breadcrumb={breadcrumb} />

      {content}
    </React.Fragment>
  );
}

export default GioHang;
