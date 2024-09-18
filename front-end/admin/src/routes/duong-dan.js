export const DUONG_DAN_TRANG = {
  thong_ke: '/thong-ke',
  voucher: {
    tao_moi: '/voucher/tao-moi',
    danh_sach: '/voucher/danh-sach',
    cap_nhat: (id) => `/voucher/${id}`,
  },
  khach_hang: {
    tao_moi: '/khach-hang/tao-moi',
    danh_sach: '/khach-hang/danh-sach',
    cap_nhat: (id) => `/khach-hang/${id}`,
  },
  nhan_vien: {
    tao_moi: '/nhan-vien/tao-moi',
    danh_sach: '/nhan-vien/danh-sach',
    cap_nhat: (id) => `/nhan-vien/${id}`,
  },
  don_hang: {
    danh_sach: '/don-hang/danh-sach',
    chi_tiet: (id) => `/don-hang/${id}`,
  },
  san_pham: {
    tao_moi: '/san-pham/tao-moi',
    danh_sach: '/san-pham/danh-sach',
    cap_nhat: (id) => `/san-pham/${id}`,
    mau_sac: '/mau-sac/danh-sach',
    tao_moi_mau_sac: '/mau-sac/tao-moi',
    cap_nhat_mau_sac: (id) => `/mau-sac/${id}`,
    thuong_hieu: '/thuong-hieu/danh-sach',
    tao_moi_thuong_hieu: '/thuong-hieu/tao-moi',
    cap_nhat_thuong_hieu: (id) => `/thuong-hieu/${id}`,
  },
};

