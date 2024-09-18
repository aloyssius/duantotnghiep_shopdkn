import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrencyVnd } from '../../../utils/formatCurrency';
// antd
import { Table, Flex } from 'antd';
// components
import Page from '../../../components/Page';
import Container from '../../../components/Container';
import { HeaderBreadcrumbs } from '../../../components/HeaderSection';
import Space from '../../../components/Space';
// hooks
import useLoading from '../../../hooks/useLoading';

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
            {record.ten}
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
];

export default function ThongKe() {
  const { onOpenLoading, onCloseLoading } = useLoading();
  const [data, setData] = useState([]);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu
    const layDuLieuTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get(`http://127.0.0.1:8000/api/thong-ke`);
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
                  <span>{data?.tongTatCaDoanhThu?.tongSoLuongSanPhamDaBan}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng số đơn hàng: </span>
                  <span>{data?.tongTatCaDoanhThu?.tongSoDonHangDaBan}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng doanh thu: </span>
                  <span>{formatCurrencyVnd(parseInt(data?.tongTatCaDoanhThu?.tongDoanhThu))}</span>
                </Flex>
              </Flex>

              <Flex style={{ marginRight: 300 }} gap={10} vertical>
                <Flex gap={5}>
                  <span>Tổng số sản phẩm đã bán tuần này: </span>
                  <span>{data?.tongTatCaDoanhThuTuan?.tongSoLuongSanPhamDaBanTuan}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng số đơn hàng tuần này: </span>
                  <span>{data?.tongTatCaDoanhThuTuan?.tongSoDonHangDaBanTuan}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng doanh thu tuần này: </span>
                  <span>{formatCurrencyVnd(parseInt(data?.tongTatCaDoanhThuTuan?.tongDoanhThuTuan))}</span>
                </Flex>
              </Flex>

            </div>

            <div className='d-flex justify-content-between fw-500' style={{ padding: 10 }}>

              <Flex gap={10} vertical>
                <Flex gap={5}>
                  <span>Tổng số sản phẩm đã bán tháng này: </span>
                  <span>{data?.tongTatCaDoanhThuThang?.tongSoLuongSanPhamDaBanThang}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng số đơn hàng tháng này: </span>
                  <span>{data?.tongTatCaDoanhThuThang?.tongSoDonHangDaBanThang}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng doanh thu tháng này: </span>
                  <span>{formatCurrencyVnd(parseInt(data?.tongTatCaDoanhThuThang?.tongDoanhThuThang))}</span>
                </Flex>
              </Flex>

              <Flex style={{ marginRight: 300 }} gap={10} vertical>
                <Flex gap={5}>
                  <span>Tổng số sản phẩm đã bán năm này: </span>
                  <span>{data?.tongTatCaDoanhThuNam?.tongSoLuongSanPhamDaBanNam}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng số đơn hàng năm này: </span>
                  <span>{data?.tongTatCaDoanhThuNam?.tongSoDonHangDaBanNam}</span>
                </Flex>
                <Flex gap={5}>
                  <span>Tổng doanh thu năm này: </span>
                  <span>{formatCurrencyVnd(parseInt(data?.tongTatCaDoanhThuNam?.tongDoanhThuNam))}</span>
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
              dataSource={data?.listSanPhamMoiNhat || []} // dữ liệu từ backend
              pagination={false} // tắt phân trang mặc định của table
            />
          </Space>

        </Container>
      </Page>
    </>
  )
}
