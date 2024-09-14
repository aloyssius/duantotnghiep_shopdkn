// react
import React from 'react';

// application
import Indicator from './Indicator';
import { Cart20Svg } from '../../svg';

function IndicatorCart() {

  const soLuongSanPhamTrongGioHang = JSON.parse(localStorage.getItem('gio-hang-chi-tiet-tai-khoan'))?.length;
  console.log(soLuongSanPhamTrongGioHang);

  return (
    <Indicator url='/gio-hang' value={soLuongSanPhamTrongGioHang} icon={<Cart20Svg />} />
  );
}

export default IndicatorCart;
