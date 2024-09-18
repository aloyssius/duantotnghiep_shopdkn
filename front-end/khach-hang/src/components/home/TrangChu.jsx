// react
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// third-party
import { Helmet } from 'react-helmet';

// blocks
import BlockBanner from '../blocks/BlockBanner';
import BlockBrands from '../blocks/BlockBrands';
import BlockFeatures from '../blocks/BlockFeatures';
import BlockSlideShow from '../blocks/BlockSlideShow';

// data stubs
import ProductCard from '../shared/ProductCard';

import axios from 'axios';
import useLoading from '../../hooks/useLoading';

function TrangChu() {

  const { onOpenLoading, onCloseLoading } = useLoading();

  const [data, setData] = useState([]);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu
    const layDuLieuTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get(`http://127.0.0.1:8000/api/danh-sach-san-pham-client`);
        // nếu gọi api thành công sẽ set dữ liệu
        setData(response.data.data.listSanPham); // set dữ liệu được trả về từ backend
        console.log(response.data.data)
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
  }, []) // hàm được gọi lần đầu tiên và sẽ gọi lại khi id thương hiệu thay đổi

  const listSanPhamMoiNhat = data?.map((sanPham) => (
    <div key={sanPham.id} className="products-list__item">
      <ProductCard sanPham={sanPham} />
    </div>
  ));

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Trang chủ - ĐKN Shop`}</title>
      </Helmet>

      <BlockSlideShow />

      <BlockFeatures />

      <HeaderProductList title="SẢN PHẨM MỚI NHẤT" />

      <ProductList style={{ marginBottom: 30 }} data={listSanPhamMoiNhat} />

      <BlockBanner />

      <BlockBrands />
    </React.Fragment>
  );
}

const ProductList = ({ data, ...other }) => {
  return (
    <div
      className="products-view__list products-list container"
      data-layout='grid-4-full'
      {...other}
    >
      <div className="products-list__body">
        {data?.slice(0, 8)}
      </div>
    </div>
  )
}

const ButtonViewMore = () => {
  return (
    <div className='d-flex justify-content-center' style={{ marginBottom: 35 }}>
      <Link to={'/'}>
        <button className='btn btn-primary'>Xem thêm</button>
      </Link>
    </div>
  )
}

const HeaderProductList = ({ title }) => {
  return (
    <div className='d-flex justify-content-center' style={{ marginBottom: 30 }}>
      <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#ff6700' }}>{title}</span>
    </div>
  )
}

export default TrangChu;
