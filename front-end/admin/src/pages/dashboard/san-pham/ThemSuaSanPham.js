import { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
// routes
import { DUONG_DAN_TRANG } from "../../../routes/duong-dan";
// components
import Page from '../../../components/Page';
import Container from '../../../components/Container';
import { HeaderBreadcrumbs } from '../../../components/HeaderSection';
import FormThemSuaSanPham from './FormThemSuaSanPham';
// hooks
import useLoading from '../../../hooks/useLoading';

export default function ThemSuaSanPham() {
  const { id } = useParams();

  const { onOpenLoading, onCloseLoading } = useLoading();
  const [data, setData] = useState([]);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu thông tin sản phẩm
    const layDuLieuTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get(`http://127.0.0.1:8000/api/tim-san-pham/${id}`);

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

    if (id) {
      // nếu là giao diện cập nhật => gọi hàm lấy dữ liệu
      layDuLieuTuBackEnd();
    }
  }, [id]) // hàm sẽ được gọi khi các biến này được thay đổi => id trên đường dẫn thay đổi

  return (
    <>
      <Page title={id ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}>
        <Container>
          <HeaderBreadcrumbs
            heading={id ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
            links={[
              {
                title: <Link to={DUONG_DAN_TRANG.san_pham.danh_sach}>Danh sách sản phẩm</Link>,
              },
              {
                title: id ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm",
              },
            ]}
          />

          <FormThemSuaSanPham
            laCapNhat={id ? true : false}
            sanPhamHienTai={data}
          />
        </Container>
      </Page>
    </>
  )

}
