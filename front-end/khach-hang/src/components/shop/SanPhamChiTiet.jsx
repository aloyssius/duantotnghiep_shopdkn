// react
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { useParams, Link, useHistory } from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';

// data stubs
import theme from '../../data/theme';
import useNotification from '../../hooks/useNotification';
import useLoading from '../../hooks/useLoading';
import ProductGallery from '../shared/ProductGallery';
import { formatCurrencyVnd } from '../../utils/formatNumber';

function SanPhamChiTiet(props) {

  const { layout } = props;

  const { ma } = useParams();

  const history = useHistory();

  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();

  const { onOpenLoading, onCloseLoading } = useLoading();

  const [data, setData] = useState([]);

  const [sizeDuocChon, setSizeDuocChon] = useState(null);

  useEffect(() => {
    // khai báo hàm lấy dữ liệu
    const layDuLieuTuBackEnd = async () => {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get(`http://127.0.0.1:8000/api/tim-san-pham-client/${ma}`);
        // nếu gọi api thành công sẽ set dữ liệu
        setData(response.data.data); // set dữ liệu được trả về từ backend
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

  const hamThayDoiSize = (id) => {
    setSizeDuocChon(id);
  }

  const postThemSanPhamVaoGioHang = async (laMuaNgay = false) => {
    const taiKhoan = JSON.parse(localStorage.getItem('tai-khoan'));
    if (!taiKhoan) { // nếu không có tài khoản 
      history.push('/dang-nhap');
    }

    if (sizeDuocChon !== null && taiKhoan) {

      // bật loading
      onOpenLoading();
      try {

        // gọi api từ backend
        const response = await axios.post("http://127.0.0.1:8000/api/them-gio-hang-chi-tiet", { idTaiKhoan: taiKhoan?.id, maSanPham: ma, idKichCo: sizeDuocChon });
        // nếu gọi api thành công sẽ set dữ liệu giỏ hàng của tài khoản vào bộ nhớ trình duyệt
        localStorage.setItem('gio-hang-chi-tiet-tai-khoan', JSON.stringify(response.data.data));

        onOpenSuccessNotify('Thêm vào giỏ hàng thành công');
        console.log(response.data.data);

        if (laMuaNgay) {
          history.push('/gio-hang');
        }

      } catch (error) {
        console.error(error);
        onOpenErrorNotify(error.response.data.message);
        // console ra lỗi
      } finally {
        onCloseLoading();
        // tắt loading
      }

    }
  }

  const breadcrumb = [
    { title: 'Trang chủ', url: '/' },
    { title: 'Sản phẩm', url: '/san-pham' },
    { title: `${data?.tenSanPham}`, url: '' },
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>{`${data?.tenSanPham || ""} — ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb} />
      <div className="block">
        <div className="container">
          <div className={`product product--layout--${layout}`}>
            <div className="product__content">
              <ProductGallery layout={layout} images={data?.listHinhAnh} />

              <div className="product__info">
                <h1 className="product__name">{data?.tenSanPham}</h1>
                <ul className="product__meta">
                  <li >Mã sản phẩm: <span style={{ fontWeight: '500' }}>{data?.maSanPham}</span></li>
                </ul>
              </div>

              <div className="product__sidebar">
                <div className="product__prices">
                  <span className='product__price'>{formatCurrencyVnd(String(data?.donGia))}</span>
                </div>

                <div className='divide-product' />

                <form className="product__options">
                  <div className="form-group product__option">
                    <div className="product__option-label">Kích cỡ</div>
                    <div className="input-radio-label">
                      <div className="input-radio-label__list">
                        {data?.listKichCo?.map((item) => {
                          return (
                            <label>
                              <input
                                className='input-radio-label__item'
                                onClick={() => hamThayDoiSize(item?.id)} // khi chọn kích cỡ nào nó sẽ set sizeDuocChon là id Kích cỡ đó
                                type="radio"
                                name="size"
                                disabled={item?.soLuong <= 0} // ko cho chọn những kích cỡ có số lượng tồn bé hơn hoặc bằng 0
                                checked={sizeDuocChon === item.id}  // chọn kích cỡ nào sẽ hiện màu cam lên của kích cỡ đó
                              />
                              <span style={{ cursor: 'pointer' }}>{item?.ten}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className='divide-product' />
                  <div className="form-group product__option mt-4">
                    <div className="product__actions">
                      <div className="product__actions-item product__actions-item--addtocart">
                        <button
                          onClick={() => postThemSanPhamVaoGioHang()}
                          type="button"
                          className='btn btn-secondary-light btn-lg'
                        >
                          THÊM VÀO GIỎ HÀNG
                        </button>
                      </div>
                      <div className="product__actions-item product__actions-item--addtocart">
                        <button
                          onClick={() => postThemSanPhamVaoGioHang(true)}
                          type="button"
                          className='btn btn-primary btn-lg'                        >
                          MUA NGAY
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="product__footer">
                <div className="product__share-links share-links">
                  <ul className="share-links__list">
                    <li className="share-links__item share-links__item--type--like"><Link to="/">Like</Link></li>
                    <li className="share-links__item share-links__item--type--tweet"><Link to="/">Tweet</Link></li>
                    <li className="share-links__item share-links__item--type--pin"><Link to="/">Pin It</Link></li>
                    <li className="share-links__item share-links__item--type--counter"><Link to="/">4K</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 500 }}>
      </div>
    </React.Fragment>
  );
}

SanPhamChiTiet.propTypes = {
  /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
  layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
  /**
   * sidebar position (default: 'start')
   * one of ['start', 'end']
   * for LTR scripts "start" is "left" and "end" is "right"
   */
  sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

SanPhamChiTiet.defaultProps = {
  layout: 'standard',
  sidebarPosition: 'start',
};

export default SanPhamChiTiet;
