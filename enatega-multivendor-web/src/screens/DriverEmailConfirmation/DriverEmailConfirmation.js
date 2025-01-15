import React from "react";
import HerosectionLoginPages from "../../components/HeroSectionLoginPage/HeroSectionLoginPage";
import CustomCard from "../../components/CustomCard/CustomCard";
import CheckMark from "../../assets/images/CheckMark.png"
import { LoginHeader } from "../../components/Header";

import { useNavigate } from 'react-router-dom';
import NewFooter from "../../components/Footer/newFooter/NewFooter";

const DriverEmailConfirmation = () => {
  
  const navigate = useNavigate();  // Initialize useNavigate

  const handleButtonClick = () => {
    // Navigate to the home page
    navigate('/');
  };

  return (
    <>
      <LoginHeader showIcon/>
      <HerosectionLoginPages headingText={"emailConfirmation"} />
      <CustomCard
      imageSrc={CheckMark}
      headingText="welcomeText"
      descriptionText="emailConfirmationDescription"
      buttonText="getStarted"
      onButtonClick={handleButtonClick}
    />
      <NewFooter />
    </>
  );
};

export default DriverEmailConfirmation;
