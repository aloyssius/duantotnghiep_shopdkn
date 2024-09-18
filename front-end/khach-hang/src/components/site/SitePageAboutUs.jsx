// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';
import PageHeader from '../shared/PageHeader';

// data stubs
import theme from '../../data/theme';
import Logo from '../Logo';


const breadcrumb = [
  { title: 'Trang chủ', url: '/' },
  { title: 'Giới thiệu', url: '' },
];

function SitePageAboutUs() {
  return (
    <div className="block about-us">
      <Helmet>
        <title>{`Giới thiệu — ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb} />

      <div className="text-center">
        <Logo height={140} />
      </div>

      <div className='container mt-4' style={{ paddingInline: '190px' }}>
        <p style={{ fontSize: 20 }}>
          Chào mừng đến với <span style={{ fontWeight: '550' }}>[ĐKN Shop]</span> - điểm đến lý tưởng cho những ai đam mê thời trang và phong cách. Tại đây, chúng tôi tự hào mang đến cho bạn những sản phẩm giày dép chất lượng cao, đa dạng về mẫu mã và kiểu dáng để bạn có thể thoải mái lựa chọn.

          Với hơn 10 năm kinh nghiệm trong lĩnh vực bán giày dép, chúng tôi hiểu rõ nhu cầu và sở thích của khách hàng. Chính vì vậy, <span style={{ fontWeight: '550' }}>[ĐKN Shop]</span> luôn chú ý đến việc cập nhật những xu hướng thời trang mới nhất, đồng thời tìm kiếm và phân phối những sản phẩm giày dép ưu việt, đáp ứng mọi tiêu chí về chất lượng, thiết kế và cả giá.

          Ở rìa đó, chúng tôi kết nối với trải nghiệm mua sắm tuyệt vời cho khách hàng thông qua dịch vụ chăm sóc khách hàng chug, giao hàng nhanh chóng và chính sách mua hàng linh hoạt. Hãy cùng <span style={{ fontWeight: '550' }}>[ĐKN Shop]</span> khám phá những mẫu giày ưng ý và tạo nên phong cách riêng của bạn ngay hôm nay!
        </p>
      </div>
    </div>
  );
}

export default SitePageAboutUs;
