import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrencyVnd } from '../../../utils/formatCurrency';
import { useParams } from "react-router-dom";
// antd
import { Input, Button, Table, Tag, Flex } from 'antd';
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

const danhSachCacTruongDuLieu = [
  {
    title: 'Ảnh',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.ma}
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
            {record.hoVaTen}
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
            {record.soDienThoai}
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
            {record.ngayTao}
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
            {formatCurrencyVnd(record.tongTien) + "đ"}
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
            {formatCurrencyVnd(record.tongTien) + "đ"}
          </span>
        </>
      )
    },
  },
];

export default function DonHangChiTiet() {
  const { onOpenLoading, onCloseLoading } = useLoading();
  const { id } = useParams(); // id trên đường dẫn
  const [data, setData] = useState([]);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu
    const layDuLieuTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get(`http://127.0.0.1:8000/api/don-hang/${id}`);
        // nếu gọi api thành công sẽ set dữ liệu
        setData(response.data.data); // set dữ liệu được trả về từ backend
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
      <Page title='Chi tiết đơn hàng'>
        <Container>
          <HeaderBreadcrumbs
            heading='Chi tiết đơn hàng'
            links={[
              {
                title: <Link to={DUONG_DAN_TRANG.don_hang.danh_sach}>Danh sách đơn hàng</Link>,
              },
              {
                title: "HD0001",
              },
            ]}
          />

          <Space
            className='mt-20 d-flex'
            title={
              <div className='d-flex justify-content-between' style={{ padding: 10 }}>
                <span style={{ fontSize: 25 }}>Thông tin đơn hàng</span>

                <Flex gap='small'>
                  <Button type='primary' size='large'>
                    Xác nhận
                  </Button>
                  <Button type='primary' danger size='large'>
                    Hủy đơn
                  </Button>
                </Flex>
              </div>
            }
          >
            <div className='d-flex justify-content-between fw-500' style={{ padding: 10 }}>

              <Flex gap={10} vertical>
                <Flex gap={5}>
                  <span>Mã đơn hàng: </span>
                  <span>HD0001 </span>
                </Flex>
                <Flex gap={5}>
                  <span>Trạng thái: </span>
                  <Tag color={hienThiMauSac("cho_xac_nhan")}>{hienThiTrangThai("cho_xac_nhan")}</Tag>
                </Flex>
                <Flex gap={5}>
                  <span>Tình trạng thanh toán: </span>
                  <Tag color={hienThiMauSac("cho_xac_nhan")}>{hienThiTrangThai("cho_xac_nhan")}</Tag>
                </Flex>
                <Flex gap={5}>
                  <span>Hình thức thanh toán: </span>
                  <span>Thanh toán khi nhận hàng </span>
                </Flex>
                <Flex gap={5}>
                  <span>Ngày tạo: </span>
                  <span>2022/12/12 </span>
                </Flex>
                <Flex gap={5}>
                  <span>Ngày giao hàng: </span>
                  <span>2022/12/12 </span>
                </Flex>
                <Flex gap={5}>
                  <span>Ngày hoàn thành: </span>
                  <span>2022/12/12 </span>
                </Flex>
              </Flex>

              <Flex style={{ marginRight: 300 }} gap={10} vertical>
                <Flex gap={5}>
                  <span>Tên khách hàng: </span>
                  <span>HD0001 </span>
                </Flex>
                <Flex gap={5}>
                  <span>Số điện thoại: </span>
                  <span>2022/12/12 </span>
                </Flex>
                <Flex gap={5}>
                  <span>Email: </span>
                  <span>2022/12/12 </span>
                </Flex>
                <Flex gap={5}>
                  <span>Địa chỉ: </span>
                  <span>2022/12/12 </span>
                </Flex>
              </Flex>

            </div>

          </Space>

          <Space
            className='mt-20 d-flex'
            title={
              <div className='d-flex justify-content-between' style={{ padding: 10 }}>
                <span style={{ fontSize: 25 }}>Danh sách sản phẩm</span>
              </div>
            }
          >
            <Table
              className=''
              rowKey={"id"}
              columns={danhSachCacTruongDuLieu}
              dataSource={data} // dữ liệu từ backend
              pagination={false} // tắt phân trang mặc định của table
            />
          </Space>

          <div className='mt-20 d-flex justify-content-end fw-500' >
            <Flex gap={10} vertical>
              <div className='d-flex justify-content-between'>
                <span>Tổng tiền hàng: </span>
                <span>{formatCurrencyVnd("123123")} </span>
              </div>
              <div className='d-flex justify-content-between'>
                <span>Giảm giá: </span>
                <span>{formatCurrencyVnd("123123")} </span>
              </div>
              <div className='d-flex justify-content-between'>
                <span>Phí vận chuyển: </span>
                <span>{formatCurrencyVnd("123123")} </span>
              </div>
              <Flex gap={150}>
                <span>Tổng cộng: </span>
                <span>{formatCurrencyVnd("123123")} </span>
              </Flex>
            </Flex>
          </div>
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

const hienThiThaoTacButton = (trangThai) => {
  switch (trangThai) {
    case "cho_xac_nhan":
      return "Xác nhận đơn hàng";
    case "cho_giao_hang":
      return "Giao hàng";
    case "dang_giao_hang":
      return "Hoàn thành đơn hàng";
    default:
      return "";
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

