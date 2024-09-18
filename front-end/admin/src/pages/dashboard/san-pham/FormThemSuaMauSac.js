import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { formatCurrencyVnd, formatNumber } from '../../../utils/formatCurrency';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// antd
import { Col, Tag, Select, Row, Button, Space, Input, DatePicker  } from "antd"
import moment from 'moment';
// routes
import { DUONG_DAN_TRANG } from "../../../routes/duong-dan"
// components
import FormProvider from '../../../components/hook-form/FormProvider';
import RHFInput from '../../../components/hook-form/RHFInput';
// hooks
import useConfirm from '../../../hooks/useConfirm';
import useNotification from '../../../hooks/useNotification';
import useLoading from '../../../hooks/useLoading';

const { Option } = Select;



// ----------------------------------------------------------------------

export default function FormThemSuaThuongHieu({ laCapNhat, mauSacHienTai }) {
  const { onOpenSuccessNotify } = useNotification(); //mở thông báo
  const { showConfirm } = useConfirm(); // mở confirm
  const { onOpenLoading, onCloseLoading } = useLoading(); //mở, tắt loading

  const navigate = useNavigate();

//   useEffect(() => {
//     // khai báo hàm lấy dữ liệu thuộc tính khách hàng
//     const layDuLieuThuocTinhTuBackEnd = async () => {
//       // bật loading
//       onOpenLoading();
//       try {
//         // gọi api từ backend
//         const response = await axios.get("http://127.0.0.1:8000/api/danh-sach-thuoc-tinh");

//         // nếu gọi api thành công sẽ set dữ liệu
//         setListMauSac(response.data.data.listMauSac); // set dữ liệu được trả về từ backend
//         setListThuongHieu(response.data.data.listThuongHieu); // set dữ liệu được trả về từ backend
//       } catch (error) {
//         console.error(error);
//         // console ra lỗi
//       } finally {
//         onCloseLoading();
//         // tắt loading
//       }
//     }

//     layDuLieuThuocTinhTuBackEnd();
//   }, [])

  // validate
  const MauSacSchema = Yup.object().shape({
//     tenSanPham: Yup.string().trim().required('Tên không được bỏ trống'),
//     maSanPham: Yup.string().trim().required('Mã không được bỏ trống'),
//     donGia: Yup.string().required('Đơn giá không được bỏ trống'),
//     idMauSac: Yup.string().required('Màu không được bỏ trống'),
//     idThuongHieu: Yup.string().required('Thương hiệu không được bỏ trống'),
  });

  // giá trị mặc định của biến, tương tự useState
  const defaultValues = {
    tenMauSac: mauSacHienTai?.tenMauSac || '',
    maMauSac:mauSacHienTai?.maMauSac || '',
  };

  // lấy methods từ use form
  const methods = useForm({
    resolver: yupResolver(MauSacSchema),
    defaultValues,
  });

  // các phương thức của methods
  const {
    reset,
    control,
    handleSubmit,
  } = methods;

  useEffect(() => {
    // nếu là trang cập nhật => sẽ reset lại các biến trong defaultValues
    if (laCapNhat && mauSacHienTai) {
      reset(defaultValues);
    }
    // nếu là trang thêm mới => sẽ reset lại các biến trong defaultValues
    if (!laCapNhat) {
      reset(defaultValues);
    }
  }, [laCapNhat, mauSacHienTai]) // gọi useEffect này mỗi khi các tham số truyền vào thay đỏi

  // hàm gọi api thêm mới khách hàng
  const post = async (body) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/mau-sac", body); // gọi api
      navigate(DUONG_DAN_TRANG.san_pham.cap_nhat_mau_sac(response.data.data.id)); // chuyển sang trang cập nhật
      onOpenSuccessNotify('Thêm mới màu sắc thành công!') // hiển thị thông báo 
    } catch (error) {
      console.log(error);
    }
  }

  const put = async (body, id) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/mau-sac/${id}`, body); // gọi API cập nhật
      navigate(DUONG_DAN_TRANG.san_pham.cap_nhat_mau_sac(response.data.data.id)); // chuyển sang trang cập nhật
      onOpenSuccessNotify('Cập nhật màu sắc thành công!'); // hiển thị thông báo 
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async (data) => {
    if (!laCapNhat) {
        const body = {
        ...data, // giữ các biến cũ trong data 
        }
        console.log(body);
        // hiển thị confirm
        showConfirm("Xác nhận thêm mới màu sắc?", "Bạn có chắc chắn muốn thêm màu sắc?", () => post(body));
    }else{
        const body = {
            ...data, // giữ các biến cũ trong data 
            }
            console.log(body);
            // hiển thị confirm
            showConfirm("Xác nhận cập nhật màu sắc?", "Bạn có chắc chắn muốn cập nhật màu sắc?", () => put(body,  mauSacHienTai?.id));
    }
  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Row className='mt-10' gutter={25} style={{ display: "flex", justifyContent: "center" }}>

          <Col span={9}>
            <RHFInput
              label='Tên màu sắc'
              name='tenMauSac'
              placeholder='Nhập tên màu sắc'
              required
            />
          </Col>

          <Col span={9}>
            <RHFInput
              label='Mã màu sắc'
              name='maMauSac'
              placeholder='Nhập mã màu sắc'
              required
            />
          </Col>

          <Col span={18} style={{ display: 'flex', justifyContent: 'end' }} className="mt-10">
            <Space className='mt-20 mb-5'>
              <Button onClick={() => navigate(DUONG_DAN_TRANG.san_pham.mau_sac)}>Hủy bỏ</Button>
              <Button
                htmlType='submit'
                type='primary'
                >
                {laCapNhat ? 'Cập nhật' : 'Lưu'}
                </Button>
            </Space>
          </Col>

        </Row>

      </FormProvider>
    </>
  )
}



