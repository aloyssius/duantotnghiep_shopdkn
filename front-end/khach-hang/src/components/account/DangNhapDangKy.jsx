// react
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// third-party
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';

// data stubs
import theme from '../../data/theme';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  FormProvider,
  RHFInput,
} from '../../components/hook-form';

import useLoading from '../../hooks/useLoading';
import useNotification from '../../hooks/useNotification';

export default function DangNhapDangKy() {

  const history = useHistory(); // dùng để truyển sang dường dẫn trang khác

  const { onOpenLoading, onCloseLoading } = useLoading();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();

  const breadcrumb = [
    { title: 'Trang chủ', url: '/' },
    { title: 'Tài khoản', url: '' },
  ];

  // đăng nhập

  // validate
  const DangNhapSchema = Yup.object().shape({
    email: Yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
    matKhau: Yup.string().required('Bạn chưa nhập mật khẩu'),
  });

  const defaultValuesDangNhap = { // giá trị mặc định của biến trong form
    email: '',
    matKhau: '',
  }

  const methodsDangNhap = useForm({ // khai báo method của form
    resolver: yupResolver(DangNhapSchema),
    defaultValuesLogin: defaultValuesDangNhap,
  });

  const {
    handleSubmit: handleSubmitDangNhap,
  } = methodsDangNhap; // các phương thức của form

  const onSubmitDangNhap = async (data) => { // submit form đăng nhập
    onOpenLoading(); // bật loading
    try {
      // gọi api từ backend
      const response = await axios.post("http://127.0.0.1:8000/api/dang-nhap", data);

      // nếu gọi api thành công
      // set tài khoản và mật khẩu vào bộ nhớ local storage của trình duyệt
      console.log(response.data.data)
      localStorage.setItem('tai-khoan', JSON.stringify(response.data.data.taiKhoan));
      // set giỏ hàng chi tiết của tài khoản vào bộ nhớ local storage của trình duyệt
      localStorage.setItem('gio-hang-chi-tiet-tai-khoan', JSON.stringify(response.data.data.gioHangChiTiet));
      history.push('/'); // chuyển sang trang chủ
    } catch (error) {
      // console ra lỗi
      console.log(error.response.data);
      onOpenErrorNotify(error.response.data.message) // hiển thị thông báo lỗi
    } finally {
      onCloseLoading();
      // tắt loading
    }
  }

  // đăng ký

  const passwordRegex = /^[^\s]{8,255}$/; // regex validate

  // validate
  const DangKySchema = Yup.object().shape({
    email: Yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
    matKhau: Yup.string()
      .required('Bạn chưa nhập mật khẩu')
      .matches(passwordRegex, 'Mật khẩu phải có độ dài từ 8 đến 255 ký tự và không chứa khoảng trắng'),
  });

  // gía trị mặc định của biến trong form
  const defaultValuesDangKy = {
    email: '',
    matKhau: '',
  }

  // khai báo method của form
  const methodsDangKy = useForm({
    resolver: yupResolver(DangKySchema),
    defaultValuesRegister: defaultValuesDangKy,
  });

  const {
    handleSubmit: handleSubmitDangKy,
  } = methodsDangKy; // các phương thức của form

  const onSubmitDangKy = async (data) => {
    onOpenLoading(); // bật loading
    try {
      // gọi api từ backend
      const response = await axios.post("http://127.0.0.1:8000/api/dang-ky", data);
      // nếu gọi api thành công
      // hiển thị thông báo đăng ký thành công
      onOpenSuccessNotify("Đăng ký thành công, vui lòng đăng nhập");
    } catch (error) {
      // console ra lỗi
      console.log(error.response.data);
      onOpenErrorNotify(error.response.data.message) // hiển thị thông báo lỗi
    } finally {
      onCloseLoading();
      // tắt loading
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Đăng nhập | Đăng ký — ${theme.name}`}</title>
      </Helmet>

      <PageHeader header="Tài khoản" breadcrumb={breadcrumb} />

      <div className="block">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex">
              <div className="card flex-grow-1 mb-md-0">
                <div className="card-body">
                  <h3 className="card-title">Đăng nhập</h3>
                  <FormProvider methods={methodsDangNhap} onSubmit={handleSubmitDangNhap(onSubmitDangNhap)}>

                    <RHFInput
                      name='email'
                      topLabel='Email'
                      isRequired
                      placeholder="Nhập địa chỉ email"
                    />

                    <RHFInput
                      name='matKhau'
                      type="password"
                      topLabel='Mật khẩu'
                      isRequired
                      placeholder="Nhập mật khẩu"
                    />

                    <button type="submit" className="btn btn-primary mt-2 mt-md-3 mt-lg-4 d-block">
                      Đăng nhập
                    </button>
                  </FormProvider>
                </div>
              </div>
            </div>

            <div className="col-md-6 d-flex mt-4 mt-md-0">
              <div className="card flex-grow-1 mb-0">
                <div className="card-body">
                  <h3 className="card-title">Đăng ký</h3>
                  <FormProvider methods={methodsDangKy} onSubmit={handleSubmitDangKy(onSubmitDangKy)}>
                    <RHFInput
                      name='email'
                      topLabel='Email'
                      isRequired
                      placeholder="Nhập địa chỉ email"
                    />

                    <RHFInput
                      name='matKhau'
                      type="password"
                      topLabel='Mật khẩu'
                      isRequired
                      placeholder="Nhập mật khẩu"
                    />

                    <button type="submit" className="btn btn-primary mt-2 mt-md-3 mt-lg-4 d-block">
                      Đăng ký
                    </button>

                  </FormProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
