import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import Page from '../../../components/Page';
import Container from '../../../components/Container';
import { HeaderBreadcrumbs } from '../../../components/HeaderSection';
import VoucherCreateEditForm from './VoucherCreateEditForm';

export default function VoucherCreateEdit() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const [data, setData] = useState({});

  useEffect(() => {
    // call api
  }, []);

  return (
    <>
      <Page title={isEdit ? "Cập nhật voucher" : "Thêm mới voucher"}>
        <Container>
          <HeaderBreadcrumbs
            heading={isEdit ? "Cập nhật voucher" : "Thêm mới voucher"}
            links={[
              {
                title: <Link to={PATH_DASHBOARD.voucher.list}>Danh sách voucher</Link>,
              },
              {
                title: isEdit ? "Cập nhật voucher" : "Thêm mới voucher",
              },
            ]}
          />

          <VoucherCreateEditForm
            isEdit={isEdit}
            currentConstruction={data}
          />
        </Container>
      </Page>
    </>
  )

}
