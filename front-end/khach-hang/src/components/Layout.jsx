// react
import React, { Suspense, lazy } from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';

// application
import Footer from './footer';
import Header from './header';
import MobileMenu from './mobile/MobileMenu';
import Quickview from './shared/Quickview';
import LoadingScreen from './shared/LoadingScreen';

// pages
import SitePageAboutUs from './site/SitePageAboutUs';
import SitePolicy from './site/SitePolicy';
import SitePageNotFound from './site/SitePageNotFound';

// data stubs
import theme from '../data/theme';

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

const DangNhapDangKy = Loadable(lazy(() => import('./account/DangNhapDangKy')));
const MyCart = Loadable(lazy(() => import('./shop/ShopPageCart')));
const Checkout = Loadable(lazy(() => import('./shop/ShopPageCheckout')));
const TrackOrder = Loadable(lazy(() => import('./shop/ShopPageTrackOrder')));
const DanhSachSanPham = Loadable(lazy(() => import('./shop/ShopPageCategory')));
const SanPhamChiTiet = Loadable(lazy(() => import('./shop/ShopPageProduct')));
const DonHangChiTiet = Loadable(lazy(() => import('./account/DonHangChiTiet')));
const LichSuMuaHang = Loadable(lazy(() => import('./account/LichSuMuaHang')));

function Layout(props) {
  const { match, headerLayout, homeComponent } = props;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  return (
    <React.Fragment>
      <Helmet>
        <title>{theme.name}</title>
        <meta name="description" content={theme.fullName} />
      </Helmet>


      <Quickview />

      <MobileMenu />

      <div className="site">
        <header className="site__header d-lg-block d-none">
          <Header layout={headerLayout} />
        </header>

        <div className="site__body">
          <Switch>
            <Route exact path={`${match.path}`} component={homeComponent} />

            <Route
              exact
              path="/san-pham"
              render={(props) => (
                <DanhSachSanPham {...props} />
              )}
            />

            <Route
              exact
              path="/theo-doi-don-hang"
              render={(props) => (
                <DonHangChiTiet {...props} trackOrder />
              )}
            />

            <Route exact path="/san-pham/:ma" component={SanPhamChiTiet} />

            <Route exact path="/gio-hang" component={MyCart} />
            <Route exact path="/checkout" component={Checkout} />
            <Route exact path="/tra-cuu-don-hang" component={TrackOrder} />

            <Route exact path="/dang-nhap" component={DangNhapDangKy} />
            <Route exact path="/lich-su-mua-hang" component={LichSuMuaHang} />
            <Route exact path="/don-hang-cua-ban/:ma" component={DonHangChiTiet} />

            <Route exact path="/gioi-thieu" component={SitePageAboutUs} />
            <Route exact path="/chinh-sach" component={SitePolicy} />
            <Route exact path="/khong-tim-thay-trang" component={SitePageNotFound} />

            <Route component={SitePageNotFound} />
          </Switch>
        </div>

        <footer className="site__footer">
          <Footer />
        </footer>
      </div>
    </React.Fragment>
  );
}

Layout.propTypes = {
  /**
   * header layout (default: 'classic')
   * one of ['classic', 'compact']
   */
  headerLayout: PropTypes.oneOf(['default', 'compact']),
  /**
   * home component
   */
  homeComponent: PropTypes.elementType.isRequired,
};

Layout.defaultProps = {
  headerLayout: 'default',
};

export default Layout;
