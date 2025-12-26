import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { scale } from '../../../utils/scaling';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';
import { useTranslation } from 'react-i18next';
import OrderFeesModal from './OrderFeesModal';

const OrderProgressBanner = ({ 
  currentTotal = 0, 
  minimumOrder = 10, 
  lowOrderFeeThreshold = 15,
  lowOrderFee = 2,
  currencySymbol = '€'
}) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const [showModal, setShowModal] = useState(false);

  // Determine message and progress state
  const getState = () => {
    // State 1: Below minimum order
    if (currentTotal < minimumOrder) {
      const progress = (currentTotal / minimumOrder) * 33.33;
      return {
        text: `You can't place order below `,
        boldText: `${currencySymbol}${minimumOrder}`,
        progress1: Math.min(progress, 33.33),
        progress2: 0,
        progress3: 0
      };
    } 
    // State 2: Just reached minimum order
    else if (currentTotal >= minimumOrder && currentTotal < minimumOrder + 0.5) {
      return {
        text: "You've reached minimum spend limit",
        boldText: null,
        progress1: 33.33,
        progress2: 0,
        progress3: 0
      };
    }
    // State 3: Above minimum but low-order fee applies
    else if (currentTotal >= minimumOrder && currentTotal < lowOrderFeeThreshold - 2) {
      const progress = ((currentTotal - minimumOrder) / (lowOrderFeeThreshold - minimumOrder)) * 33.33;
      return {
        text: `A `,
        boldText: `${currencySymbol}${lowOrderFee}`,
        text2: ` low-order fee applies`,
        progress1: 33.33,
        progress2: Math.min(progress, 33.33),
        progress3: 0
      };
    }
    // State 4: Close to avoiding fee
    else if (currentTotal >= lowOrderFeeThreshold - 2 && currentTotal < lowOrderFeeThreshold) {
      const remaining = (lowOrderFeeThreshold - currentTotal).toFixed(2);
      const progress = ((currentTotal - minimumOrder) / (lowOrderFeeThreshold - minimumOrder)) * 33.33;
      return {
        text: `Add `,
        boldText: `${currencySymbol}${remaining}`,
        text2: ` more to avoid the `,
        boldText2: `${currencySymbol}${lowOrderFee}`,
        text3: ` low-order fee`,
        progress1: 33.33,
        progress2: Math.min(progress, 33.33),
        progress3: 0
      };
    }
    // State 5: No fee applied
    else {
      return {
        text: 'No low-order fee applied',
        boldText: null,
        progress1: 33.33,
        progress2: 33.33,
        progress3: 33.33
      };
    }
  };

  const state = getState();

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles().content}>
        <View style={styles().textWrapper}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            small
            isRTL
            style={styles().text}
          >
            {state.text}
            {state.boldText && (
              <TextDefault
                textColor={currentTheme.fontMainColor}
                bolder
                small
              >
                {state.boldText}
              </TextDefault>
            )}
            {state.text2 && state.text2}
            {state.boldText2 && (
              <TextDefault
                textColor={currentTheme.fontMainColor}
                bolder
                small
              >
                {state.boldText2}
              </TextDefault>
            )}
            {state.text3 && state.text3}
          </TextDefault>
        </View>
        <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.7}>
          <Feather name="info" size={16} color={currentTheme.fontSecondColor} />
        </TouchableOpacity>
      </View>
      
      {/* Segmented Progress Bar */}
      <View style={styles().progressContainer}>
        {/* Segment 1 */}
        <View style={styles(currentTheme).progressSegment}>
          <View 
            style={[
              styles().progressFill,
              { width: `${(state.progress1 / 33.33) * 100}%` }
            ]} 
          />
        </View>
        
        {/* Gap */}
        <View style={styles().progressGap} />
        
        {/* Segment 2 */}
        <View style={styles(currentTheme).progressSegment}>
          <View 
            style={[
              styles().progressFill,
              { width: `${(state.progress2 / 33.33) * 100}%` }
            ]} 
          />
        </View>
        
        {/* Gap */}
        <View style={styles().progressGap} />
        
        {/* Segment 3 */}
        <View style={styles(currentTheme).progressSegment}>
          <View 
            style={[
              styles().progressFill,
              { width: `${(state.progress3 / 33.33) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Modal */}
      <OrderFeesModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        minimumOrder={minimumOrder}
        lowOrderFeeThreshold={lowOrderFeeThreshold}
        lowOrderFee={lowOrderFee}
        currencySymbol={currencySymbol}
      />
    </View>
  );
};

const styles = (currentTheme = null) =>
  StyleSheet.create({
    container: {
      backgroundColor: currentTheme ? currentTheme.themeBackground : '#fff',
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      borderBottomWidth: 1,
      borderBottomColor: currentTheme ? currentTheme.gray200 : '#E5E7EB'
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scale(8),
      gap: scale(4)
    },
    textWrapper: {
      flexShrink: 1
    },
    text: {
      textAlign: 'center'
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: scale(4)
    },
    progressSegment: {
      flex: 1,
      height: scale(4),
      backgroundColor: currentTheme ? currentTheme.gray200 : '#E5E7EB',
      borderRadius: scale(2),
      overflow: 'hidden'
    },
    progressGap: {
      width: scale(4)
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#0EA5E9',
      borderRadius: scale(2)
    }
  });

export default OrderProgressBanner;
