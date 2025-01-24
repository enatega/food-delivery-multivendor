import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useStyles from "./style";
import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";

const PhoneTextField = ({ value, onChange, placeholder, name }) => {
  const classes = useStyles();
  const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <PhoneInput
      placeholder={placeholder || "Enter phone number"}
      country={"au"} // Update country code as needed
      value={value}
      onChange={(phone) => onChange({ target: { name, value: phone?.startsWith("+") ? phone : `+${phone}` } })} 
      inputProps={{
        name: name,
      }}
      containerStyle={{
        textAlign: "right",
        marginBottom: "20px",
        width: "100%", // Full width to adapt to container
        [theme.breakpoints.down("sm")]: {
          marginBottom: "8px",
        },
      }}
      inputStyle={{
        paddingLeft: 40, // Adjust padding for flag
        width: "100%",
        maxWidth: "500px",
        height: "40px",
        borderRadius: "8px", // Square-like shape with rounded corners
        border: "1px solid #E3E3E3", // Thin border
        backgroundColor: "#ffff",
        // boxShadow: "1px 4px 9px 0px #0000001A",
        fontFamily: "Poppins",
        fontSize: "15px",
        fontWeight: "400",
        lineHeight: "24px",
        color: "#fffff",
        [theme.breakpoints.down("sm")]: {
          height: "35px",
        },
      }}
      buttonStyle={{
        background: "none", // Remove default background
        border: "none", // Remove default border
        borderRadius: "100px", // Rounded flag button
        width: "40px",
        height: "85%", // Match the input height
        padding: 0, // Remove padding
        margin: 3, // Remove margin
        // backgroundColor: 'red'
      }}
      dropdownStyle={{
        borderRadius: "8px", // Rounded dropdown
        boxShadow: "1px 4px 9px 0px #0000001A",
        backgroundColor: "#fffff",
        textAlign: "left",
      }}
      inputClass={`${classes.phoneInput} phone-input-container`}
    />
  );
};

export default PhoneTextField;
