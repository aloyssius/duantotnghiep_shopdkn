// react
import React from 'react';
import axios from 'axios';

// third-party
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';
import Collapse from '../shared/Collapse';

// data stubs
import payments from '../../data/shopPayments';
import theme from '../../data/theme';
import { formatCurrencyVnd } from '../../utils/formatNumber';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  FormProvider,
  RHFInput,
} from '../../components/hook-form';
import useNotification from '../../hooks/useNotification';
import useLoading from '../../hooks/useLoading';

function ThanhToan() {

  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();

  const { onOpenLoading, onCloseLoading } = useLoading();
  const history = useHistory();
  const taiKhoan = JSON.parse(localStorage.getItem('tai-khoan'));
  const listGioHangChiTiet = taiKhoan ? JSON.parse(localStorage.getItem('gio-hang-chi-tiet-tai-khoan')) : []; // lấy ra giỏ hàng chi tiết hiện tại trong bộ nhớ trình duyệt
  const tongTienHang = listGioHangChiTiet && listGioHangChiTiet.reduce((total, item) => total + (item?.don_gia * item?.so_luong), 0);

  const thongTinThanhToan = (
    <React.Fragment>
      <tbody className="checkout__totals-subtotals">
        <tr>
          <th>Tổng tiền hàng</th>
          <td>{formatCurrencyVnd(String(tongTienHang))}</td>
        </tr>
        <tr>
          <th>Phí vận chuyển</th>
          <td>30.000 VNĐ</td>
        </tr>
      </tbody>
    </React.Fragment>
  );

  const danhSachSanPham = listGioHangChiTiet?.map((item) => (
    <tr key={item?.id}>
      <td>
        {`${item?.ten} - Kích cỡ: ${item?.ten_kich_co} × ${item?.so_luong}`}
      </td>
      <td>{formatCurrencyVnd(String(parseInt(item?.don_gia) * parseInt(item?.so_luong)))}</td>
    </tr>
  ));

  const tongCong = () => {
    return parseInt(tongTienHang) + parseInt(30000);
  }

  const thongTinDonHang = (
    <>
      <table className="checkout__totals">
        <thead className="checkout__totals-header">
          <tr>
            <th>Sản phẩm</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody className="checkout__totals-products">
          {danhSachSanPham}
        </tbody>
        {thongTinThanhToan}
        <tfoot className="checkout__totals-footer">
          <tr>
            <th style={{ fontWeight: 'bold' }} className='total-final'>Tổng cộng</th>
            <td className='total-final product__price'>{formatCurrencyVnd(String(tongCong()))}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );

  const paymentList = payments.map((payment) => {
    const renderPayment = ({ setItemRef, setContentRef }) => (
      <li className="payment-methods__item" ref={setItemRef}>
        <label className="payment-methods__item-header">
          <span className="payment-methods__item-radio input-radio">
            <span className="input-radio__body">
              <input
                type="radio"
                className="input-radio__input"
                name="checkout_payment_method"
                value={payment.key}
                checked={'cashMethod'}
              />
              <span className="input-radio__circle" />
            </span>
          </span>
          <span className="payment-methods__item-title">{payment.title}</span>
        </label>
        <div className="payment-methods__item-container" ref={setContentRef} style={{ maxHeight: '300px' }}>
          <div className="payment-methods__item-description text-dark">{payment.description}</div>
        </div>
      </li>
    );

    return (
      <Collapse
        key={payment.key}
        open={true}
        toggleClass="payment-methods__item--active"
        render={renderPayment}
      />
    );
  });

  const breadcrumb = [
    { title: 'Trang chủ', url: '/' },
    { title: 'Giỏ hàng', url: '/gio-hang' },
    { title: 'Thanh toán đơn hàng', url: '' },
  ];

  const DonHangSchema = Yup.object().shape({
    email: Yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
    hoVaTen: Yup.string().trim().required('Họ và tên không được để trống'),
    diaChi: Yup.string().trim().required('Địa chỉ không được để trống'),
    soDienThoai: Yup.string().trim().required('SĐT không hợp lệ'),
  });

  const defaultValues = {
    hoVaTen: '',
    email: '',
    soDienThoai: '',
    diaChi: '',
  }

  const methods = useForm({
    resolver: yupResolver(DonHangSchema),
    defaultValues,
  });

  const {
    handleSubmit,
  } = methods;

  const onSubmit = async (data) => {
    const body = {
      ...data,
      tienShip: 30000,
      tongTienHang: tongTienHang,
      listGioHangChiTiet: listGioHangChiTiet,
      idTaiKhoan: taiKhoan?.id,
    }
    console.log(body);

    // bật loading
    onOpenLoading();
    try {
      // gọi api từ backend
      const response = await axios.post("http://127.0.0.1:8000/api/dat-hang", body);
      onOpenSuccessNotify('Đặt hàng thành công');
      console.log(response.data.data);

      localStorage.removeItem('gio-hang-chi-tiet-tai-khoan');
      history.push(`/thong-tin-don-hang/${response.data.data.ma}`);

    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error);
      // console ra lỗi
    } finally {
      onCloseLoading();
      // tắt loading
    }
  }

  return (
    <React.Fragment>
      {listGioHangChiTiet?.length > 0 ?
        <>
          <Helmet>
            <title>{`Thanh toán đơn hàng — ${theme.name}`}</title>
          </Helmet>

          <PageHeader header="Thanh toán đơn hàng" breadcrumb={breadcrumb} />

          <div className="checkout block">
            <div className="container">
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-12 col-lg-6 col-xl-7">
                    <div className="card mb-lg-0">
                      <div className="card-body">
                        <h3 className="card-title">Thông tin giao hàng</h3>
                        <RHFInput name='hoVaTen' topLabel='Họ và tên' placeholder="Nhập họ và tên" isRequired />
                        <RHFInput name='soDienThoai' topLabel='Số điện thoại' placeholder="Nhập số điện thoại" isRequired />
                        <RHFInput name='email' topLabel='Email' placeholder="Nhập email" isRequired />
                        <RHFInput name='diaChi' topLabel='Địa chỉ' placeholder="Nhập địa chỉ" isRequired />
                      </div>

                      <div className="card-body">
                        <h3 className="card-title">Phương thức thanh toán</h3>

                        <div className="payment-methods">
                          <ul className="payment-methods__list">
                            {paymentList}
                          </ul>
                        </div>

                      </div>
                    </div>
                    <div className="card-divider" />

                  </div>

                  <div className="col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0">
                    <div className="card mb-0">
                      <div className="card-body">
                        <h3 className="card-title">Đơn hàng
                          <div className='border-top-cart-page mt-2' />
                        </h3>
                        {thongTinDonHang}
                        <button type="submit" className="btn btn-primary btn-xl btn-block">Hoàn Tất Đặt Hàng</button>
                      </div>
                    </div>
                  </div>
                </div>
              </FormProvider>
            </div>
          </div>
        </>
        :
        <div className="block block-empty mt-5">
          <div className="container">
            <div className="block-empty__body">
              <div className="block-empty__message">Chưa có sản phẩm trong giỏ hàng!</div>
              <div className="block-empty__actions">
                <Link to={"/"} className="btn btn-primary btn-sm">Tiếp tục mua hàng!</Link>
              </div>
            </div>
          </div>
        </div>
      }
    </React.Fragment>
  );
}


export default ThanhToan;
