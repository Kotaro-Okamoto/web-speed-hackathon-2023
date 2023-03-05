import { useFormik } from 'formik';
import type { ChangeEventHandler, FC } from 'react';
import type { Address } from '../../../types/zipcode-ja';

import { PrimaryButton } from '../../foundation/PrimaryButton';
import { TextInput } from '../../foundation/TextInput';

import * as styles from './OrderForm.styles';

type OrderFormValue = {
  zipCode: string;
  prefecture: string;
  city: string;
  streetAddress: string;
};

type Props = {
  onSubmit: (orderFormValue: OrderFormValue) => void;
};

export const OrderForm: FC<Props> = ({ onSubmit }) => {
  const formik = useFormik<OrderFormValue>({
    initialValues: {
      city: '',
      prefecture: '',
      streetAddress: '',
      zipCode: '',
    },
    onSubmit,
  });

  const getAddress = async (zipCode: string): Promise<Address> => {
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`);
    const address = await res.json();
    return address;
  };

  const zipCodeLength = 7;
  const handleZipcodeChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    formik.handleChange(event);
    const zipCode = event.target.value;
    if (zipCode.length === zipCodeLength) {
      const { results } = await getAddress(zipCode);
      const prefecture = results[0].address1;
      const city = results[0].address2 + results[0].address3;

      formik.setFieldValue('prefecture', prefecture);
      formik.setFieldValue('city', city);
    }
  };

  return (
    <div className={styles.container()}>
      <form className={styles.form()} data-testid="order-form" onSubmit={formik.handleSubmit}>
        <div className={styles.inputList()}>
          <TextInput
            required
            id="zipCode"
            label="郵便番号"
            onChange={handleZipcodeChange}
            placeholder="例: 1500042"
            value={formik.values.zipCode}
          />
          <TextInput
            required
            id="prefecture"
            label="都道府県"
            onChange={formik.handleChange}
            placeholder="例: 東京都"
            value={formik.values.prefecture}
          />
          <TextInput
            required
            id="city"
            label="市区町村"
            onChange={formik.handleChange}
            placeholder="例: 渋谷区宇田川町"
            value={formik.values.city}
          />
          <TextInput
            required
            id="streetAddress"
            label="番地・建物名など"
            onChange={formik.handleChange}
            placeholder="例: 40番1号 Abema Towers"
            value={formik.values.streetAddress}
          />
        </div>
        <div className={styles.purchaseButton()}>
          <PrimaryButton size="lg" type="submit">
            購入
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
