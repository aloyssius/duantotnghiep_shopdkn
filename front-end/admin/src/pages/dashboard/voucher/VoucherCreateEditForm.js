import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"
import { formatCurrencyVnd } from '../../../utils/formatCurrency';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// antd
import { Col, Row, Button, Space, DatePicker } from "antd"
// date
import moment from 'moment';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';
// routes
import { PATH_DASHBOARD } from "../../../routes/paths"
// components
import Modal from '../../../components/Modal';
import FormProvider from '../../../components/hook-form/FormProvider';
import RHFInput from '../../../components/hook-form/RHFInput';
// hooks
import useConfirm from '../../../hooks/useConfirm';
import useNotification from '../../../hooks/useNotification';

import { clientPost } from '../../../utils/axios';


// ----------------------------------------------------------------------

VoucherCreateEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentConstruction: PropTypes.object,
  isEditting: PropTypes.bool,
};

export default function VoucherCreateEditForm({ isEdit, currentVoucher }) {
  const navigate = useNavigate();

  const { onOpenSuccessNotify } = useNotification();
  const { showConfirm } = useConfirm();

  const VoucherSchema = Yup.object().shape({
    // name: Yup.string().trim().required('Tên không được bỏ trống!')
  })

  const defaultValues = {
    code: '',
    description: '',
    startDate: null,
  };

  const methods = useForm({
    resolver: yupResolver(VoucherSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    getValues,
    setValue,
    handleSubmit,
  } = methods;

  useEffect(() => {
    if (isEdit && currentVoucher) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentVoucher])

  const post = async (body) => {
    try {
      // const response = await clientPost(url, body);
      await new Promise((resolve) => setTimeout(resolve, 300));
      onOpenSuccessNotify('Thêm mới voucher thành công!')
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async (data) => {
    console.log(data);
    showConfirm("Xác nhận thêm mới?", "Bạn có chắc chắn muốn thêm voucher?", () => post(data));
  }


  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Row className='mt-10' gutter={25} style={{ display: "flex", justifyContent: "center" }}>

          <Col span={9}>
            <RHFInput
              label='Mã'
              name='code'
              placeholder='Nhập mã voucher (tối đa 20 ký tự) ...'
              required
            />
          </Col>

          <Col span={9}>
            <RHFInput
              label='Giá trị'
              name='value'
              placeholder='Nhập giá trị voucher ...'
              required
              onChange={(e) => setValue('value', formatCurrencyVnd(e.target.value))}
            />
          </Col>

          <Col span={9}>
            <RHFInput
              label='Mô tả'
              name='description'
              placeholder='Nhập mô tả voucher ...'

            />
          </Col>

          <Col span={9}>
            <RHFInput
              label='Điều kiện áp dụng'
              name='minOrderValue'
              placeholder='Nhập điều kiện tối thiểu khi áp dụng voucher ...'
              required
              onChange={(e) => setValue('minOrderValue', formatCurrencyVnd(e.target.value))}
            />
          </Col>

          <Col span={9}>
            <Controller
              name='startDate'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <label className='mt-15 d-block' style={{ fontWeight: '500' }}>
                    Ngày bắt đầu
                    <span className='required'></span>
                  </label>
                  <DatePicker
                    placeholder='Chọn ngày bắt đầu'
                    className='mt-13'
                    status={error && 'error'}
                    {...field}
                    showTime={{ use12Hours: true }}
                    format="DD/MM/YYYY hh:mm A"
                    style={{ width: "100%" }}
                  />
                  {error && <span className='color-red mt-3 d-block'>{error?.message}</span>}
                </>
              )}
            />
          </Col>

          <Col span={9}>
            <Controller
              name='endDate'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <label className='mt-15 d-block' style={{ fontWeight: '500' }}>
                    Ngày kết thúc
                    <span className='required'></span>
                  </label>
                  <DatePicker
                    placeholder='Chọn ngày kết thúc'
                    className='mt-13'
                    status={error && 'error'}
                    {...field}
                    showTime={{ use12Hours: true }}
                    format="DD/MM/YYYY hh:mm A"
                    style={{ width: "100%" }}
                  />
                  {error && <span className='color-red mt-3 d-block'>{error?.message}</span>}
                </>
              )}
            />
          </Col>

          <Col span={18} style={{ display: 'flex', justifyContent: 'end' }} className="mt-10">
            <Space className='mt-20 mb-5'>
              <Button >Hủy bỏ</Button>
              <Button
                htmlType='submit'
                type='primary'
              >
                Xác nhận
              </Button>
            </Space>
          </Col>

        </Row>



      </FormProvider>
    </>
  )
}
