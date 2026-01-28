import { StyleSheet } from "react-native"
import { scale, verticalScale } from "../../../utils/scaling"

const styles = (props = null) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: props?.themeBackground
      },
      scrollView: {
        flex: 1
      },
      scrollContent: {
        paddingBottom: verticalScale(20)
      },
      section: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        borderBottomWidth: 1,
        borderBottomColor: props?.gray200 || '#E5E7EB'
      },
      sectionTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        marginBottom: verticalScale(12)
      },
      statusBadge: {
        backgroundColor: '#FFEEC1',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: scale(16),
        alignSelf: 'flex-start'
      },
      statusText: {
        fontSize: scale(10),
        fontWeight: '500'
      },
      scheduledRow: {
        flexDirection: 'row',
        alignItems: 'center'
      },
      calendarIcon: {
        marginRight: scale(8)
      },
      scheduledText: {
        fontSize: scale(14)
      },
      paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      paymentMethod: {
        fontSize: scale(14),
        flex: 1
      },
      paymentAmount: {
        fontSize: scale(14),
        fontWeight: '600'
      },
      buttonSpacer: {
        height: verticalScale(20)
      },
      stickyBottomContainer: {
        backgroundColor: props?.themeBackground,
        paddingTop: scale(12),
        paddingHorizontal: scale(16),
        paddingBottom: scale(12),
        borderTopWidth: 1,
        borderTopColor: props?.gray200 || '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5
      },
      buttonContainer: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        backgroundColor: props?.themeBackground,
        // borderTopWidth: 1,
        borderTopColor: props?.gray200 || '#E5E7EB'
      },
      increaseTipButton: {
        backgroundColor: props?.colorBgSecondary || '#CCE9F5',
        borderRadius: scale(12),
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(16),
        marginBottom: verticalScale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      },
      trackProgressButton: {
        backgroundColor: props?.singlevendorcolor || '#0090CD',
        borderRadius: scale(12),
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
  
      },
      buttonText: {
        fontSize: scale(13),
        fontWeight: '500'
      }
    })

export default styles