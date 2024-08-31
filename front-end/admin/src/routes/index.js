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
    // {
    //   path: 'auth',
    //   children: [
    //     {
    //       path: 'login',
    //       element: (
    //         <GuestGuard>
    //           <Login />
    //         </GuestGuard>
    //       ),
    //     },
    //     {
    //       path: 'register',
    //       element: (
    //         <GuestGuard>
    //           <Register />
    //         </GuestGuard>
    //       ),
    //     },
    //     { path: 'login-unprotected', element: <Login /> },
    //     { path: 'register-unprotected', element: <Register /> },
    //     { path: 'reset-password', element: <ResetPassword /> },
    //     { path: 'verify', element: <VerifyCode /> },
    //   ],
    // },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <DashboardLayout />
      ),
      children: [
        // { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        // { path: 'analytics', element: <GeneralAnalytics /> },
        {
          path: 'voucher',
          children: [
            { element: <Navigate to="/dashboard/voucher/list" replace />, index: true },
            { path: 'list', element: <VoucherList /> },
            { path: 'new', element: <VoucherCreateEdit /> },
            { path: ':id/edit', element: <VoucherCreateEdit /> },
          ],
        },

        {
          path: 'product',
          children: [
            { element: <Navigate to="/dashboard/product/list" replace />, index: true },
            { path: 'list', element: <ProductList /> },
          ],
        },

        {
          path: 'bill',
          children: [
            { element: <Navigate to="/dashboard/bill/list" replace />, index: true },
            { path: 'list', element: <BillList /> },
          ],
        },

        {
          path: 'employee',
          children: [
            { element: <Navigate to="/dashboard/employee/list" replace />, index: true },
            { path: 'list', element: <EmployeeList /> },
          ],
        },

        {
          path: 'customer',
          children: [
            { element: <Navigate to="/dashboard/customer/list" replace />, index: true },
            { path: 'list', element: <CustomerList /> },
          ],
        },
      ],
    },

    // { path: '/', element: <Navigate to="/dashboard/employee/list" replace /> },
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

const VoucherList = Loadable(lazy(() => import('../pages/dashboard/voucher/VoucherList')));
const VoucherCreateEdit = Loadable(lazy(() => import('../pages/dashboard/voucher/VoucherCreateEdit')));
const BillList = Loadable(lazy(() => import('../pages/dashboard/bill/BillList')));
const ProductList = Loadable(lazy(() => import('../pages/dashboard/product/ProductList')));
const EmployeeList = Loadable(lazy(() => import('../pages/dashboard/employee/EmployeeList')));
const CustomerList = Loadable(lazy(() => import('../pages/dashboard/customer/CustomerList')));
