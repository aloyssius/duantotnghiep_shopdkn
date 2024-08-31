function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_API = '/api';

export const ADMIN_API = {
  voucher: {
    getAll: path(ROOTS_API, '/vouchers'),
  }
}
