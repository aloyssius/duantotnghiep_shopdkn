import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import DashboardLayout from '../layouts';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  window.scrollTo(0, 0);
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <DashboardLayout />
      ),
      children: [
        { path: 'thong-ke', element: <ThongKe /> },
        {
          path: 'voucher',
          children: [
            { path: 'danh-sach', element: <DanhSachVoucher /> },
            { path: 'tao-moi', element: <ThemSuaVoucher /> },
            { path: ':id', element: <ThemSuaVoucher /> },
          ],
        },

        {
          path: 'san-pham',
          children: [
            { path: 'danh-sach', element: <DanhSachSanPham /> },
            { path: 'tao-moi', element: <ThemSuaSanPham /> },
            { path: ':id', element: <ThemSuaSanPham /> },
          ],
        },

        {
          path: 'don-hang',
          children: [
            { path: 'danh-sach', element: <DanhSachDonHang /> },
            { path: ':id', element: <DonHangChiTiet /> },
          ],
        },

        {
          path: 'nhan-vien',
          children: [
            { path: 'danh-sach', element: <DanhSachNhanVien /> },
          ],
        },

        {
          path: 'khach-hang',
          children: [
            { path: 'danh-sach', element: <DanhSachKhachHang /> },
          ],
        },
      ],
    },

    // { path: '/', element: <Navigate to="/dashboard/employee/list" replace /> },
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

const DanhSachVoucher = Loadable(lazy(() => import('../pages/dashboard/voucher/DanhSachVoucher')));
const ThemSuaVoucher = Loadable(lazy(() => import('../pages/dashboard/voucher/ThemSuaVoucher')));
const ThemSuaSanPham = Loadable(lazy(() => import('../pages/dashboard/san-pham/ThemSuaSanPham')));
const DanhSachDonHang = Loadable(lazy(() => import('../pages/dashboard/don-hang/DanhSachDonHang')));
const DonHangChiTiet = Loadable(lazy(() => import('../pages/dashboard/don-hang/DonHangChiTiet')));
const DanhSachSanPham = Loadable(lazy(() => import('../pages/dashboard/san-pham/DanhSachSanPham')));
const DanhSachNhanVien = Loadable(lazy(() => import('../pages/dashboard/nhan-vien/DachSachNhanVien')));
const DanhSachKhachHang = Loadable(lazy(() => import('../pages/dashboard/khach-hang/DanhSachKhachHang')));
const ThongKe = Loadable(lazy(() => import('../pages/dashboard/thong-ke/ThongKe')));
