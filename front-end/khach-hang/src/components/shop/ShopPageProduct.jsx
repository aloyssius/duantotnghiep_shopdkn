// react
import React, { useEffect, useState } from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { useParams, useLocation } from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';
import Product from '../shared/Product';
import ProductTabs from './ProductTabs';

// widgets
import WidgetCategories from '../widgets/WidgetCategories';
import WidgetProducts from '../widgets/WidgetProducts';

// data stubs
import categories from '../../data/shopWidgetCategories';
import products from '../../data/shopProducts';
import theme from '../../data/theme';
import useFetch from '../../hooks/useFetch';
import { CLIENT_API } from '../../api/apiConfig';
import useUser from '../../hooks/useUser';
import useNotification from '../../hooks/useNotification';

function ShopPageProduct(props) {

  const { layout, sidebarPosition, match } = props;

  const { sku } = useParams();

  const { onUpdateCart } = useUser();

  const { data, isLoading, key } = useFetch(CLIENT_API.product.details(sku));

  const [selectedSizeId, setSelectedSizeId] = useState(null);

  const handleChangeSizeId = (id) => {
    if (id !== selectedSizeId) {
      setSelectedSizeId(id);
    }
  }

  const handleAddProductToCart = (buyNow = false) => {
    onUpdateCart(selectedSizeId, buyNow);
  }

  useEffect(() => {
    setSelectedSizeId(null);
  }, [key])

  let product;

  if (match.params.productId) {
    product = products.find((x) => x.id === parseFloat(match.params.productId));
  } else {
    product = products[products.length - 1];
  }

  const breadcrumb = [
    { title: 'Trang chủ', url: '/' },
    { title: 'Sản phẩm', url: '/product-list' },
    { title: `${data?.name || ""} ${data?.colorName || ""}`, url: '' },
  ];

  let content;

  content = (
    <React.Fragment>
      <div className="block">
        <div className="container">
          <Product
            product={data}
            layout={layout}
            onChangeSizeId={handleChangeSizeId}
            isLoading={isLoading}
            sizeId={selectedSizeId}
            fetch={handleAddProductToCart}
            key={key}
          />
          <ProductTabs desc={data?.description} />
        </div>
      </div>

    </React.Fragment>
  );

  return (
    <React.Fragment>
      {data?.name &&
        <Helmet>
          <title>{`${data?.name || ""} ${data?.colorName || ""} — ${theme.name}`}</title>
        </Helmet>
      }

      <PageHeader breadcrumb={breadcrumb} />
      {data?.name ?
        <>
          {content}
        </> :
        <div style={{ height: 500 }}>

        </div>
      }
    </React.Fragment>
  );
}

ShopPageProduct.propTypes = {
  /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
  layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
  /**
   * sidebar position (default: 'start')
   * one of ['start', 'end']
   * for LTR scripts "start" is "left" and "end" is "right"
   */
  sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

ShopPageProduct.defaultProps = {
  layout: 'standard',
  sidebarPosition: 'start',
};

export default ShopPageProduct;
