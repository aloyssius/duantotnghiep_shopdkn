// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// application
import Currency from './Currency';
import { cartAddItem } from '../../store/cart';
import { compareAddItem } from '../../store/compare';
import { quickviewOpen } from '../../store/quickview';
import { wishlistAddItem } from '../../store/wishlist';

import { formatCurrencyVnd } from '../../utils/formatNumber';

function ProductCard(props) {
  const {
    sanPham,
    layout,
  } = props;
  const containerClasses = classNames('product-card', {
    'product-card--layout--grid product-card--size--sm': layout === 'grid-sm',
    'product-card--layout--grid product-card--size--nl': layout === 'grid-nl',
    'product-card--layout--grid product-card--size--lg': layout === 'grid-lg',
    'product-card--layout--list': layout === 'list',
    'product-card--layout--horizontal': layout === 'horizontal',
  });

  let hinhAnh;
  let donGia;

  if (sanPham.hinhAnh) {
    hinhAnh = (
      <div className="product-card__image">
        <Link to={`/san-pham/${sanPham?.ma}`}><img src={sanPham?.hinhAnh} alt="" /></Link>
      </div>
    );
  }

  if (sanPham.donGia) {
    donGia = (
      <div className="product-card__prices">
        {`${formatCurrencyVnd(String(sanPham?.donGia))}`}
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {hinhAnh}
      <div className="product-card__info">
        <div className="product-card__name">
          <Link to={`/san-pham/${sanPham?.ma}`}>{sanPham?.ten}</Link>
        </div>
      </div>
      <div className="product-card__actions">
        {donGia}
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  /**
   * product object
   */
  product: PropTypes.object.isRequired,
  /**
   * product card layout
   * one of ['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']
   */
  layout: PropTypes.oneOf(['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']),
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  cartAddItem,
  wishlistAddItem,
  compareAddItem,
  quickviewOpen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductCard);
