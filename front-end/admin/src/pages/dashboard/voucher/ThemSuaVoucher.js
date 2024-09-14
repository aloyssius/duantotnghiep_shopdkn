import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
// routes
import { DUONG_DAN_TRANG } from "../../../routes/duong-dan";
// components
import Page from '../../../components/Page';
import Container from '../../../components/Container';
import { HeaderBreadcrumbs } from '../../../components/HeaderSection';
import FormThemSuaVoucher from './FormThemSuaVoucher';

export default function ThemSuaVoucher() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const laCapNhat = pathname.includes('/cap-nhat');
  const [data, setData] = useState({});

  useEffect(() => {
    // call api
  }, []);

  return (
    <>
      <Page title={laCapNhat ? "Cập nhật voucher" : "Thêm mới voucher"}>
        <Container>
          <HeaderBreadcrumbs
            heading={laCapNhat ? "Cập nhật voucher" : "Thêm mới voucher"}
            links={[
              {
                title: <Link to={DUONG_DAN_TRANG.voucher.danh_sach}>Danh sách voucher</Link>,
              },
              {
                title: laCapNhat ? "Cập nhật voucher" : "Thêm mới voucher",
              },
            ]}
          />

          <FormThemSuaVoucher
            laCapNhat={laCapNhat}
            voucherHienTai={data}
          />
        </Container>
      </Page>
    </>
  )

}
