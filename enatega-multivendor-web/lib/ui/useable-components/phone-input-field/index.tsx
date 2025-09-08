"use client";

// Interfaces
import { IPhoneTextFieldProps } from "@/lib/utils/interfaces";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// Hooks
import { useState } from "react";

// Components & Skeletons
import InputSkeleton from "../custom-skeletons/inputfield.skeleton";

export default function CustomPhoneTextField({
  className,
  style,
  showLabel,
  placeholder = "",
  isLoading = false,
  value,
  // mask,
  page,
  onChange,
}: IPhoneTextFieldProps) {
  // Transformed Country Codes
  // const transformedCountryCodes: IDropdownSelectItem[] =
  //   transformCountryCodes(CountryCodes);

  // States
  // const [selectedCountryCode, setSelectedCountryCode] =
  //   useState<IDropdownSelectItem>();
  const [, setPhone] = useState("");

  const handlePhoneInputChange = (phone: string) => {
    setPhone(phone);
    onChange?.(phone);
  };

  // const inputStyle =
  //   page === "vendor-profile-edit" ? { width: "100%" } : { width: "100%" };

  // const MaininputStyle =
  //   page === 'vendor-profile-edit'
  //     ? { width: '100%', borderRadius: '0 5px 5px 0', height: '40px' }
  //     : { width: '100%', borderRadius: '0 5px 5px 0', height: '40px' };

  const MaininputStyle =
    page === "vendor-profile-edit"
      ? {
          width: "100%",
          borderRadius: "0 5px 5px 0",
          height: "40px",
          borderColor: style?.borderColor || "",
        }
      : {
          width: "100%",
          borderRadius: "0 5px 5px 0",
          height: "40px",
          borderColor: style?.borderColor || "",
        };

  return !isLoading ? (
    <div className="relative flex w-full flex-col justify-center gap-y-1">
      {showLabel && (
        <label htmlFor="phone" className="text-sm font-[500] dark:text-white">
          {placeholder}
        </label>
      )}
      {/* <div style={style} className={`flex items-center ${className}`}> */}
      <div
        style={style}
        className={`flex items-center ${className} ${style?.borderColor === "red" ? "phone-error" : ""} bg-white text-black dark:bg-gray-800 dark:text-white `}
      >
        <PhoneInput
          country={"au"}
          value={value ?? ""}
          onChange={handlePhoneInputChange}
          disableSearchIcon={true}
          searchPlaceholder="Search country"
          inputStyle={{
            ...MaininputStyle,
            borderColor: style?.borderColor || MaininputStyle.borderColor,
            backgroundColor: "white",
            color: "#111827", // gray-900
          }}
          buttonStyle={{
            borderRight: "1px solid #ddd",
            width: "40px",
            backgroundColor: "white",
          }}
          searchStyle={{
            position: "relative",
            width: "100%",
            margin: "0",
            padding: "5px",
            borderRadius: "8px",
          }}
          containerClass="custom-phone-input w-full"
        />

        <style jsx global>{`
          /* Light mode dropdown */
          .custom-phone-input .country-list {
            background-color: white;
            color: #111827; /* gray-900 */
            border: 1px solid #d1d5db; /* gray-300 */
            border-radius: 0.5rem;
          }
          .custom-phone-input .search {
            background-color: white;
            color: #111827;
            border: 1px solid #d1d5db;
          }
          .custom-phone-input .country-list .country:hover {
            background-color: #f3f4f6; /* gray-100 */
          }
          .custom-phone-input .country-list .country.highlight {
            background-color: #e5e7eb; /* gray-200 */
          }

          /* Dark mode input */
          html.dark .custom-phone-input .form-control {
            background-color: #1f2937 !important; /* gray-800 */
            color: #f9fafb !important; /* gray-50 */
            border: 1px solid #4b5563 !important; /* gray-600 */
          }

          /* Dark mode flag button */
          html.dark .custom-phone-input .flag-dropdown,
          html.dark .custom-phone-input .selected-flag {
            background-color: #1f2937 !important; /* gray-800 */
            border: 1px solid #374151 !important; /* gray-700 */
          }

          /* Force flag button to stay gray when open/clicked */
          html.dark .react-tel-input .flag-dropdown.open,
          html.dark .react-tel-input .selected-flag:focus,
          html.dark .react-tel-input .selected-flag:active {
            background-color: #1f2937 !important;
            box-shadow: none !important;
            outline: none !important;
          }

          /* Remove weird hover background */
          .react-tel-input .flag-dropdown:hover,
          .react-tel-input .selected-flag:hover {
            background-color: transparent !important;
          }

          /* Dark mode dropdown */
          html.dark .custom-phone-input .country-list {
            background-color: #1f2937 !important; /* gray-800 */
            color: #f9fafb !important;
            border: 1px solid #374151 !important; /* gray-700 */
            border-radius: 0.5rem;
          }
          html.dark .custom-phone-input .search {
            background-color: #374151 !important; /* gray-700 */
            color: #f9fafb !important;
            border: 1px solid #4b5563 !important;
          }
          html.dark .custom-phone-input .country-list .country:hover {
            background-color: #374151 !important; /* gray-700 */
          }
          html.dark .custom-phone-input .country-list .country.highlight {
            background-color: #94e469 !important; /* theme green */
            color: #111827 !important; /* gray-900 */
          }

          html[dir="rtl"] .custom-phone-input .selected-flag {
            right: 0;
            left: auto !important;
            padding-right: 0.5rem; /* spacing so flag doesn’t touch border */
          }
          /* ✅ RTL Arrow Fix */
          html[dir="rtl"] .custom-phone-input .selected-flag .arrow {
            right: 20px !important; /* place arrow inside the box */
            left: auto !important;
            display: block !important;
            position: absolute;
          }
        `}</style>
      </div>
    </div>
  ) : (
    <InputSkeleton />
  );
}
