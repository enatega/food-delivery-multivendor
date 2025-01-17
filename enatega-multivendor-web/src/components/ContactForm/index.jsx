import React from "react";
import FormCard from "../FormCard/FormCard";
import DoubleTextFieldRow from "../DoubleTextField/DoubleTextField";
import SingleTextField from "../Textfield/TextField";
import PhoneTextField from "../PhoneTextField/PhoneTextField";
import TextBox from "../TextBox/textBox";
import SubmitButton from "../SubmitButton/SubmitButton";
import { useTranslation } from "react-i18next";

const ContactForm = ({
  heading,
  descriptionText,
  formData,
  onChange,
  onSubmit,
  loading,
  isPhoneForm,
}) => {
  const { t } = useTranslation();
  return (
    <FormCard heading={heading} descriptionText={descriptionText}>
      <form onSubmit={onSubmit}>
        <DoubleTextFieldRow
          placeholder1={t('firstName')}
          name1="firstName"
          value1={formData.firstName}
          placeholder2={t('lastName')}
          name2="lastName"
          value2={formData.lastName}
          onChange={onChange}
          required
        />
        {isPhoneForm ? (
          <PhoneTextField
            placeholder={t('phoneNumber')}
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onChange}
            required
          />
        ) : (
          <SingleTextField
            placeholder={t('emailAddress')}
            name="email"
            value={formData.email}
            onChange={onChange}
            required
          />
        )}
        <TextBox
          placeholder={t('explainQuery')}
          name="message"
          value={formData.message}
          onChange={onChange}
          required
        />
        <SubmitButton label={t('submit')} type="submit" loading={loading} />
      </form>
    </FormCard>
  );
};

export default ContactForm;
