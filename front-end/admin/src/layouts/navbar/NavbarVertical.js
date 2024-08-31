import PropTypes from 'prop-types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useResponsive from '../../hooks/useResponsive';
import { Layout, Menu, Drawer } from 'antd';
import './navbar-vertical-style.css'
import { LogoMobile } from '../../components/Logo';
import { FaUserGroup, FaUserTag, FaCartPlus, FaChartPie } from "react-icons/fa6";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { PATH_DASHBOARD } from '../../routes/paths';

NavbarVertical.propTypes = {
  isCollapse: PropTypes.bool,
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

const { Sider } = Layout;

const menuStyle = {
  border: 'none'
};

const siderStyle = {
  height: '100vh',
  position: 'fixed',
  padding: '75px 7px 0px 7px',
  left: 0
};

const siderMobileStyle = {
  height: '100vh',
  position: 'fixed',
  padding: '5px 7px 0px 7px',
  left: 0
};

export default function NavbarVertical({ isCollapse, isOpenSidebar, onCloseSidebar }) {
  const { isMobile } = useResponsive();
  const { pathname } = useLocation();
  const [selectedKey, setSelectedKey] = useState('');
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }

    if (pathname.includes('/voucher')) {
      setSelectedKey(['voucher']);
      setOpenKeys(['discount']);
    }
    else if (pathname.includes('/product')) {
      setSelectedKey(['product']);
      setOpenKeys(['product-management']);
    }
    else if (pathname.includes('/brand')) {
      setSelectedKey(['brand']);
      setOpenKeys(['product-management']);
    }
    else if (pathname.includes('/color')) {
      setSelectedKey(['color']);
      setOpenKeys(['product-management']);
    }
    else if (pathname.includes('/category')) {
      setSelectedKey(['category']);
      setOpenKeys(['product-management']);
    }
    else if (pathname.includes('/size')) {
      setSelectedKey(['size']);
      setOpenKeys(['product-management']);
    }
    else if (pathname.includes('/statistics')) {
      setSelectedKey(['statistics']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/bill')) {
      setSelectedKey(['bill']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/customer')) {
      setSelectedKey(['customer']);
      setOpenKeys(['account']);
    }
    else if (pathname.includes('/employee')) {
      setSelectedKey(['employee']);
      setOpenKeys(['account']);
    }
    else {
      setSelectedKey([]);
      setOpenKeys([]);
    }

    // #pathname
  }, [pathname]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <>
      {!isMobile ?
        <Sider className={`nav-vertical`}
          trigger={null}
          collapsible
          theme='light'
          collapsed={isCollapse}
          style={siderStyle}
          width={255}
          collapsedWidth={86}
        >
          <Menu style={menuStyle}
            theme="light"
            mode="inline"
            selectedKeys={selectedKey}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            items={items}
          />
        </Sider>
        :
        <Drawer
          width={315}
          placement={'left'}
          closable={false}
          onClose={onCloseSidebar}
          open={isOpenSidebar}
        >
          <LogoMobile />
          <Sider className='nav-vertical-mobile'
            trigger={null}
            collapsible
            theme='light'
            width={300}
            style={siderMobileStyle}
          >
            <Menu style={menuStyle}
              theme="light"
              mode="inline"
              selectedKeys={selectedKey}
              openKeys={openKeys}
              onOpenChange={handleOpenChange}
              items={items}
            />
          </Sider>
        </Drawer>
      }
    </>
  )
}

const ICONS = {
  voucher: <FaUserTag color='#38B6FF' size={15} />,
  account: <FaUserGroup color='#38B6FF' size={15} />,
  statistics: <FaChartPie color='#38B6FF' size={15} />,
  bill: <FaCartPlus color='#38B6FF' size={15} />,
  product: <RiShoppingBag3Fill color='#38B6FF' size={15} />,
}

const labelStyle = {
  fontSize: 16,
  fontWeight: 500,
}

const SpanStyle = ({ label }) => (
  <span style={labelStyle}>{label}</span>
)

const items = [
  {
    key: 'statistics',
    label: <Link to={PATH_DASHBOARD.statistics}>
      <SpanStyle label="Thống kê" />
    </Link>,
    icon: ICONS.statistics,
  },
  {
    key: 'bill',
    label: <Link to={PATH_DASHBOARD.bill.list}>
      <SpanStyle label="Quản lý đơn hàng" />
    </Link>,
    icon: ICONS.bill,
  },
  {
    key: 'product-management',
    label: <SpanStyle label="Quản lý sản phẩm" />,
    icon: ICONS.product,
    children: [
      {
        key: 'product',
        label:
          <Link to={PATH_DASHBOARD.product.list}>
            <SpanStyle label="Sản phẩm" />
          </Link>
      },
      {
        key: 'category',
        label:
          <Link to={PATH_DASHBOARD.product.category}>
            <SpanStyle label="Danh mục" />
          </Link>
      },
      {
        key: 'brand',
        label:
          <Link to={PATH_DASHBOARD.product.brand}>
            <SpanStyle label="Thương hiệu" />
          </Link>
      },
      {
        key: 'color',
        label:
          <Link to={PATH_DASHBOARD.product.color}>
            <SpanStyle label="Màu sắc" />
          </Link>
      },
      {
        key: 'size',
        label:
          <Link to={PATH_DASHBOARD.product.size}>
            <SpanStyle label="Kích cỡ" />
          </Link>
      },
    ],
  },
  {
    key: 'account',
    label: <SpanStyle label='Tài khoản' />,
    icon: ICONS.account,
    children: [
      {
        key: 'customer',
        label:
          <Link to={PATH_DASHBOARD.customer.list}>
            <SpanStyle label='Khách hàng' />
          </Link>
      },
      {
        key: 'employee',
        label:
          <Link to={PATH_DASHBOARD.employee.list}>
            <SpanStyle label='Nhân viên' />
          </Link>
      },
    ],
  },
  {
    key: 'discount',
    label: <SpanStyle label="Khuyến mãi" />,
    icon: ICONS.voucher,
    children: [
      {
        key: 'voucher',
        label:
          <Link to={PATH_DASHBOARD.voucher.list}>
            <SpanStyle label='Voucher' />
          </Link>
      },
    ],
  },
];
