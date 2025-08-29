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
          className: "w-full border-2 border-gray-100 py-1 pl-[40px] focus:outline-none focus:ring-0 active:outline-none rounded-lg",
        }}
        buttonStyle={{
          background: "none", 
          border: "none", 
          borderRadius: "100px", 
          width: "40px",
          height: "85%", 
          padding: 0, 
          margin: 0, 
        
        }}
        containerStyle={{
          width: "100%",
        }}
      />
    </div>
  );
};

export default PhoneNumberInput;

