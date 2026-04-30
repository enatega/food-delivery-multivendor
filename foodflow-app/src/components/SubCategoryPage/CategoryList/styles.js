// SubcategoryList/styles.js
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scaling';

const styles = (props = null) => StyleSheet.create({
  container: {
    backgroundColor: props?.themeBackground,
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: props?.borderColor
  },
  listContainer: {
    paddingHorizontal: scale(15)
  },
  subcategoryItem: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    backgroundColor: props?.gray100,
    marginRight: scale(8)
  },
  selectedSubcategoryItem: {
    backgroundColor: props?.buttonBackground
  },
  subcategoryText: {
    fontSize: scale(14)
  },
  selectedSubcategoryText: {
    color: props?.buttonText
  }
});

export default styles;