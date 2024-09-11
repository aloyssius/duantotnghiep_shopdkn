import { useState, useEffect } from 'react';
import axios from 'axios';
import { displayCurrencyVnd, formatCurrencyVnd } from '../../../utils/formatCurrency';
import { FaPenToSquare } from "react-icons/fa6";
import dayjs from 'dayjs'
// antd
import { Input, Table, Tag, Flex, DatePicker, Select, Tooltip, Pagination } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
// routes
import { Link } from 'react-router-dom';
import { DUONG_DAN_TRANG } from '../../../routes/duong-dan';
// components
import Page from '../../../components/Page';
import Container from '../../../components/Container';
import { HeaderBreadcrumbs } from '../../../components/HeaderSection';
import IconButton from '../../../components/IconButton';
import Space from '../../../components/Space';
// hooks
import useLoading from '../../../hooks/useLoading';

const { Option } = Select;

const danhSachCacTruongDuLieu = [
  {
    title: 'Mã Đơn Hàng',
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
    title: 'Tên khách hàng',
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
    title: 'Số điện thoại',
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
    title: 'Ngày tạo',
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
    title: 'Tổng tiền',
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
    title: 'Trạng Thái',
    align: "center",
    render: (text, record) => {
      return (
        <Tag className='ms-10 fw-500' color={hienThiMauSac(record.trangThai)}>{hienThiTrangThai(record.trangThai)}</Tag>
      )
    },
  },
  {
    title: 'Thao tác',
    align: "center",
    render: (text, record) => {
      return (
        <Tooltip title="Chỉnh sửa">
          <Link to={DUONG_DAN_TRANG.don_hang.chi_tiet(record.id)}>
            <FaPenToSquare className='mt-8 fs-20 root-color' />
          </Link>
        </Tooltip>
      )
    },
  },
];

export default function DanhSachDonHang() {
  const { onOpenLoading, onCloseLoading } = useLoading();
  const [data, setData] = useState([]);
  const [tuNgay, setTuNgay] = useState(null);
  const [denNgay, setDenNgay] = useState(null);
  const [trangThai, setTrangThai] = useState(null);
  const [tuKhoa, setTuKhoa] = useState("");
  const [tongSoTrang, setTongSoTrang] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu
    const layDuLieuTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get("http://127.0.0.1:8000/api/danh-sach-don-hang", {
          // các tham số gửi về backend
          params: {
            currentPage,
            tuNgay: tuNgay ? dayjs(tuNgay).format('DD-MM-YYYY') : null,
            denNgay: denNgay ? dayjs(denNgay).format('DD-MM-YYYY') : null,
            tuKhoa,
            trangThai: chuyenDoiThanhEnum(trangThai),
          }
        });

        // nếu gọi api thành công sẽ set dữ liệu
        setData(response.data.data); // set dữ liệu được trả về từ backend
        setTongSoTrang(response.data.page.totalPages); // set tổng số trang được trả về từ backend
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
  }, [tuKhoa, trangThai, tuNgay, denNgay, currentPage]) // hàm sẽ được gọi khi các biến này được thay đổi 

  return (
    <>
      <Page title='Danh sách đơn hàng'>
        <Container>
          <HeaderBreadcrumbs
            heading='Danh sách đơn hàng'
          />

          <Space
            className='mt-15 d-flex'
            title={
              <Flex gap={14} style={{ padding: "15px 0px" }}>
                <DatePicker
                  value={tuNgay}
                  onChange={(date) => setTuNgay(date)}
                  style={{ width: WIDTH_SELECT }}
                  placeholder="Từ ngày"
                  format="DD/MM/YYYY"
                />
                <DatePicker
                  value={denNgay}
                  onChange={(date) => setDenNgay(date)}
                  style={{ width: WIDTH_SELECT }}
                  placeholder="Đến ngày"
                  format="DD/MM/YYYY"
                />
                <Select
                  value={trangThai}
                  onChange={(value) => setTrangThai(value)}
                  style={{ width: WIDTH_SELECT }}
                  placeholder="Trạng thái"
                >
                  {DANH_SACH_TRANG_THAI_DON_HANG.map((trangThai, index) => {
                    return (
                      <>
                        <Option key={index} value={trangThai}>{trangThai}</Option>
                      </>
                    )
                  })}
                </Select>
                <Input
                  addonBefore={<SearchOutlined />}
                  value={tuKhoa}
                  onChange={(e) => setTuKhoa(e.target.value)}
                  placeholder="Tìm kiếm đơn hàng..." />
              </Flex>
            }
          >
            <Table
              className=''
              rowKey={"id"}
              columns={danhSachCacTruongDuLieu}
              dataSource={data} // dữ liệu từ backend
              pagination={false} // tắt phân trang mặc định của table
            />

            <Pagination
              // sử dụng component phân trang 
              align='end'
              current={currentPage} // trang hiện tại
              onChange={(page) => setCurrentPage(page)} // sự kiện thay đổi trang hiện tại
              total={tongSoTrang} // tổng số trang
              className='mt-20'
              pageSize={10} // kích thước trang gồm 10 phần tử (10 phần tử trên 1 trang)
              showSizeChanger={false}
            />
          </Space>
        </Container>
      </Page>
    </>
  )
}

const WIDTH_SELECT = 300;
const DANH_SACH_TRANG_THAI_DON_HANG = ['Chờ xác nhận', 'Chờ giao hàng', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy'];

const chuyenDoiThanhEnum = (trangThai) => {
  switch (trangThai) {
    case "Chờ xác nhận":
      return "cho_xac_nhan";
    case "Chờ giao hàng":
      return "cho_giao_hang";
    case "Đang giao hàng":
      return "dang_giao_hang";
    case "Hoàn thành":
      return "hoan_thanh";
    case "Đã hủy":
      return "da_huy";
    default:
      return null;
  }
};

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

