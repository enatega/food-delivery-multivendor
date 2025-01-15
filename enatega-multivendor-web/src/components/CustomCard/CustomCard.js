import React from 'react';
import styles from './styles';
import { useTranslation } from 'react-i18next';

const CustomCard = ({ imageSrc, headingText, descriptionText, buttonText, onButtonClick }) => {
  const { t } = useTranslation();
  return (
    <div style={styles.cardContainer}>
      <img src={imageSrc} alt="custom card" style={styles.image} />
      <h4 style={styles.heading}>{t(headingText)}</h4>
      <p style={styles.description}>{t(descriptionText)}</p>
      <button style={styles.button} onClick={onButtonClick}>
        {t(buttonText)}
      </button>
    </div>
  );
};

export default CustomCard;
