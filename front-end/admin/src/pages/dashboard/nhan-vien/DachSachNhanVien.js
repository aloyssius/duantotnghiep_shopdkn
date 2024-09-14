import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrencyVnd } from '../../../utils/formatCurrency';
import { FaPenToSquare } from "react-icons/fa6";
// antd
import { Input, Table, Tag, Flex, Select, Tooltip, Pagination } from 'antd';
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
    title: 'Mã nhân viên',
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
    title: 'Tên nhân viên',
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
    title: 'Email',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.email}
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
          <Link to={DUONG_DAN_TRANG.nhan_vien.cap_nhat(record.id)}>
            <FaPenToSquare className='mt-8 fs-20 root-color' />
          </Link>
        </Tooltip>
      )
    },
  },
];

export default function DanhSachSanPham() {
  const { onOpenLoading, onCloseLoading } = useLoading();
  const [data, setData] = useState([]);
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
        const response = await axios.get("http://127.0.0.1:8000/api/nhan-vien", {
          // các tham số gửi về backend
          params: {
            currentPage,
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
  }, [tuKhoa, trangThai, currentPage]) // hàm sẽ được gọi khi các biến này được thay đổi 

  return (
    <>
      <Page title='Danh sách nhân viên'>
        <Container>
          <HeaderBreadcrumbs
            heading='Danh sách nhân viên'
            action={
              <Link to={DUONG_DAN_TRANG.nhan_vien.tao_moi}>
                <IconButton
                  type='primary'
                  name='Thêm nhân viên'
                  icon={<PlusOutlined />}
                />
              </Link>
            }
          />

          <Space
            className='mt-15 d-flex'
            title={
              <Flex gap={14} style={{ padding: "15px 0px" }}>
                <Select
                  value={trangThai}
                  onChange={(value) => setTrangThai(value)}
                  style={{ width: WIDTH_SELECT }}
                  placeholder="Trạng thái"
                >
                  {DANH_SACH_TRANG_THAI_NHAN_VIEN.map((trangThai, index) => {
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
                  placeholder="Tìm kiếm sản phẩm..." />
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
const DANH_SACH_TRANG_THAI_NHAN_VIEN = ['Đang hoạt động', 'Ngừng hoạt động'];

const chuyenDoiThanhEnum = (trangThai) => {
  switch (trangThai) {
    case "Đang hoạt động":
      return "dang_hoat_dong";
    case "Ngừng hoạt động":
      return "ngung_hoat_dong";
    default:
      return null;
  }
};

const hienThiTrangThai = (trangThai) => {
  switch (trangThai) {
    case "dang_hoat_dong":
      return "Đang hoạt động";
    default:
      return "Ngừng hoạt động";
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

