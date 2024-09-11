import { useState, useEffect } from 'react';
import axios from 'axios';
import { displayCurrencyVnd } from '../../../utils/formatCurrency';
import { FaPenToSquare } from "react-icons/fa6";
// antd
import { Input, Table, Tag, Flex, DatePicker, Select, Tooltip, Pagination } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
// routes
import { Link } from 'react-router-dom';
import { DUONG_DAN_TRANG } from '../../../routes/duong-dan';
// components
import Page from '../../../components/Page';
import Container from '../../../components/Container';
import { HeaderAction } from '../../../components/HeaderSection';
import IconButton from '../../../components/IconButton';
import Space from '../../../components/Space';
// hooks
import useLoading from '../../../hooks/useLoading';

const { Option } = Select;

const columns = [
  {
    title: 'Mã',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.code}
          </span>
        </>
      )
    },
  },
  {
    title: 'Giá trị',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.value}
          </span>
        </>
      )
    },
  },
  {
    title: 'Lượt sử dụng',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.quantity}
          </span>
        </>
      )
    },
  },
  {
    title: 'Ngày bắt đầu',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.startDate}
          </span>
        </>
      )
    },
  },
  {
    title: 'Ngày kết thúc',
    align: "center",
    render: (text, record) => {
      return (
        <>
          <span className='fw-500'>
            {record.endDate}
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
        <Tag className='ms-10' color={convertColor(record.status)}>{convertStatus(record.status)}</Tag>
      )
    },
  },
  {
    title: 'Thao tác',
    align: "center",
    render: (text, record) => {
      return (
        <Tooltip title="Chỉnh sửa">
          <Link to={DUONG_DAN_TRANG.voucher.cap_nhat(record.id)}>
            <FaPenToSquare className='mt-8 fs-20 root-color' />
          </Link>
        </Tooltip>
      )
    },
  },
];

export default function DanhSachVoucher() {
  const { onOpenLoading, onCloseLoading } = useLoading();
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      onOpenLoading();
      try {
        const response = await axios.get(ADMIN_API.voucher.getAll);
        setData(response);
      } catch (error) {
        console.error(error);
      } finally {
        onCloseLoading();
      }
    }

    fetchData();
  }, [])

  return (
    <>
      <Page title='Danh sách voucher'>
        <Container>
          <HeaderAction
            heading='Danh sách voucher'
            action={
              <Link to={DUONG_DAN_TRANG.voucher.tao_moi}>
                <IconButton
                  type='primary'
                  name='Thêm voucher'
                  icon={<PlusOutlined />}
                />
              </Link>
            }
          >
          </HeaderAction>

          <Space
            className='mt-15 d-flex'
            title={
              <Flex gap={14} style={{ padding: "15px 0px" }}>
                <DatePicker
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  style={{ width: WIDTH_SELECT }}
                  placeholder="Ngày bắt đầu"
                />
                <DatePicker
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  style={{ width: WIDTH_SELECT }}
                  placeholder="Ngày kết thúc"
                />
                <Select
                  value={status}
                  onChange={(value) => setStatus(value)}
                  style={{ width: WIDTH_SELECT }}
                  placeholder="Trạng thái"
                >
                  {STATUS_ARR.map((status, index) => {
                    return (
                      <>
                        <Option key={index} value={status}>{status}</Option>
                      </>
                    )
                  })}
                </Select>
                <Input
                  addonBefore={<SearchOutlined />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm voucher theo mã..." />
              </Flex>
            }
          >
            <Table
              className=''
              rowKey={"id"}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
            <Pagination align='end' total={51} className='mt-20' pageSize={10} showSizeChanger={false} />
          </Space>
        </Container>
      </Page>
    </>
  )
}

const WIDTH_SELECT = 300;
const STATUS_ARR = ['Sắp diễn ra', 'Đang diễn ra', 'Đã kết thúc'];

const convertEnumStatus = (status) => {
  switch (status) {
    case "Sắp diễn ra":
      return "up_comming";
    case "Đang diễn ra":
      return "on_going";
    case "Đã kết thúc":
      return "finished";
    default:
      return null;
  }
};

const convertStatus = (status) => {
  switch (status) {
    case "up_comming":
      return "Sắp diễn ra";
    case "on_going":
      return "Đang diễn ra";
    case "finished":
      return "Đã kết thúc";
    default:
      return null;
  }
};

export const convertColor = (status) => {
  switch (status) {
    case "up_comming":
      return '#0fd93b';
    case "on_going":
      return '#108ee9';
    case "finished":
      return '#e8190e';
    default:
      return '#e8da0e';
  }
}

const dataFake = [
  {
    id: 1,
    code: "DKNSHOP",
    value: 123123,
    quantity: 12,
    startDate: "2023/12/12",
    endDate: "2023/12/12",
    status: "up_comming",
  },
]
