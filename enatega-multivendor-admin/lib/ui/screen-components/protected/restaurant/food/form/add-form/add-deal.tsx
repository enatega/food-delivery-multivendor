import { useTranslations } from 'next-intl';
import { Sidebar } from 'primereact/sidebar';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import CustomButton from '@/lib/ui/useable-components/button';

export interface IDealFormValues {
  dealName: string;
  discountType: string;
  discountValue: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

interface IAddDealFormProps {
  visible: boolean;
  onHide: () => void;
  onSave: (deal: IDealFormValues) => void;
  initialValues?: IDealFormValues;
  productName: string;
  variationName: string;
}

const AddDealForm = ({
  visible,
  onHide,
  onSave,
  initialValues,
  productName,
  variationName,
}: IAddDealFormProps) => {
  const t = useTranslations();

  const defaultValues: IDealFormValues = {
    dealName: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    startDate: new Date(),
    endDate: new Date(),
    isActive: true,
  };

  const validationSchema = Yup.object().shape({
    dealName: Yup.string().required(t('Deal name is required')),
    discountType: Yup.string().required(t('Discount type is required')),
    discountValue: Yup.number()
      .required(t('Discount value is required'))
      .min(0, t('Value must be positive')),
    startDate: Yup.date().required(t('Start date is required')),
    endDate: Yup.date()
      .required(t('End date is required'))
      .min(Yup.ref('startDate'), t('End date must be after start date')),
  });

  const discountTypeOptions = [
    { label: 'Percentage', value: 'PERCENTAGE' },
    { label: 'Fixed Amount', value: 'FIXED' },
  ];

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      className="w-full sm:w-[500px]"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t('Add Deal')}</h2>

        {/* Read-only info */}
        <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 space-y-1">
          <p>
            <strong>{t('Product')}:</strong> {productName}
          </p>
          <p>
            <strong>{t('Variation')}:</strong> {variationName}
          </p>
        </div>

        <Formik
          initialValues={initialValues || defaultValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => {
            onSave(values);
            onHide();
          }}
        >
          {({ values, errors, setFieldValue, touched }) => (
            <Form className="flex flex-col gap-4">
              <CustomTextField
                type="text"
                name="dealName"
                placeholder={t('Deal Name')}
                value={values.dealName}
                onChange={(e) => setFieldValue('dealName', e.target.value)}
                showLabel
                style={{
                  borderColor: touched.dealName && errors.dealName ? 'red' : '',
                }}
              />
              {touched.dealName && errors.dealName && (
                <small className="text-red-500">{errors.dealName}</small>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('Discount Type')}
                </label>
                <Dropdown
                  value={values.discountType}
                  options={discountTypeOptions}
                  onChange={(e) => setFieldValue('discountType', e.value)}
                  className="w-full"
                  pt={{
                    root: {
                      className: 'border border-gray-300 rounded-md h-10',
                    },
                    input: { className: 'text-sm p-2' },
                  }}
                />
              </div>

              <div>
                <CustomNumberField
                  name="discountValue"
                  placeholder={t('Discount Value')}
                  value={values.discountValue}
                  onChange={setFieldValue}
                  showLabel
                  min={0}
                  prefix={values.discountType === 'FIXED' ? '€' : ''}
                  suffix={values.discountType === 'PERCENTAGE' ? '%' : ''}
                  max={values.discountType === 'PERCENTAGE' ? 100 : undefined}
                  style={{
                    borderColor:
                      touched.discountValue && errors.discountValue
                        ? 'red'
                        : '',
                  }}
                />
                {touched.discountValue && errors.discountValue && (
                  <small className="text-red-500">{errors.discountValue}</small>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Start Date')}
                  </label>
                  <Calendar
                    value={values.startDate}
                    onChange={(e) => setFieldValue('startDate', e.value)}
                    showIcon
                    dateFormat="dd/mm/yy"
                    className="w-full"
                    pt={{
                      input: { className: 'h-10 text-sm' },
                    }}
                  />
                  {touched.startDate && errors.startDate && (
                    <small className="text-red-500">
                      {errors.startDate as string}
                    </small>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('End Date')}
                  </label>
                  <Calendar
                    value={values.endDate}
                    onChange={(e) => setFieldValue('endDate', e.value)}
                    showIcon
                    dateFormat="dd/mm/yy"
                    minDate={values.startDate}
                    className="w-full"
                    pt={{
                      input: { className: 'h-10 text-sm' },
                    }}
                  />
                  {touched.endDate && errors.endDate && (
                    <small className="text-red-500">
                      {errors.endDate as string}
                    </small>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label
                  htmlFor="deal-status"
                  className="font-medium text-gray-700"
                >
                  {t('Active')}
                </label>
                <InputSwitch
                  inputId="deal-status"
                  checked={values.isActive}
                  onChange={(e) => setFieldValue('isActive', e.value)}
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <CustomButton
                  label={t('Save Deal')}
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-md"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Sidebar>
  );
};

export default AddDealForm;
