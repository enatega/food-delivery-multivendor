import { verticalScale, scale } from '../../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    topbrandsSec:{
        ...alignment.PLmedium,
    },
    brandImg:{
        width: '100%', 
        // aspectRatio: 18/8,
        height:scale(60) 
      },
      topbrandsContainer:{
        width: scale(90), 
        marginTop:scale(7),
        ...alignment.MRmedium      
      },
      brandImgContainer:{
        backgroundColor: '#F3F4F6',
        borderWidth:1,
        borderColor:'#E5E7EB',
        borderRadius:8,
        padding:scale(8),
      },
      brandName:{
        marginTop:scale(5),
        marginBottom:scale(2)
      },
      
      
  })

export default styles
