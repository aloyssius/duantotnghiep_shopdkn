import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// antd
import { Input } from 'antd';

RHFInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  textarea: PropTypes.bool,
};

const { TextArea } = Input;

export default function RHFInput({ name, label, required, textarea, ...other }) {

  const { control } = useFormContext();

  if (textarea) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            {label &&
              <label className='mt-15 d-block' style={{ fontWeight: '500' }}>
                {label}
                <span className={required && 'required'}></span>
              </label>
            }
            <TextArea className='mt-13' status={error && 'error'} {...field} {...other} />
            {error && <span className='color-red mt-3 d-block'>{error?.message}</span>}
          </>
        )}

      />
    )
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          {label &&
            <label className='mt-15 d-block' style={{ fontWeight: '500' }}>
              {label}
              <span className={required && 'required'}></span>
            </label>
          }
          <Input className='mt-13' status={error && 'error'} {...field} {...other} />
          {error && <span className='color-red mt-3 d-block'>{error?.message}</span>}
        </>
      )}

    />
  )
}
