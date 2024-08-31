import React, { useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
const { confirm } = Modal;

const useConfirm = () => {
  const [loading, setLoading] = useState(false);

  const showConfirm = (title, content, onOk, onCancel) => {
    confirm({
      title: title || "?",
      icon: <ExclamationCircleFilled />,
      content: content || "?",
      okText: "Đồng ý",
      cancelText: "Hủy bỏ",
      onOk() {
        return onOk?.()
      },
      onCancel() {
        onCancel?.();
      },
    });
  };
  // const showPromiseConfirm = () => {
  //   confirm({
  //     title: 'Do you want to delete these items?',
  //     icon: <ExclamationCircleFilled />,
  //     content: 'When clicked the OK button, this dialog will be closed after 1 second',
  //     onOk() {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
  //       }).catch(() => console.log('Oops errors!'));
  //     },
  //     onCancel() { },
  //   });
  // };
  // const showDeleteConfirm = () => {
  //   confirm({
  //     title: 'Are you sure delete this task?',
  //     icon: <ExclamationCircleFilled />,
  //     content: 'Some descriptions',
  //     okText: 'Yes',
  //     okType: 'danger',
  //     cancelText: 'No',
  //     onOk() {
  //       console.log('OK');
  //     },
  //     onCancel() {
  //       console.log('Cancel');
  //     },
  //   });
  // };
  // const showPropsConfirm = () => {
  //   confirm({
  //     title: 'Are you sure delete this task?',
  //     icon: <ExclamationCircleFilled />,
  //     content: 'Some descriptions',
  //     okText: 'Yes',
  //     okType: 'danger',
  //     okButtonProps: {
  //       disabled: true,
  //     },
  //     cancelText: 'No',
  //     onOk() {
  //       console.log('OK');
  //     },
  //     onCancel() {
  //       console.log('Cancel');
  //     },
  //   });
  // };
  return { showConfirm/* , showPropsConfirm, showDeleteConfirm, showPromiseConfirm */ };
}

export default useConfirm;
