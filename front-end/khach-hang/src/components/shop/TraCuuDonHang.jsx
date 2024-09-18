// react
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// third-party
import { Helmet } from 'react-helmet';

// application
import PageHeader from '../shared/PageHeader';

// data stubs
import theme from '../../data/theme';
import useLoading from '../../hooks/useLoading';

function TraCuuDonHang() {
  const breadcrumb = [
    { title: 'Trang chủ', url: '/' },
    { title: 'Tra cứu đơn hàng', url: '/' },
  ];

  const { onOpenLoading, onCloseLoading } = useLoading();
  const history = useHistory();

  const [maDonHang, setMaDonHang] = useState("");

  const handleSubmit = async () => {
    if (maDonHang.trim() !== "") {
      // bật loading
      onOpenLoading();
      try {
        // gọi api từ backend
        const response = await axios.get(`http://127.0.0.1:8000/api/chi-tiet-don-hang/${maDonHang}`);
        console.log(response.data.data);

        history.push(`/thong-tin-don-hang/${response.data.data.ma}`);

      } catch (error) {
        console.error(error);
        // console ra lỗi
      } finally {
        onCloseLoading();
        // tắt loading
      }
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Tra cứu đơn hàng — ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb} />

      <div className="block">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 col-md-8">
              <div className="card flex-grow-1 mb-0 mt-lg-4 mt-md-3 mt-2">
                <div className="card-body">
                  <div className="card-title text-center text-uppercase"><h1 className="pt-lg-0 pt-2">Tra Cứu Đơn Hàng</h1></div>
                  <form>
                    <div className="form-group">
                      <label htmlFor="track-order-id">Mã đơn hàng</label>
                      <input
                        value={maDonHang}
                        onChange={(e) => setMaDonHang(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="Nhập mã đơn hàng"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            // handleSubmit();
                          }
                        }}
                      />
                    </div>
                    <div className="">
                      <button type="button" onClick={handleSubmit} className="btn btn-primary btn-lg btn-block">Tra cứu đơn hàng</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TraCuuDonHang;
