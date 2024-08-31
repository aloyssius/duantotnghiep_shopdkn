// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  statistics: path(ROOTS_DASHBOARD, '/statistics'),
  voucher: {
    root: path(ROOTS_DASHBOARD, '/voucher'),
    create: path(ROOTS_DASHBOARD, '/voucher/new'),
    list: path(ROOTS_DASHBOARD, '/voucher/list'),
    edit: (id) => path(ROOTS_DASHBOARD, `/voucher/${id}/edit`),
  },
  customer: {
    root: path(ROOTS_DASHBOARD, '/customer'),
    create: path(ROOTS_DASHBOARD, '/customer/new'),
    list: path(ROOTS_DASHBOARD, '/customer/list'),
    edit: (id) => path(ROOTS_DASHBOARD, `/customer/${id}/edit`),
  },
  employee: {
    root: path(ROOTS_DASHBOARD, '/employee'),
    create: path(ROOTS_DASHBOARD, '/employee/new'),
    list: path(ROOTS_DASHBOARD, '/employee/list'),
    edit: (id) => path(ROOTS_DASHBOARD, `/employee/${id}/edit`),
  },
  bill: {
    root: path(ROOTS_DASHBOARD, '/bill'),
    list: path(ROOTS_DASHBOARD, '/bill/list'),
    details: (id) => path(ROOTS_DASHBOARD, `/bill/${id}`),
  },
  product: {
    root: path(ROOTS_DASHBOARD, '/product'),
    create: path(ROOTS_DASHBOARD, '/product/new'),
    list: path(ROOTS_DASHBOARD, '/product/list'),
    edit: (id) => path(ROOTS_DASHBOARD, `/product/${id}/edit`),
    color: path(ROOTS_DASHBOARD, '/color/list'),
    size: path(ROOTS_DASHBOARD, '/size/list'),
    brand: path(ROOTS_DASHBOARD, '/brand/list'),
    category: path(ROOTS_DASHBOARD, '/category/list'),
  },
};

