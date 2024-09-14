// react
import React from 'react';
import { FaUser } from "react-icons/fa6";
import { BsFillBoxSeamFill } from "react-icons/bs";

import { Link, useHistory } from 'react-router-dom';

// application
import Dropdown from './Dropdown';

function Topbar() {

  const history = useHistory(); // dùng để truyển sang dường dẫn trang khác

  const dangXuat = () => {
    localStorage.removeItem('tai-khoan');
    console.log(localStorage.getItem('tai-khoan'));
    history.push('/'); // chuyển sang trang chủ
  }

  const accountLinks = [
    { title: 'Lịch sử mua hàng', url: `/lich-su-mua-hang` },
    { title: 'Đăng xuất', action: () => dangXuat() },
  ];

  const taiKhoan = JSON.parse(localStorage.getItem('tai-khoan'));
  console.log(taiKhoan);

  return (
    <div className="site-header__topbar topbar">
      <div className="topbar__container container">
        <div className="topbar__row topbar-container">
          <div className="topbar__spring" />
          <Link to={'/tra-cuu-don-hang'} className="topbar-link">
            <div className="topbar-item">
              <BsFillBoxSeamFill className='topbar-item-icon' />
              <span className='topbar-item-name'>Tra cứu đơn hàng</span>
            </div>
          </Link>
          {!taiKhoan &&
            <Link to={'/dang-nhap'} className="topbar-link">
              <div className="topbar-item">
                <FaUser className='topbar-item-icon' />
                <span className='topbar-item-name'>Đăng nhập
                  <span className='divide'>|</span>
                  Đăng ký</span>
              </div>
            </Link>
          }

          {taiKhoan &&
            <Dropdown
              title={taiKhoan?.email}
              items={accountLinks}
              icon={<FaUser className='topbar-item-icon' />}
            />
          }

        </div>
      </div>
    </div>
  );
}

export default Topbar;
