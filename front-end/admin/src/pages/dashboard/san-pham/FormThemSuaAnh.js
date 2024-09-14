import { useState, useEffect } from 'react';
import axios from 'axios';
// antd
import { Upload, Button, message, Image } from "antd"
import { UploadOutlined } from '@ant-design/icons';
// hooks
import useNotification from '../../../hooks/useNotification';

// ----------------------------------------------------------------------

export default function FormThemSuaAnh({ danhSachHinhAnhHienTai, id }) {
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification(); //mở thông báo

  const [listHinhAnh, setListHinhAnh] = useState([]);

  // set lại list hình ảnh khi call api xong
  useEffect(() => {
    setListHinhAnh(danhSachHinhAnhHienTai || [])
  }, [danhSachHinhAnhHienTai])

  // hàm gọi api thêm hình ảnh dạng base64
  const post = async (hinhAnh) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/them-hinh-anh", { hinhAnh: hinhAnh, id: id }); // gọi api
      setListHinhAnh(response.data.data); //  set lại dữ liệu cho danh sách hình ảnh của sản phẩm
      onOpenSuccessNotify('Thêm hình ảnh thành công!') // hiển thịthông báo 
    } catch (error) {
      console.log(error.response.data);
      onOpenErrorNotify(error.response.data.message) // hiển thị thông báo lỗi
    }
  }

  // chọn ảnh xong sẽ thao tác thêm dữ liệu về backend
  const handleChange = (info) => {
    if (listHinhAnh.length + 1 <= 4) { // chỉ thêm được 4 ảnh 

      if (info.file.status === 'done') { // nếu tải ảnh từ máy tính thành công
        const reader = new FileReader(); // đoạn này đọc file thành base64
        reader.onloadend = () => {
          post(reader.result); // gọi hàm call api
        };
        reader.readAsDataURL(info.file.originFileObj);
      } else if (info.file.status === 'error') { // nếu có lỗi xảy ra 
        onOpenErrorNotify('Tải hình ảnh thất bại');
      }

    }

  };

  // hàm kiểm tra định dạng trước khi upload
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/'); //chỉ cho phép định dạng image
    if (!isImage) {
      message.error('Sai định dạng!');
    }
    return isImage;
  };

  return (
    <>
      <div style={{ paddingInline: 150 }}>

        <div className='d-flex justify-content-between mt-10'>
          <span className='fw-500' style={{ fontSize: 25 }}>Danh sách hình ảnh</span>
          <Upload
            onChange={handleChange}
            beforeUpload={beforeUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} type='primary'>Thêm hình ảnh</Button>
          </Upload>
        </div>

        <div className='mt-20 d-flex' style={{ gap: '20px' }}>
          {listHinhAnh.map((hinhAnh, index) => (
            <>
              <Image
                key={index}
                width={200}
                height={190}
                src={hinhAnh}
                alt="Uploaded Image"
              />
            </>
          ))}
        </div>

        <div className='mt-15'></div>

      </div>
    </>
  )
}

