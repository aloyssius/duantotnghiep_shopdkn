import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { formatCurrencyVnd, formatNumber } from '../../../utils/formatCurrency';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// antd
import { Col, Tag, Select, Row, Button, Space } from "antd"
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

const DANH_SACH_TRANG_THAI_SAN_PHAM = ['Đang bán', 'Ngừng bán'];

// ----------------------------------------------------------------------

export default function FormThemSuaSanPham({ laCapNhat, sanPhamHienTai }) {
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification(); //mở thông báo
  const { showConfirm } = useConfirm(); // mở confirm
  const { onOpenLoading, onCloseLoading } = useLoading(); //mở, tắt loading

  const navigate = useNavigate();
  const [listMauSac, setListMauSac] = useState([]);
  const [listThuongHieu, setListThuongHieu] = useState([]);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu thuộc tính sản phẩm
    const layDuLieuThuocTinhTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get("http://127.0.0.1:8000/api/danh-sach-thuoc-tinh");

        // nếu gọi api thành công sẽ set dữ liệu
        setListMauSac(response.data.data.listMauSac); // set dữ liệu được trả về từ backend
        setListThuongHieu(response.data.data.listThuongHieu); // set dữ liệu được trả về từ backend
      } catch (error) {
        console.error(error);
        // console ra lỗi
      } finally {
        onCloseLoading();
        // tắt loading
      }
    }

    layDuLieuThuocTinhTuBackEnd();
  }, [])

  // validate
  const SanPhamSchema = Yup.object().shape({
    tenSanPham: Yup.string().trim().required('Tên không được bỏ trống'),
    maSanPham: Yup.string().trim().required('Mã không được bỏ trống'),
    donGia: Yup.string().required('Đơn giá không được bỏ trống'),
    idMauSac: Yup.string().required('Màu không được bỏ trống'),
    idThuongHieu: Yup.string().required('Thương hiệu không được bỏ trống'),
  });

  // giá trị mặc định của biến, tương tự useState
  const defaultValues = {
    tenSanPham: sanPhamHienTai?.tenSanPham || '',
    maSanPham: sanPhamHienTai?.maSanPham || '',
    moTa: sanPhamHienTai?.moTa || '',
    donGia: sanPhamHienTai?.donGia || '',
    idMauSac: sanPhamHienTai?.idMauSac || null,
    idThuongHieu: sanPhamHienTai?.idThuongHieu || null,
    trangThai: chuyenDoiEnumThanhTrangThai(sanPhamHienTai?.trangThai),
  };

  // lấy methods từ use form
  const methods = useForm({
    resolver: yupResolver(SanPhamSchema),
    defaultValues,
  });

  // các phương thức của methods
  const {
    reset,
    control,
    setValue,
    handleSubmit,
  } = methods;

  useEffect(() => {
    // nếu là trang cập nhật => sẽ reset lại các biến trong defaultValues
    if (laCapNhat && sanPhamHienTai) {
      reset(defaultValues);
    }
    // nếu là trang thêm mới => sẽ reset lại các biến trong defaultValues
    if (!laCapNhat) {
      reset(defaultValues);
    }
  }, [laCapNhat, sanPhamHienTai]) // gọi useEffect này mỗi khi các tham số truyền vào thay đỏi

  // hàm gọi api thêm mới sản phẩm
  const post = async (body) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/them-san-pham", body); // gọi api
      navigate(DUONG_DAN_TRANG.san_pham.cap_nhat(response.data.data.id)); // chuyển sang trang cập nhật
      onOpenSuccessNotify('Thêm mới sản phẩm thành công!') // hiển thị thông báo 
    } catch (error) {
      console.log(error.response.data);
      onOpenErrorNotify(error.response.data.message) // hiển thị thông báo lỗi
    }
  }

  // hàm gọi api update sản phẩm
  const put = async (body) => {
    try {
      const response = await axios.put("http://127.0.0.1:8000/api/update-san-pham", body); // gọi api
      console.log(response.data.data);
      navigate(DUONG_DAN_TRANG.san_pham.cap_nhat(response.data.data.id)); // chuyển sang trang cập nhật
      onOpenSuccessNotify('Cập nhật sản phẩm thành công!') // hiển thị thông báo 
    } catch (error) {
      console.log(error.response.data);
      onOpenErrorNotify(error.response.data.message) // hiển thị thông báo lỗi
    }
  }

  // hàm submit form
  const onSubmit = async (data) => {
    const body = {
      ...data, // giữ các biến cũ trong form data 
      donGia: parseInt(formatNumber(data.donGia)), // ghi đè thuộc tính đơn giá trong data, convert thành số
      trangThai: chuyenDoiThanhEnum(data.trangThai), // ghi đè thuộc tính trạng thái trong data, convert thành enum
      id: sanPhamHienTai?.id,
    }
    console.log(body);
    // hiển thị confirm

    if (laCapNhat) {
      showConfirm("Xác nhận cập nhật sản phẩm?", "Bạn có chắc chắn muốn cập nhật sản phẩm?", () => put(body));
    }
    else {
      showConfirm("Xác nhận thêm mới sản phẩm?", "Bạn có chắc chắn muốn thêm sản phẩm?", () => post(body));
    }
  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Row className='mt-10' gutter={25} style={{ display: "flex", justifyContent: "center" }}>

          <Col span={9}>
            <RHFInput
              label='Tên'
              name='tenSanPham'
              placeholder='Nhập tên sản phẩm'
              required
            />
          </Col>

          <Col span={9}>
            <RHFInput
              label='Mã'
              name='maSanPham'
              placeholder='Nhập mã sản phẩm'
              required
            />
          </Col>

          <Col span={18}>
            <RHFInput
              label='Mô tả'
              name='moTa'
              placeholder='Nhập mô tả'
              textarea
              rows={3}
            />
          </Col>

          <Col span={9}>
            <Controller
              name='idMauSac'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <label className='mt-15 d-block' style={{ fontWeight: '500' }}>
                    Màu sắc
                    <span className='required'></span>
                  </label>
                  <Select
                    className='mt-13'
                    {...field}
                    placeholder='Chọn màu sắc'
                    status={error && 'error'}
                    style={{ width: '100%' }}
                  >
                    {listMauSac?.map((mauSac, index) => {
                      return (
                        <>
                          <Option key={index} value={mauSac.id}>
                            <Tag style={{ color: isLightColor(mauSac.ma) ? 'black' : 'white' }} className='fw-500' color={mauSac.ma}>{mauSac.ten}</Tag>
                          </Option>
                        </>
                      )
                    })}
                  </Select>
                  {error && <span className='color-red mt-3 d-block'>{error?.message}</span>}
                </>
              )}
            />
          </Col>

          <Col span={9}>
            <Controller
              name='idThuongHieu'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <label className='mt-15 d-block' style={{ fontWeight: '500' }}>
                    Thương hiệu
                    <span className='required'></span>
                  </label>
                  <Select
                    className='mt-13'
                    {...field}
                    style={{ width: '100%' }}
                    placeholder='Chọn thương hiệu'
                    status={error && 'error'}
                  >
                    {listThuongHieu?.map((thuongHieu, index) => {
                      return (
                        <>
                          <Option key={index} value={thuongHieu.id}>{thuongHieu.ten}</Option>
                        </>
                      )
                    })}
                  </Select>
                  {error && <span className='color-red mt-3 d-block'>{error?.message}</span>}
                </>
              )}
            />
          </Col>

          <Col span={9}>
            <RHFInput
              label='Đơn giá'
              name='donGia'
              placeholder='Nhập đơn giá'
              required
              onChange={(e) => setValue('donGia', formatCurrencyVnd(e.target.value))}
            />
          </Col>

          <Col span={9}>
            <Controller
              name='trangThai'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <label className='mt-15 d-block' style={{ fontWeight: '500' }}>
                    Trạng thái
                    <span className='required'></span>
                  </label>
                  <Select
                    style={{ width: '100%' }}
                    className='mt-13'
                    {...field}
                    placeholder='Chọn trạng thái'
                  >
                    {DANH_SACH_TRANG_THAI_SAN_PHAM.map((trangThai, index) => {
                      return (
                        <>
                          <Option key={index} value={trangThai}>{trangThai}</Option>
                        </>
                      )
                    })}
                  </Select>
                  {error && <span className='color-red mt-3 d-block'>{error?.message}</span>}
                </>
              )}
            />
          </Col>


          <Col span={18} style={{ display: 'flex', justifyContent: 'end' }} className="mt-10">
            <Space className='mt-20 mb-5'>
              <Button onClick={() => navigate(DUONG_DAN_TRANG.san_pham.danh_sach)}>Hủy bỏ</Button>
              <Button
                htmlType='submit'
                type='primary'
              >
                Lưu
              </Button>
            </Space>
          </Col>

        </Row>

      </FormProvider>
    </>
  )
}


const chuyenDoiThanhEnum = (trangThai) => {
  switch (trangThai) {
    case "Đang bán":
      return "dang_hoat_dong";
    case "Ngừng bán":
      return "ngung_hoat_dong";
    default:
      return null;
  }
};

const chuyenDoiEnumThanhTrangThai = (trangThai) => {
  switch (trangThai) {
    case "dang_hoat_dong":
      return "Đang bán";
    case "ngung_hoat_dong":
      return "Ngừng bán";
    default:
      return "Đang bán";
  }
};

const isLightColor = (color) => {
  // Chuyển đổi màu HEX sang RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // Tính độ sáng
  const brightness = (r * 299 + g * 587 + b * 114) / 255000;
  return brightness > 0.5; // Ngưỡng có thể điều chỉnh
};
