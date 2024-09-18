// react
import React, { useEffect } from 'react';

// application
import Indicator from './Indicator';
import { Cart20Svg } from '../../svg';

function IndicatorCart() {

  return (
    <Indicator url='/gio-hang' icon={<Cart20Svg />} />
  );
}

export default IndicatorCart;
