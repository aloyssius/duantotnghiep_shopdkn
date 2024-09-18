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
    title: 'Mã khách hàng',
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
    title: 'Thao tác',
    align: "center",
    render: (text, record) => {
      return (
        <Tooltip title="Chỉnh sửa">
          <Link to={DUONG_DAN_TRANG.khach_hang.cap_nhat(record.id)}>
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
        const response = await axios.get("http://127.0.0.1:8000/api/khach-hang", {
          // các tham số gửi về backend
          params: {
            currentPage,
            tuKhoa,
          }
        });

        // nếu gọi api thành công sẽ set dữ liệu
        setData(response.data.data); // set dữ liệu được trả về từ backend
        setTongSoTrang(response.data.page.totalElements); // set tổng số trang được trả về từ backend
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
  }, [tuKhoa, currentPage]) // hàm sẽ được gọi khi các biến này được thay đổi 

  return (
    <>
      <Page title='Danh sách khách hàng'>
        <Container>
          <HeaderBreadcrumbs
            heading='Danh sách khách hàng'
            action={
              <Link to={DUONG_DAN_TRANG.khach_hang.tao_moi}>
                <IconButton
                  type='primary'
                  name='Thêm khách hàng'
                  icon={<PlusOutlined />}
                />
              </Link>
            }
          />

          <Space
            className='mt-15 d-flex'
            title={
              <Flex gap={14} style={{ padding: "15px 0px" }}>
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


