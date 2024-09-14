// react
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// third-party
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

// application
import PageHeader from '../shared/PageHeader';
import ProductsView from './ProductsView';
import { sidebarClose } from '../../store/sidebar';

// data stubs
import theme from '../../data/theme';
import useLoading from '../../hooks/useLoading';
import ProductCard from '../shared/ProductCard';


function ShopPageCategory(props) {

  const { onOpenLoading, onCloseLoading } = useLoading();

  const [data, setData] = useState([]);
  const [listThuongHieu, setListThuongHieu] = useState([]);
  const [idThuongHieu, setIdThuongHieu] = useState(null);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu
    const layDuLieuTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get(`http://127.0.0.1:8000/api/danh-sach-san-pham-client`, {
          params: {
            idThuongHieu: idThuongHieu !== null ? idThuongHieu : null,
          }
        });
        // nếu gọi api thành công sẽ set dữ liệu
        setData(response.data.data.listSanPham); // set dữ liệu được trả về từ backend
        setListThuongHieu(response.data.data.listThuongHieu)
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
  }, [idThuongHieu]) // hàm được gọi lần đầu tiên và sẽ gọi lại khi id thương hiệu thay đổi

  const breadcrumb = [
    { title: 'Trang chủ', url: '/' },
    { title: 'Sản phẩm', url: '' },
  ];
  let content;

  content = (
    <div className="block">
      <div className="products-view">
        <div className="products-view__options container">
          <div className="view-options__control">
            <label htmlFor="view-options-sort">Chọn thương hiệu</label>
            <div>
              <select
                className="form-control form-control-sm"
                id="view-options-sort"
                value={idThuongHieu}
                onChange={(e) => setIdThuongHieu(e.target.value)}
                defaultValue='tatCa'
              >
                <>
                  <option key={"tatCa"} value={null}>
                    Tất cả
                  </option>
                  {listThuongHieu.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.ten}
                    </option>
                  ))}
                </>
              </select>
            </div>
          </div>
        </div>
        <div
          className="products-view__list products-list container mt-2"
          data-layout='grid-4-full'
        >
          <div className="products-list__body">
            {data?.map((sanPham) => (
              <div key={sanPham.id} className="products-list__item">
                <ProductCard sanPham={sanPham} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Sản phẩm - ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb} />

      {content}
    </React.Fragment>
  );
}

ShopPageCategory.propTypes = {
  /**
   * number of product columns (default: 3)
   */
  columns: PropTypes.number,
  /**
   * mode of viewing the list of products (default: 'grid')
   * one of ['grid', 'grid-with-features', 'list']
   */
  viewMode: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
  /**
   * sidebar position (default: 'start')
   * one of ['start', 'end']
   * for LTR scripts "start" is "left" and "end" is "right"
   */
  sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

ShopPageCategory.defaultProps = {
  columns: 3,
  viewMode: 'grid',
  sidebarPosition: 'start',
};

const mapStateToProps = (state) => ({
  sidebarState: state.sidebar,
});

const mapDispatchToProps = {
  sidebarClose,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCategory);

