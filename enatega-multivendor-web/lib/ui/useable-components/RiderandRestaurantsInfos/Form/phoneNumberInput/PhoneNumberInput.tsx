import PhoneInput from "react-phone-input-2";
import { useField } from "formik";

const PhoneNumberInput = () => {
  const [field, , helpers] = useField("phoneNumber");
  return (
    <div>
      <PhoneInput
  country={"au"}
  value={field.value}
  onChange={(value) => helpers.setValue(value)}
  inputProps={{
    name: "phoneNumber",
    id: "phoneNumber",
    className:
      "w-full border-2 border-gray-200 dark:border-gray-600 py-2 pl-12 rounded-lg " +
      "focus:outline-none focus:ring-0 active:outline-none " +
      "bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100",
  }}
  containerClass="custom-phone-input w-full"
  buttonClass="custom-phone-button"
/>

<style jsx global>{`
  /* Light mode */
  .custom-phone-input .flag-dropdown {
    background-color: white;
    border-right: 1px solid #d1d5db; /* gray-300 */
    border-radius: 0.5rem 0 0 0.5rem;
  }

  .custom-phone-input .form-control {
    background-color: white;
    color: #111827; /* gray-900 */
  }

  .custom-phone-input .country-list {
    background-color: white;
    color: #111827;
    border: 1px solid #d1d5db;
  }

  /* Dark mode */
  html.dark .custom-phone-input .form-control {
    background-color: #374151 !important; /* gray-700 */
    color: #f9fafb !important; /* gray-50 */
    border: 1px solid #4b5563 !important; /* gray-600 */
  }

  html.dark .custom-phone-input .flag-dropdown {
    background-color: #374151 !important; /* gray-700 */
    border: 1px solid #4b5563 !important; /* gray-600 */
  }

  html.dark .custom-phone-input .selected-flag {
    background-color: #374151 !important;
  }

  html.dark .custom-phone-input .country-list {
    background-color: #1f2937 !important; /* gray-800 */
    color: #f9fafb !important;
    border: 1px solid #374151 !important; /* gray-700 */
  }

  html.dark .custom-phone-input .country-list .country:hover {
    background-color: #374151 !important; /* gray-700 */
  }

  html.dark .custom-phone-input .country-list .country.highlight {
    background-color: #94e469 !important; /* theme green */
    color: #111827 !important; /* gray-900 text */
  }
`}</style>


    </div>
  );
};

export default PhoneNumberInput;

