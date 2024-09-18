import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrencyVnd } from '../../../utils/formatCurrency';
import { useParams } from "react-router-dom";
// antd
import { Button, Table, Tag, Flex } from 'antd';
// routes
import { Link } from 'react-router-dom';
import { DUONG_DAN_TRANG } from '../../../routes/duong-dan';
// components
import Page from '../../../components/Page';
import Container from '../../../components/Container';
import { HeaderBreadcrumbs } from '../../../components/HeaderSection';
import Space from '../../../components/Space';
// hooks
import useLoading from '../../../hooks/useLoading';
import useConfirm from '../../../hooks/useConfirm';
import useNotification from '../../../hooks/useNotification';

const danhSachCacTruongDuLieu = [
  {
    title: 'Hình ảnh',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            <img src={record.hinh_anh} width='80px' alt="img" />
          </span>
        </>
      )
    },
  },
  {
    title: 'Tên sản phẩm',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.ten} {" "} ({record.ma})
          </span>
        </>
      )
    },
  },
  {
    title: 'Kích cỡ',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.ten_kich_co}
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
            {record.so_luong}
          </span>
        </>
      )
    },
  },
  {
    title: 'Đơn giá',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500' style={{ color: 'red' }} >
            {formatCurrencyVnd(record.don_gia) + "đ"}
          </span>
        </>
      )
    },
  },
  {
    title: 'Thành tiền',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500' style={{ color: 'red' }} >
            {formatCurrencyVnd(record.don_gia * record.so_luong) + "đ"}
          </span>
        </>
      )
    },
  },
];

export default function ThongKe() {
  const { onOpenSuccessNotify } = useNotification(); //mở thông báo
  const { onOpenLoading, onCloseLoading } = useLoading();
  const { showConfirm } = useConfirm(); // mở confirm
  const { id } = useParams(); // id trên đường dẫn
  const [data, setData] = useState([]);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu
    const layDuLieuTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get(`http://127.0.0.1:8000/api/tim-don-hang/${id}`);
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
  }, []) // hàm sẽ được gọi 1 lần khi trong mảng ko có tham số

  return (
    <>
      <Page title='Thống kê'>
        <Container>
          <HeaderBreadcrumbs
            heading='Thống kê'
          />

          <Space
            className='mt-20 d-flex'
            title={
              <div className='d-flex justify-content-between' style={{ padding: 10 }}>
                <span style={{ fontSize: 25 }}>Thống kê doanh thu</span>
              </div>
            }
          >
            <div className='d-flex justify-content-between fw-500' style={{ padding: 10 }}>

              <Flex gap={10} vertical>
                <Flex gap={5}>
                  <span>Tổng số sản phẩm đã bán: </span>
                  <span>{data?.ma}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng số đơn hàng: </span>
                  <span>{data?.ma}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng doanh thu: </span>
                  <span>{data?.ma}</span>
                </Flex>
              </Flex>

              <Flex style={{ marginRight: 300 }} gap={10} vertical>
                <Flex gap={5}>
                  <span>Tổng số sản phẩm đã bán tuần này: </span>
                  <span>{data?.ma}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng số đơn hàng tuần này: </span>
                  <span>{data?.ma}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng doanh thu tuần này: </span>
                  <span>{data?.ma}</span>
                </Flex>
              </Flex>

            </div>

            <div className='d-flex justify-content-between fw-500' style={{ padding: 10 }}>

              <Flex gap={10} vertical>
                <Flex gap={5}>
                  <span>Tổng số sản phẩm đã bán tháng này: </span>
                  <span>{data?.ma}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng số đơn hàng tháng này: </span>
                  <span>{data?.ma}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng doanh thu tháng này: </span>
                  <span>{data?.ma}</span>
                </Flex>
              </Flex>

              <Flex style={{ marginRight: 300 }} gap={10} vertical>
                <Flex gap={5}>
                  <span>Tổng số sản phẩm đã bán năm này: </span>
                  <span>{data?.ma}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng số đơn hàng năm này: </span>
                  <span>{data?.ma}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng doanh thu năm này: </span>
                  <span>{data?.ma}</span>
                </Flex>
              </Flex>

            </div>

          </Space>

          <Space
            className='mt-20 d-flex'
            title={
              <div className='d-flex justify-content-between' style={{ padding: 10 }}>
                <span style={{ fontSize: 25 }}>Thống kê sản phẩm mới nhất</span>
              </div>
            }
          >
            <Table
              className=''
              rowKey={"id"}
              columns={danhSachCacTruongDuLieu}
              dataSource={data?.listDonHangChiTiet || []} // dữ liệu từ backend
              pagination={false} // tắt phân trang mặc định của table
            />
          </Space>

        </Container>
      </Page>
    </>
  )
}

const hienThiTrangThai = (trangThai) => {
  switch (trangThai) {
    case "cho_xac_nhan":
      return "Chờ xác nhận";
    case "cho_giao_hang":
      return "Chờ giao hàng";
    case "dang_giao_hang":
      return "Đang giao hàng";
    case "hoan_thanh":
      return "Hoàn thành";
    default:
      return "Đã hủy";
  }
};

export const hienThiMauSac = (trangThai) => {
  switch (trangThai) {
    case "cho_xac_nhan":
      return '#e8da0e';
    case "cho_giao_hang":
      return '#e8da0e';
    case "dang_giao_hang":
      return '#0fd93b';
    case "hoan_thanh":
      return '#108ee9';
    default:
      return '#e8190e';
  }
}

