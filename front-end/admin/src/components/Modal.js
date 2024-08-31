import { Button, Modal as ModalAntd } from 'antd';
import PropTypes from 'prop-types';
import { ExclamationCircleFilled } from "@ant-design/icons";

Modal.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.node,
  onFinish: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.node,
  footerClose: PropTypes.bool,
}

const titleIconStyle = {
  marginLeft: '10px',
  fontSize: '16.5px',
}

const titleStyle = {
  fontSize: '16.5px',
}

export default function Modal({
  isOpen, title, onFinish, onClose, children, footerClose, ...other }) {

  return (
    <ModalAntd
      open={isOpen}
      title={
        <span style={titleStyle}>{title}</span>
      }
      onCancel={onClose}
      footer={[
        <>
          {footerClose &&
            <>
              <Button className='mt-10' onClick={onClose}>Đóng</Button>
            </>
            ||
            <>
              <Button className='mt-10' onClick={onClose}>Hủy bỏ</Button>
              <Button className='mt-10' onClick={onFinish} type='primary'>Xác nhận</Button>
            </>
          }
        </>
      ]}
      {...other}
    >
      <div>
        {children}
      </div>
    </ModalAntd>
  )

}
