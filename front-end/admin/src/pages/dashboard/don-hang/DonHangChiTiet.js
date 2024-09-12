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
import useConfirm from '../../../hooks/useConfirm';
import useNotification from '../../../hooks/useNotification';

const danhSachCacTruongDuLieu = [
  {
    title: 'Mã sản phẩm',
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

  const putTrangThaiDonHang = async () => {
    try {
      // gọi api từ backend
      const response = await axios.put(`http://127.0.0.1:8000/api/trang-thai-don-hang/${id}`);
      // nếu gọi api thành công sẽ set dữ liệu
      setData(response.data.data); // set dữ liệu được trả về từ backend
      onOpenSuccessNotify('Cập nhật thành công!') // hiển thị thông báo 
      console.log(response.data.data)
    } catch (error) {
      console.error(error);
      // console ra lỗi
    }
  }

  const putHuyDonHang = async () => {
    try {
      // gọi api từ backend
      const response = await axios.put(`http://127.0.0.1:8000/api/huy-don-hang/${id}`);
      // nếu gọi api thành công sẽ set dữ liệu
      setData(response.data.data); // set dữ liệu được trả về từ backend
      onOpenSuccessNotify('Cập nhật thành công!') // hiển thị thông báo 
      console.log(response.data.data)
    } catch (error) {
      console.error(error);
      // console ra lỗi
    }
  }

  const updateTrangThai = () => {
    showConfirm('Xác nhận thay đổi trạng thái đơn hàng', 'Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng không?', () => putTrangThaiDonHang());
  }

  const huyDonHang = () => {
    showConfirm('Xác nhận hủy đơn hàng', 'Bạn có chắc chắn muốn hủy đơn hàng không?', () => putHuyDonHang());
  }

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
                title: "Chi tiết đơn hàng",
              },
            ]}
          />

          <Space
            className='mt-20 d-flex'
            title={
              <div className='d-flex justify-content-between' style={{ padding: 10 }}>
                <span style={{ fontSize: 25 }}>Thông tin đơn hàng</span>

                <Flex gap='small'>

                  {data?.trangThai === 'cho_xac_nhan' &&
                    <Button type='primary' size='large' onClick={() => updateTrangThai()}>
                      Xác nhận đơn hàng
                    </Button>
                  }

                  {data?.trangThai === 'cho_giao_hang' &&
                    <Button type='primary' size='large' onClick={() => updateTrangThai()}>
                      Giao hàng
                    </Button>
                  }

                  {data?.trangThai === 'dang_giao_hang' &&
                    <Button type='primary' size='large' onClick={() => updateTrangThai()}>
                      Hoàn thành đơn hàng
                    </Button>
                  }

                  {(data?.trangThai === 'cho_xac_nhan' || data?.trangThai === 'cho_giao_hang') &&
                    <Button onClick={() => huyDonHang()} type='primary' danger size='large'>
                      Hủy đơn
                    </Button>
                  }
                </Flex>
              </div>
            }
          >
            <div className='d-flex justify-content-between fw-500' style={{ padding: 10 }}>

              <Flex gap={10} vertical>
                <Flex gap={5}>
                  <span>Mã đơn hàng: </span>
                  <span>{data?.ma}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Trạng thái: </span>
                  <Tag color={hienThiMauSac(data?.trangThai)}>{hienThiTrangThai(data?.trangThai)}</Tag>
                </Flex>
                <Flex gap={5}>
                  <span>Ngày tạo: </span>
                  <span>{data?.ngayTao}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Ngày giao hàng: </span>
                  <span>{data?.ngayGiaoHang || "..."}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Ngày hoàn thành: </span>
                  <span>{data?.ngayHoanThanh || "..."}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Ngày hủy đơn: </span>
                  <span>{data?.ngayHuyDon || "..."}</span>
                </Flex>
              </Flex>

              <Flex style={{ marginRight: 300 }} gap={10} vertical>
                <Flex gap={5}>
                  <span>Tên khách hàng: </span>
                  <span>{data?.hoVaTen}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Số điện thoại: </span>
                  <span>{data?.soDienThoai}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Email: </span>
                  <span>{data?.email}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Địa chỉ: </span>
                  <span>{data?.diaChi}</span>
                </Flex>

                <Flex gap={5}>
                  <span>Tổng tiền hàng: </span>
                  <span style={{ color: 'red' }}>{formatCurrencyVnd(data?.tongTien) + "đ"} </span>
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
              dataSource={data?.donHangChiTiet || []} // dữ liệu từ backend
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

