import { useState, useEffect } from 'react';
import axios from 'axios';
// antd
import { Table, Tag, Button } from "antd"
// hooks
import useNotification from '../../../hooks/useNotification';
import useLoading from '../../../hooks/useLoading';

// ----------------------------------------------------------------------

export default function FormThemSuaKichCo({ danhSachKichCoHienTai }) {
  const { onOpenSuccessNotify } = useNotification(); //mở thông báo
  const { onOpenLoading, onCloseLoading } = useLoading(); //mở, tắt loading

  useEffect(() => {
    // khai báo hàm lấy dữ liệu thuộc tính sản phẩm
    const layDuLieuThuocTinhTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get("http://127.0.0.1:8000/api/danh-sach-thuoc-tinh");

        // nếu gọi api thành công sẽ set dữ liệu
        // setListMauSac(response.data.data.listMauSac); // set dữ liệu được trả về từ backend
        // setListThuongHieu(response.data.data.listThuongHieu); // set dữ liệu được trả về từ backend
      } catch (error) {
        console.error(error);
        // console ra lỗi
      } finally {
        onCloseLoading();
        // tắt loading
      }
    }

    // layDuLieuThuocTinhTuBackEnd();
  }, [])

  // hàm gọi api thêm mới sản phẩm
  const post = async (body) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/them-san-pham", body); // gọi api
      navigate(DUONG_DAN_TRANG.san_pham.cap_nhat(response.data.data.id)); // chuyển sang trang cập nhật
      onOpenSuccessNotify('Thêm mới sản phẩm thành công!') // hiển thị thông báo 
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async (data) => {
    const body = {
      ...data, // giữ các biến cũ trong data 
      donGia: parseInt(formatNumber(data.donGia)), // ghi đè thuộc tính đơn giá trong data, convert thành số
      trangThai: chuyenDoiThanhEnum(data.trangThai), // ghi đè thuộc tính trạng thái trong data, convert thành enum
    }
    console.log(body);

    // hiển thị confirm
    showConfirm("Xác nhận thêm mới sản phẩm?", "Bạn có chắc chắn muốn thêm sản phẩm?", () => post(body));
  }

  return (
    <>
      <div className='mt-20 text-center' style={{ paddingInline: 150 }}>

        <div className='d-flex justify-content-between mt-20'>
          <span className='fw-500' style={{ fontSize: 25 }}>Kích cỡ & số lượng</span>
          <Button type='primary'>Thêm kích cỡ</Button>
        </div>

        <Table
          className='mt-20'
          rowKey={"id"}
          columns={danhSachCacTruongDuLieu}
          dataSource={danhSachKichCoHienTai} // dữ liệu từ backend
          pagination={false} // tắt phân trang mặc định của table
        />
      </div>
    </>
  )
}

const danhSachCacTruongDuLieu = [
  {
    title: 'Kích cỡ',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.maSanPham}
          </span>
        </>
      )
    },
  },
  {
    title: 'Số lượng',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.tenSanPham}
          </span>
        </>
      )
    },
  },
  {
    title: 'Trạng thái',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500' style={{ color: 'red' }} >
            <Tag className='ms-10 fw-500' color={hienThiMauSac(record.trangThai)}>{hienThiTrangThai(record.trangThai)}</Tag>
          </span>
        </>
      )
    },
  },
  {
    title: 'Thao tác',
    align: "center",
    render: (text, record) => {
      return (
        <Tooltip title="Chỉnh sửa">
          <Link to={DUONG_DAN_TRANG.san_pham.cap_nhat(record.id)}>
            <FaPenToSquare className='mt-8 fs-20 root-color' />
          </Link>
        </Tooltip>
      )
    },
  },
];

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

const hienThiMauSac = (trangThai) => {
  switch (trangThai) {
    case "dang_hoat_dong":
      return '#0fd93b';
    default:
      return '#e8190e';
  }
}

