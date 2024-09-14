// react
import React, { Component } from 'react';

// third-party
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// application
import ProductCard from '../shared/ProductCard';
import { sidebarOpen } from '../../store/sidebar';

class ProductsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      luaChonThuongHieu: '',
    };
  }

  thayDoiThuongHieu = (e) => {
    this.setState({
      luaChonThuongHieu: e.target.value,
    });
    this.props?.thayDoiThuongHieu(e.target.value);
  };

  render() {
    const {
      danhSachSanPham,
    } = this.props;

    const sortOptions = [
      { value: 'isDefault', label: 'Mặc định' },
      { value: 'lowToHigh', label: 'Giá thấp đến cao' },
      { value: 'highToLow', label: 'Giá cao xuống thấp' },
    ];

    const listSanPham = danhSachSanPham.map((sanPham) => (
      <div key={sanPham.id} className="products-list__item">
        <ProductCard sanPham={sanPham} />
      </div>
    ));

    return (
      <div className="products-view">
        <div className="products-view__options">
          <div className="view-options__control" style={{ display: 'flex', justifyContent: 'end' }}>
            <label htmlFor="view-options-sort">Chọn thương hiệu</label>
            <div>
              <select
                className="form-control form-control-sm"
                id="view-options-sort"
                value={this.state.luaChonThuongHieu}
                onChange={this.thayDoiThuongHieu}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div
          className="products-view__list products-list container"
          data-layout='grid-4-full'
        >
          <div className="products-list__body">
            {listSanPham}
          </div>
        </div>
      </div>
    );
  }
}

ProductsView.propTypes = {
  /**
   * array of product objects
   */
  products: PropTypes.array,
  /**
   * products list layout (default: 'grid')
   * one of ['grid', 'grid-with-features', 'list']
   */
  layout: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
  /**
   * products list layout (default: 'grid')
   * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
   */
  grid: PropTypes.oneOf(['grid-3-sidebar', 'grid-4-full', 'grid-5-full']),
  /**
   * indicates when sidebar bar should be off canvas
   */
  offcanvas: PropTypes.oneOf(['always', 'mobile']),
};

ProductsView.defaultProps = {
  danhSachSanPham: [],
  layout: 'grid',
  grid: 'grid-4-full',
  offcanvas: 'mobile',
  thayDoiThuongHieu: () => { },
};

const mapDispatchToProps = {
  sidebarOpen,
};

export default connect(
  () => ({}),
  mapDispatchToProps,
)(ProductsView);
