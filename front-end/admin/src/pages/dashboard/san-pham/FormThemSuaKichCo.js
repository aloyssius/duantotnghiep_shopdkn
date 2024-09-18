import { useState, useEffect } from 'react';
import axios from 'axios';
// antd
import { Table, Tag, Button, Modal, InputNumber } from "antd"
// hooks
import useNotification from '../../../hooks/useNotification';
import useConfirm from '../../../hooks/useConfirm';

// ----------------------------------------------------------------------

const { CheckableTag } = Tag;
const DANH_SACH_KICH_CO = ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49'];

export default function FormThemSuaKichCo({ danhSachKichCoHienTai, id }) {
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification(); //mở thông báo
  const { showConfirm } = useConfirm(); // mở confirm

  const [listKichCo, setListKichCo] = useState([]);  // danh sách kích cỡ đc hiển thị dưới table
  const [moModal, setMoModal] = useState(false);
  const [cacLuaChonTag, setCacLuaChonTag] = useState([]); // các lựa chọn tag trong modal

  // set lại list kích cỡ khi call api xong
  useEffect(() => {
    setListKichCo(danhSachKichCoHienTai || [])
  }, [danhSachKichCoHienTai])

  const danhSachTenKichCoHienTai = listKichCo?.map((kichCo) => kichCo.ten_kich_co); // lấy ra các tên kích cỡ hiện tại

  // xử lý onChange chọn tag kích cỡ
  const chonCacTag = (tag, checked) => {
    const luaChonTags = checked ? [...cacLuaChonTag, tag] : cacLuaChonTag.filter((t) => t !== tag);
    console.log('Danh sach cac tag: ', luaChonTags);
    setCacLuaChonTag(luaChonTags);
  };

  // hàm gọi api thêm kích cỡ
  const post = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/them-kich-co", { listKichCo: cacLuaChonTag, id: id }); // gọi api
      setListKichCo(response.data.data); //  set lại dữ liệu cho danh sách kích cỡ của sản phẩm
      onOpenSuccessNotify('Thêm kích cỡ thành công!') // hiển thị thông báo 
      setCacLuaChonTag([]);
    } catch (error) {
      console.log(error.response.data);
      onOpenErrorNotify(error.response.data.message) // hiển thị thông báo lỗi
    }
  }

  // hàm gọi api thêm kích cỡ
  const putTrangThai = async (trangThai, idKichCo) => {
    try {
      const response = await axios.put("http://127.0.0.1:8000/api/trang-thai-kich-co", { trangThai: trangThai, id: idKichCo, idSanPham: id }); // gọi api
      setListKichCo(response.data.data); //  set lại dữ liệu cho danh sách kích cỡ của sản phẩm
    } catch (error) {
      console.log(error.response.data);
      onOpenErrorNotify(error.response.data.message) // hiển thị thông báo lỗi
    }
  }

  // hàm gọi api thêm số lượng tồn
  const putSoLuongTon = async (soLuong, idKichCo) => {
    try {
      const response = await axios.put("http://127.0.0.1:8000/api/so-luong-ton", { soLuongTon: soLuong || 0, id: idKichCo, idSanPham: id }); // gọi api
    } catch (error) {
      console.log(error.response.data);
      onOpenErrorNotify(error.response.data.message) // hiển thị thông báo lỗi
    }
  }
  const themKichCo = () => {
    if (cacLuaChonTag.length > 0) { // nếu có bất kỳ lựa chọn tag kích cỡ nào
      console.log(cacLuaChonTag);
      // hiển thị confirm
      showConfirm("Xác nhận thêm mới kích cỡ?", "Bạn có chắc chắn muốn thêm kích cỡ?", () => post());
    }
  }

  const danhSachCacTruongDuLieu = [
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
      title: 'Số lượng tồn',
      align: "center",
      render: (text, record) => {
        return (
          <>
            <span className='fw-500'>
              <InputNumber min={0} defaultValue={record.so_luong_ton} onBlur={(e) => putSoLuongTon(e.target.value, record.id)} />
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
              <Tag className='ms-10 fw-500' color={hienThiMauSac(record.trang_thai)}>{hienThiTrangThai(record.trang_thai)}</Tag>
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
          <>
            {record.trang_thai === 'dang_hoat_dong' &&
              <Button danger type='primary' onClick={() => putTrangThai("ngung_hoat_dong", record.id)}>
                Ngừng kích hoạt
              </Button>
            }
            {record.trang_thai === 'ngung_hoat_dong' &&
              <Button type='primary' onClick={() => putTrangThai("dang_hoat_dong", record.id)}>
                Kich hoạt
              </Button>
            }
          </>
        )
      },
    },
  ];

  return (
    <>
      <div style={{ paddingInline: 150 }}>

        <div className='d-flex justify-content-between mt-10'>
          <span className='fw-500' style={{ fontSize: 25 }}>Danh sách kích cỡ</span>
          <Button type='primary' onClick={() => setMoModal(true)}>Thêm kích cỡ</Button>
        </div>

        <Table
          className='mt-20'
          rowKey={"id"}
          columns={danhSachCacTruongDuLieu}
          dataSource={listKichCo} // truyền dữ liệu vào table
          pagination={false} // tắt phân trang mặc định của table
        />
      </div>
      <Modal
        title="Chọn kích cỡ"
        open={moModal} // trạng thái modal
        onOk={themKichCo} // gọi hàm thêm kích cỡ nếu bấm ok
        onCancel={() => { // nếu bấm cancel ( hủy )
          setMoModal(false); // đóng modal
          setCacLuaChonTag([]); // xóa các lựa chọn tag
        }}
      >

        <div className='mt-15'>
          {DANH_SACH_KICH_CO.map((kichCo) => (
            <CheckableTag
              key={kichCo}
              style={{
                padding: '20px 24px',
                marginTop: '5px',
                fontSize: 18,
                fontWeight: 500,
                opacity: danhSachTenKichCoHienTai?.includes(kichCo) ? 0.5 : 1,
                backgroundColor: danhSachTenKichCoHienTai?.includes(kichCo) ? "#1677FF" : "",
                pointerEvents: danhSachTenKichCoHienTai?.includes(kichCo) ? "none" : "",
              }}
              checked={cacLuaChonTag.indexOf(kichCo) > -1}
              onChange={(checked) => chonCacTag(kichCo, checked)}
            >
              {kichCo}
            </CheckableTag>
          ))}
        </div>
      </Modal>
    </>
  )
}

const hienThiTrangThai = (trangThai) => {
  switch (trangThai) {
    case "dang_hoat_dong":
      return "Đang bán";
    default:
      return "Ngừng bán";
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

